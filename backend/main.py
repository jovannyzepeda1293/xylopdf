from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Response, Form, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, StreamingResponse
import stripe
import asyncio
import redis.asyncio as aioredis
from fastapi.middleware.cors import CORSMiddleware
from pdf2docx import Converter
from pypdf import PdfWriter, PdfReader
import io
import os
import tempfile
import zipfile
import subprocess
import json
from typing import List
import pdfplumber
import pandas as pd
from pptx import Presentation
from pptx.util import Inches
import psycopg2
from dotenv import load_dotenv
import httpx
from datetime import datetime, timedelta, timezone
import base64
import redis

# Load .env
load_dotenv()

# Redis Config for security/banning
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
r = redis.from_url(redis_url, decode_responses=True)
async_r = aioredis.from_url(redis_url, decode_responses=True)
BAN_THRESHOLD = int(os.getenv("BAN_THRESHOLD", "10"))
BAN_DURATION = 3600 # 1 hour in seconds

try:
    import fitz # PyMuPDF
except ImportError:
    fitz = None

try:
    from PIL import Image
except ImportError:
    Image = None

app = FastAPI(title="PremiumPDF API")

# Enable CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise Exception("DATABASE_URL not found in environment")
    return psycopg2.connect(db_url)

# Stripe Config
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
stripe_webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        # user_id -> list of websockets
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        user_id = str(user_id)
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"WS: User {user_id} connected. Total users connected: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        user_id = str(user_id)
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        print(f"WS: User {user_id} disconnected.")

    async def send_personal_message(self, message: dict, user_id: str):
        user_id = str(user_id)
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"WS Error sending to {user_id}: {e}")

manager = ConnectionManager()

# Background task to listen to Redis and broadcast to WebSockets
async def redis_listener():
    pubsub = async_r.pubsub()
    await pubsub.subscribe("user_updates")
    print("WS: Started Redis PubSub listener for 'user_updates'")
    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                try:
                    data = json.loads(message["data"])
                    user_id = data.get("user_id")
                    if user_id:
                        print(f"WS: Internal notification for user {user_id}")
                        await manager.send_personal_message(data, str(user_id))
                except Exception as e:
                    print(f"WS Error processing Redis message: {e}")
    except Exception as e:
        print(f"WS Redis listener failed: {e}")
    finally:
        await pubsub.unsubscribe("user_updates")

@app.on_event("startup")
async def startup_event():
    # Start Redis listener in background
    asyncio.create_task(redis_listener())

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    print(f"WS Attempting connection for user {user_id}")
    try:
        await manager.connect(websocket, user_id)
        while True:
            # Keep connection alive
            # If client sends nothing, this will block.
            # If client sends heartbeat, we log it.
            data = await websocket.receive_text()
            print(f"WS received from {user_id}: {data}")
    except WebSocketDisconnect:
        print(f"WS: User {user_id} disconnected (normal).")
        manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"WS unexpected error for {user_id}: {type(e).__name__}: {e}")
        manager.disconnect(websocket, user_id)

@app.post("/webhook-stripe")
async def stripe_webhook(request: Request):
    ip = request.client.host
    
    # Check if IP is banned
    if r.get(f"ban:{ip}"):
        print(f"Python Security: Bloqueado Intento de IP baneada: {ip}")
        raise HTTPException(status_code=403, detail="Acceso denegado temporalmente por múltiples fallos.")

    try:
        # Intentamos obtener el JSON del request
        payload_raw = await request.body()
        payload_data = json.loads(payload_raw)
        
        # Caso especial: n8n manda una lista [{ "headers": ..., "body": ... }]
        if isinstance(payload_data, list) and len(payload_data) > 0 and "body" in payload_data[0]:
            n8n_item = payload_data[0]
            event = n8n_item["body"]
            # Si n8n ya parseó el body, lo usamos directo, si no lo parseamos
            if isinstance(event, str):
                event = json.loads(event)
            print("Python Stripe Webhook: Procesando datos desde n8n")
        else:
            # Caso normal: Stripe directo
            sig_header = request.headers.get("stripe-signature")
            if not stripe_webhook_secret:
                raise HTTPException(status_code=400, detail="STRIPE_WEBHOOK_SECRET missing")
            event = stripe.Webhook.construct_event(
                payload_raw, sig_header, stripe_webhook_secret
            )
    except Exception as e:
        print(f"Stripe Webhook verification/parsing failed: {str(e)}")
        
        # Lógica de baneo progresivo
        fails = r.incr(f"fails:{ip}")
        r.expire(f"fails:{ip}", 300) # Expira en 5 minutos
        
        if fails >= BAN_THRESHOLD:
            r.setex(f"ban:{ip}", BAN_DURATION, "true")
            print(f"Python Security: BANUEADO IP {ip} por {BAN_DURATION}s tras {fails} fallos.")
            
        # Si falla la verificación pero hay un body, intentamos procesar (para pruebas con n8n)
        try:
            event = json.loads(payload_raw)
            if isinstance(event, list): event = event[0].get("body", event[0])
        except:
            raise HTTPException(status_code=400, detail=str(e))

    # Convert to dict if it's a stripe object (SDK v8+)
    if not isinstance(event, dict) and hasattr(event, "to_dict"):
        event = event.to_dict()

    data = event.get('data', {}).get('object', {})
    event_type = event.get('type')

    print(f"Python Stripe Webhook: Recibido evento {event_type}")

    # Pago exitoso (Inicial o Renovacion)
    if event_type in ["checkout.session.completed", "invoice.payment_succeeded"]:
        customer_email = data.get("customer_email") or data.get("customer_details", {}).get("email") or data.get("metadata", {}).get("email")
        customer_id = data.get("customer")
        
        # Subscription ID puede estar en varios lugares según el tipo de evento
        subscription_id = data.get("subscription")
        if not subscription_id:
            # En invoices de n8n suele estar en parent.subscription_details
            subscription_id = data.get("parent", {}).get("subscription_details", {}).get("subscription")
        
        if customer_email:
            try:
                conn = get_db_connection()
                cur = conn.cursor()
                
                # Buscar Usuario
                cur.execute("SELECT id FROM users WHERE email = %s", (customer_email.lower(),))
                user_row = cur.fetchone()
                
                if user_row:
                    user_id = user_row[0]
                    # Calcular expiracion: period_end + 1 dia (según n8n/usuario)
                    lines = data.get("lines", {}).get("data", [])
                    period_end_ts = None
                    if lines:
                        period_end_ts = lines[0].get("period", {}).get("end")
                    
                    if period_end_ts:
                        # Convert timestamp to datetime and add 1 day
                        expires_at = datetime.fromtimestamp(period_end_ts, timezone.utc) + timedelta(days=1)
                    else:
                        # Fallback a 31 días si no hay timestamp
                        expires_at = datetime.now(timezone.utc) + timedelta(days=31)
                    
                    last_payment = datetime.now(timezone.utc)
                    
                    # Extraer el país del cliente (Invoice o Checkout session)
                    country = data.get("customer_address", {}).get("country") or data.get("customer_details", {}).get("address", {}).get("country") or data.get("metadata", {}).get("country")
                    
                    upsert_query = """
                    INSERT INTO subscriptions (user_id, last_payment_date, expires_at, status, customer_id, subscription_id, canceled, updated_at, country)
                    VALUES (%s, %s, %s, %s, %s, %s, FALSE, CURRENT_TIMESTAMP, %s)
                    ON CONFLICT (user_id) DO UPDATE SET
                        last_payment_date = EXCLUDED.last_payment_date,
                        expires_at = EXCLUDED.expires_at,
                        status = EXCLUDED.status,
                        customer_id = EXCLUDED.customer_id,
                        subscription_id = EXCLUDED.subscription_id,
                        canceled = FALSE,
                        updated_at = CURRENT_TIMESTAMP,
                        country = EXCLUDED.country;
                    """
                    cur.execute(upsert_query, (user_id, last_payment, expires_at, 1, customer_id, subscription_id, country))
                    conn.commit()
                    print(f"Python Sub Update: Success for {customer_email}. Expires: {expires_at}")
                    
                    # Notify via Redis
                    r.publish("user_updates", json.dumps({
                        "user_id": str(user_id),
                        "type": "subscription_updated",
                        "status": "active"
                    }))
                else:
                    print(f"Python Webhook Warning: Usuario no encontrado para {customer_email}")
                
                cur.close()
                conn.close()
            except Exception as db_err:
                print(f"Python Webhook DB Error: {str(db_err)}")

    # Suscripcion borrada o pago fallido
    elif event_type in ["customer.subscription.deleted", "invoice.payment_failed", "customer.subscription.updated"]:
        customer_id = data.get("customer")
        subscription_id = data.get("subscription") or data.get("id")
        
        # Para renovaciones/actualizaciones revisamos si se marcó para cancelar al final del periodo
        is_canceled = data.get("cancel_at_period_end", False)
        
        if customer_id:
            try:
                conn = get_db_connection()
                cur = conn.cursor()
                
                if event_type == "customer.subscription.deleted":
                    # Si se borra, es el final definitivo. La cuenta se desactiva.
                    # (Stripe envía este evento al EXHALAR el periodo si cancel_at_period_end era True)
                    cur.execute("UPDATE subscriptions SET status = 0, canceled = TRUE WHERE customer_id = %s", (customer_id,))
                    print(f"Python Sub Update: Final Deactivation for {customer_id}")
                elif event_type == "customer.subscription.updated":
                    if is_canceled:
                        # Si se marca para cancelar, ponemos canceled=TRUE pero dejamos status=1 (pueden seguir usando)
                        cur.execute("UPDATE subscriptions SET canceled = TRUE WHERE customer_id = %s", (customer_id,))
                        print(f"Python Sub Update: Marked as Canceled (Active until period end) for {customer_id}")
                    else:
                        # Si se des-cancela o se actualiza normal, nos aseguramos que canceled sea FALSE
                        cur.execute("UPDATE subscriptions SET canceled = FALSE, status = 1 WHERE customer_id = %s", (customer_id,))
                elif event_type == "invoice.payment_failed":
                    # Si el pago falla reiteradamente, desactivamos
                    cur.execute("UPDATE subscriptions SET status = 0 WHERE customer_id = %s", (customer_id,))
                    print(f"Python Sub Update: Payment Failed, Deactivated for {customer_id}")
                
                conn.commit()
                cur.close()
                conn.close()
            except Exception as db_err:
                print(f"Python Webhook DB Error: {str(db_err)}")

    return {"status": "success"}



@app.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    # ... (existing merge logic)
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 2 archivos para unir.")
    
    for file in files:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail=f"El archivo {file.filename} no es un PDF válido.")

    try:
        merger = PdfWriter()
        for file in files:
            file_content = await file.read()
            merger.append(io.BytesIO(file_content))

        output_stream = io.BytesIO()
        merger.write(output_stream)
        output_stream.seek(0)
        
        return Response(
            content=output_stream.getvalue(),
            media_type="application/pdf",
            headers={'Content-Disposition': 'attachment; filename="merged_document.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        merger.close()

@app.post("/split")
async def split_pdf(
    file: UploadFile = File(...),
    cut_points: str = Query(..., description="Puntos de corte separados por coma (ej: '5,10')")
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")

    try:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        total_pages = len(reader.pages)
        
        # Parse and validate cut points
        try:
            cuts = [int(p.strip()) for p in cut_points.split(",") if p.strip()]
        except ValueError:
            raise HTTPException(status_code=400, detail="Los puntos de corte deben ser números válidos.")

        # Add 0 and total_pages to create ranges
        full_cuts = sorted(list(set([0] + cuts + [total_pages])))
        
        # Validation
        if any(c <= 0 for c in cuts) or any(c >= total_pages for c in cuts):
             raise HTTPException(status_code=400, detail=f"Los puntos de corte deben estar entre 1 y {total_pages - 1}.")

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
            for i in range(len(full_cuts) - 1):
                start = full_cuts[i]
                end = full_cuts[i+1]
                
                writer = PdfWriter()
                for page_num in range(start, end):
                    writer.add_page(reader.pages[page_num])
                
                pdf_output = io.BytesIO()
                writer.write(pdf_output)
                
                zip_file.writestr(f"parte_{i+1}_paginas_{start+1}-{end}.pdf", pdf_output.getvalue())
                writer.close()

        zip_buffer.seek(0)
        return Response(
            content=zip_buffer.getvalue(),
            media_type="application/zip",
            headers={'Content-Disposition': 'attachment; filename="dividido_premiumpdf.zip"'}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al dividir: {str(e)}")

@app.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")

    try:
        # Create temp files for pdf2docx
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf", mode='wb') as temp_pdf:
            content = await file.read()
            temp_pdf.write(content)
            temp_pdf_path = temp_pdf.name

        temp_docx_path = temp_pdf_path.replace(".pdf", ".docx")

        # Perform conversion
        cv = Converter(temp_pdf_path)
        cv.convert(temp_docx_path, start=0, end=None)
        cv.close()

        # Read the converted file
        with open(temp_docx_path, "rb") as f:
            docx_content = f.read()

        # Cleanup
        os.unlink(temp_pdf_path)
        os.unlink(temp_docx_path)

        return Response(
            content=docx_content,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={'Content-Disposition': f'attachment; filename="{file.filename.replace(".pdf", ".docx")}"'}
        )

    except Exception as e:
        # Cleanup in case of error
        if 'temp_pdf_path' in locals() and os.path.exists(temp_pdf_path):
            os.unlink(temp_pdf_path)
        if 'temp_docx_path' in locals() and os.path.exists(temp_docx_path):
            os.unlink(temp_docx_path)
        raise HTTPException(status_code=500, detail=f"Error en la conversión: {str(e)}")

@app.post("/rotate-pdf")
async def rotate_pdf(
    file: UploadFile = File(...),
    pages: str = Query("", description="Páginas a rotar (ej: '1, 3-5'). Vacío para todas."),
    angle: int = Query(90, description="Ángulo de rotación (90, 180, 270)")
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")
    
    if angle not in [90, 180, 270]:
        raise HTTPException(status_code=400, detail="El ángulo debe ser 90, 180 o 270.")

    try:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        writer = PdfWriter()
        total_pages = len(reader.pages)

        # Parse pages
        target_pages = set()
        if pages.strip():
            parts = pages.split(",")
            for part in parts:
                part = part.strip()
                if "-" in part:
                    try:
                        start, end = map(int, part.split("-"))
                        if start < 1 or end > total_pages or start > end:
                            raise HTTPException(status_code=400, detail=f"Rango inválido: {start}-{end}. El documento tiene {total_pages} páginas.")
                        target_pages.update(range(start - 1, end))
                    except ValueError:
                        raise HTTPException(status_code=400, detail=f"Formato de rango inválido: {part}")
                else:
                    try:
                        p = int(part)
                        if p < 1 or p > total_pages:
                            raise HTTPException(status_code=400, detail=f"Página fuera de rango: {p}. El documento tiene {total_pages} páginas.")
                        target_pages.add(p - 1)
                    except ValueError:
                        raise HTTPException(status_code=400, detail=f"Número de página inválido: {part}")
        else:
            # Rotate all pages if none specified
            target_pages = set(range(total_pages))

        for i in range(total_pages):
            page = reader.pages[i]
            if i in target_pages:
                page.rotate(angle)
            writer.add_page(page)

        output_stream = io.BytesIO()
        writer.write(output_stream)
        output_stream.seek(0)

        return Response(
            content=output_stream.getvalue(),
            media_type="application/pdf",
            headers={'Content-Disposition': f'attachment; filename="rotado_{file.filename}"'}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al rotar: {str(e)}")

@app.post("/delete-pages")
async def delete_pages(
    file: UploadFile = File(...),
    pages_to_delete: str = Query(..., description="Números de página a eliminar separados por comas (ej: '1, 3, 5')")
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")

    if not pages_to_delete.strip():
        raise HTTPException(status_code=400, detail="Debes especificar al menos una página para eliminar.")

    try:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        writer = PdfWriter()
        total_pages = len(reader.pages)

        # Parse pages to delete
        try:
            to_delete = set()
            parts = pages_to_delete.split(",")
            for part in parts:
                text = part.strip()
                if "-" in text:
                    try:
                        start, end = map(int, text.split("-"))
                        if start < 1 or end > total_pages or start > end:
                            raise HTTPException(status_code=400, detail=f"Rango inválido: {start}-{end}. El documento tiene {total_pages} páginas.")
                        to_delete.update(range(start - 1, end))
                    except ValueError:
                        raise HTTPException(status_code=400, detail=f"Formato de rango inválido: {text}")
                else:
                    try:
                        p = int(text)
                        if p < 1 or p > total_pages:
                            raise HTTPException(status_code=400, detail=f"Página fuera de rango: {p}. El documento tiene {total_pages} páginas.")
                        to_delete.add(p - 1)
                    except ValueError:
                        raise HTTPException(status_code=400, detail=f"Número de página inválido: {text}")
        except HTTPException as he:
            raise he
        except ValueError:
            raise HTTPException(status_code=400, detail="Los números de página deben ser válidos y estar separados por comas.")

        if len(to_delete) == total_pages:
            raise HTTPException(status_code=400, detail="No puedes eliminar todas las páginas del documento.")

        for i in range(total_pages):
            if i not in to_delete:
                writer.add_page(reader.pages[i])

        output_stream = io.BytesIO()
        writer.write(output_stream)
        output_stream.seek(0)

        return Response(
            content=output_stream.getvalue(),
            media_type="application/pdf",
            headers={'Content-Disposition': f'attachment; filename="modificado_{file.filename}"'}
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar páginas: {str(e)}")

@app.post("/pdf-to-excel")
async def pdf_to_excel(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")
    
    try:
        content = await file.read()
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            all_tables = []
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    df = pd.DataFrame(table[1:], columns=table[0])
                    all_tables.append(df)
            
            if not all_tables:
                raise HTTPException(status_code=400, detail="No se encontraron tablas en el PDF.")
                
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                for i, df in enumerate(all_tables):
                    df.to_excel(writer, sheet_name=f'Tabla_{i+1}', index=False)
            
            output.seek(0)
            return Response(
                content=output.getvalue(),
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={'Content-Disposition': f'attachment; filename="convertido_{file.filename.split(".")[0]}.xlsx"'}
            )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la conversión a Excel: {str(e)}")

@app.post("/pdf-to-pptx")
async def pdf_to_pptx(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")
    
    try:
        content = await file.read()
        if fitz is None:
            raise HTTPException(status_code=500, detail="Librería PyMuPDF no instalada en el servidor.")
            
        pdf_doc = fitz.open(stream=content, filetype="pdf")
        prs = Presentation()
        
        # Determine slide dimensions from first page
        if len(pdf_doc) > 0:
            first_page = pdf_doc[0]
            prs.slide_width = Inches(first_page.rect.width / 72)
            prs.slide_height = Inches(first_page.rect.height / 72)

        for page in pdf_doc:
            blank_slide_layout = prs.slide_layouts[6] # 6 is a blank layout
            slide = prs.slides.add_slide(blank_slide_layout)
            
            # Render page to image
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # Higher res
            img_data = pix.tobytes("png")
            
            img_io = io.BytesIO(img_data)
            slide.shapes.add_picture(img_io, 0, 0, width=prs.slide_width, height=prs.slide_height)
            
        output = io.BytesIO()
        prs.save(output)
        output.seek(0)
        
        return Response(
            content=output.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={'Content-Disposition': f'attachment; filename="convertido_{file.filename.split(".")[0]}.pptx"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la conversión a PowerPoint: {str(e)}")

@app.post("/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")
    
    try:
        content = await file.read()
        if fitz is None:
            raise HTTPException(status_code=500, detail="Librería PyMuPDF no instalada en el servidor.")
            
        pdf_doc = fitz.open(stream=content, filetype="pdf")
        
        if len(pdf_doc) == 1:
            # Single page, return JPG directly
            page = pdf_doc[0]
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            img_data = pix.tobytes("jpg")
            return Response(
                content=img_data,
                media_type="image/jpeg",
                headers={'Content-Disposition': f'attachment; filename="pagina_1.jpg"'}
            )
        else:
            # Multiple pages, return ZIP
            zip_io = io.BytesIO()
            with zipfile.ZipFile(zip_io, 'w') as zip_file:
                for i, page in enumerate(pdf_doc):
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    img_data = pix.tobytes("jpg")
                    zip_file.writestr(f"pagina_{i+1}.jpg", img_data)
            
            zip_io.seek(0)
            return Response(
                content=zip_io.getvalue(),
                media_type="application/zip",
                headers={'Content-Disposition': f'attachment; filename="imagenes_{file.filename.split(".")[0]}.zip"'}
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la conversión a JPG: {str(e)}")

@app.post("/image-to-pdf")
async def image_to_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No se subieron archivos.")
    
    try:
        if fitz is None:
            raise HTTPException(status_code=500, detail="Librería PyMuPDF no instalada en el servidor.")
        if Image is None:
            raise HTTPException(status_code=500, detail="Librería Pillow no instalada en el servidor.")
            
        pdf_doc = fitz.open()
        
        for file in files:
            img_content = await file.read()
            # Use Pillow as a robust bridge for images
            try:
                img = Image.open(io.BytesIO(img_content))
                # Convert to RGB to ensure compatibility with PDF (handles RGBA, Palette, etc.)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Save image to a PDF byte stream using Pillow
                img_pdf_io = io.BytesIO()
                img.save(img_pdf_io, format='PDF')
                img_pdf_io.seek(0)
                
                # Open this PDF stream with fitz and insert into main doc
                img_pdf_doc = fitz.open("pdf", img_pdf_io.read())
                pdf_doc.insert_pdf(img_pdf_doc)
                img_pdf_doc.close()
                img.close()
            except Exception as img_err:
                 raise Exception(f"Error procesando {file.filename}: {str(img_err)}")
            
        output = io.BytesIO()
        pdf_doc.save(output)
        pdf_doc.close()
        output.seek(0)
        
        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={'Content-Disposition': 'attachment; filename="convertido.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al convertir imagen a PDF: {str(e)}")

@app.post("/ocr-to-pdf")
async def ocr_to_pdf(file: UploadFile = File(...)):
    # This is a placeholder since tesseract is not installed.
    # We will implement it using pytesseract but it may fail if not installed.
    try:
        import pytesseract
        from PIL import Image as PILImage
    except ImportError:
         raise HTTPException(status_code=500, detail="Librerías de OCR no instaladas en el servidor.")

    try:
        content = await file.read()
        is_pdf = file.filename.lower().endswith(".pdf")
        
        if is_pdf:
            if fitz is None:
                raise HTTPException(status_code=500, detail="Librería PyMuPDF necesaria para procesar PDFs no está instalada.")
            
            # Open PDF and convert all pages to high-res images for OCR
            pdf_in = fitz.open(stream=content, filetype="pdf")
            ocr_pdf_docs = []
            
            for page in pdf_in:
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # High res for better OCR
                img_bytes = pix.tobytes("png")
                img = PILImage.open(io.BytesIO(img_bytes))
                
                # Run OCR and get PDF bytes for this page
                page_pdf_bytes = pytesseract.image_to_pdf_or_hocr(img, extension='pdf')
                ocr_pdf_docs.append(fitz.open("pdf", page_pdf_bytes))
                img.close()
            
            # Merge all OCR pages into one PDF
            final_ocr_pdf = fitz.open()
            for doc in ocr_pdf_docs:
                final_ocr_pdf.insert_pdf(doc)
                doc.close()
            
            output_bytes = final_ocr_pdf.write()
            final_ocr_pdf.close()
            pdf_in.close()
        else:
            # Standard image handling
            image = PILImage.open(io.BytesIO(content))
            output_bytes = pytesseract.image_to_pdf_or_hocr(image, extension='pdf')
            image.close()
            
        return Response(
            content=output_bytes,
            media_type="application/pdf",
            headers={'Content-Disposition': f'attachment; filename="ocr_{file.filename.split(".")[0]}.pdf"'}
        )
    except Exception as e:
        error_msg = str(e)
        if "tesseract is not installed or it's not in your PATH" in error_msg.lower():
            detail = "El motor Tesseract OCR no está instalado en el sistema. Por favor, ejecuta: sudo apt-get install tesseract-ocr"
        else:
            detail = f"Error en el proceso OCR: {error_msg}"
        raise HTTPException(status_code=500, detail=detail)

@app.post("/organize-pdf")
async def organize_pdf(file: UploadFile = File(...), order: str = Form(...)):
    try:
        indices = json.loads(order)
        content = await file.read()
        
        if fitz is None:
            raise HTTPException(status_code=500, detail="Librería PyMuPDF no instalada.")
            
        src = fitz.open(stream=content, filetype="pdf")
        dest = fitz.open()
        
        for idx in indices:
            if 0 <= idx < len(src):
                dest.insert_pdf(src, from_page=idx, to_page=idx)
        
        output = io.BytesIO()
        dest.save(output)
        dest.close()
        src.close()
        output.seek(0)
        
        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={'Content-Disposition': f'attachment; filename="organizado_{file.filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al organizar PDF: {str(e)}")

async def convert_to_pdf_with_libreoffice(file: UploadFile, allowed_extensions: List[str]):
    ext = file.filename.split(".")[-1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Extensión .{ext} no permitida.")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = os.path.join(temp_dir, file.filename)
        content = await file.read()
        with open(input_path, "wb") as f:
            f.write(content)
            
        try:
            # Run LibreOffice headless conversion
            result = subprocess.run(
                ["soffice", "--headless", "--convert-to", "pdf", "--outdir", temp_dir, input_path],
                capture_output=True,
                text=True,
                check=True
            )
            
            # The output filename will be the same as input but with .pdf extension
            output_filename = ".".join(file.filename.split(".")[:-1]) + ".pdf"
            output_path = os.path.join(temp_dir, output_filename)
            
            if not os.path.exists(output_path):
                raise Exception("El archivo PDF no fue generado por LibreOffice.")
                
            with open(output_path, "rb") as f:
                pdf_content = f.read()
                
            return Response(
                content=pdf_content,
                media_type="application/pdf",
                headers={'Content-Disposition': f'attachment; filename="{output_filename}"'}
            )
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=500, detail=f"Error en la conversión de LibreOffice: {e.stderr}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@app.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    return await convert_to_pdf_with_libreoffice(file, ["doc", "docx", "odt", "rtf"])

@app.post("/excel-to-pdf")
async def excel_to_pdf(file: UploadFile = File(...)):
    return await convert_to_pdf_with_libreoffice(file, ["xls", "xlsx", "ods", "csv"])

@app.post("/ppt-to-pdf")
async def ppt_to_pdf(file: UploadFile = File(...)):
    return await convert_to_pdf_with_libreoffice(file, ["ppt", "pptx", "odp"])

@app.post("/compress-pdf")
async def compress_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")
    
    try:
        content = await file.read()
        if fitz is None:
            raise HTTPException(status_code=500, detail="Librería PyMuPDF no instalada en el servidor.")
            
        # Open PDF from memory
        pdf_doc = fitz.open(stream=content, filetype="pdf")
        
        output = io.BytesIO()
        # Optimize PDF: garbage collection, deflation, cleaning
        pdf_doc.save(
            output, 
            garbage=4, 
            deflate=True, 
            clean=True
        )
        pdf_doc.close()
        
        compressed_content = output.getvalue()
        output.seek(0)
        
        return Response(
            content=compressed_content,
            media_type="application/pdf",
            headers={'Content-Disposition': f'attachment; filename="comprimido_{file.filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al comprimir PDF: {str(e)}")

@app.post("/remove-watermark")
async def remove_watermark(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")
    
    try:
        content = await file.read()
        if fitz is None:
            raise HTTPException(status_code=500, detail="Librería PyMuPDF no instalada.")
            
        pdf_doc = fitz.open(stream=content, filetype="pdf")
        
        # Heuristic: Remove common watermark text and annotations
        watermark_keywords = ["watermark", "marca de agua", "confidencial", "draft", "borrador", "evaluación"]
        
        for page in pdf_doc:
            # 1. Remove Annotations (many watermarks are annotations)
            for annot in page.annots():
                # Check for watermark subtype or common keywords in contents
                if annot.type[0] == 8: # 8 is Watermark
                    page.delete_annot(annot)
                else:
                    info = annot.info
                    if any(key in str(info.get("content", "")).lower() for key in watermark_keywords):
                        page.delete_annot(annot)

            # 2. Try to find and remove text artifacts (harder, but we can try)
            # Using apply_redactions() draws a white box and erases underlying content,
            # which ruins the PDF. Instead, we surgically remove the text commands.
            page.clean_contents()
            for xref in page.get_contents():
                stream = pdf_doc.xref_stream(xref)
                if stream:
                    updated = False
                    for key in watermark_keywords:
                        targets = [
                            f"({key})", f"({key.capitalize()})", f"({key.upper()})"
                        ]
                        for t in targets:
                            encoded = t.encode('utf-8', errors='ignore')
                            if encoded in stream:
                                stream = stream.replace(encoded, b"()")
                                updated = True
                    if updated:
                        pdf_doc.update_stream(xref, stream)

        output = io.BytesIO()
        pdf_doc.save(output, garbage=4, deflate=True)
        pdf_doc.close()
        
        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={'Content-Disposition': f'attachment; filename="limpio_{file.filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar marca de agua: {str(e)}")

@app.post("/lock-pdf")
async def lock_pdf(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")
    
    try:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        writer.encrypt(password)
        
        output = io.BytesIO()
        writer.write(output)
        
        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={'Content-Disposition': f'attachment; filename="protegido_{file.filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al bloquear PDF: {str(e)}")

@app.post("/unlock-pdf")
async def unlock_pdf(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")
    
    try:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        
        if reader.is_encrypted:
            # reader.decrypt returns PasswordType values. 0 means failure.
            try:
                decryption_result = reader.decrypt(password)
                if decryption_result == 0:
                     raise HTTPException(status_code=400, detail="El archivo no pudo ser desbloqueado, valida tu contraseña e intenta nuevamente")
            except Exception:
                raise HTTPException(status_code=400, detail="El archivo no pudo ser desbloqueado, valida tu contraseña e intenta nuevamente")
        else:
            raise HTTPException(status_code=400, detail="El archivo PDF no parece estar protegido por contraseña.")

        writer = PdfWriter()
        try:
            for page in reader.pages:
                writer.add_page(page)
        except Exception as e:
            if "not been decrypted" in str(e).lower():
                raise HTTPException(status_code=400, detail="El archivo no pudo ser desbloqueado, valida tu contraseña e intenta nuevamente")
            raise e
            
        output = io.BytesIO()
        writer.write(output)
        
        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={'Content-Disposition': f'attachment; filename="desbloqueado_{file.filename}"'}
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        # Fallback for unexpected errors
        error_str = str(e).lower()
        if "not been decrypted" in error_str or "password" in error_str:
            raise HTTPException(status_code=400, detail="El archivo no pudo ser desbloqueado, valida tu contraseña e intenta nuevamente")
        raise HTTPException(status_code=500, detail=f"Error inesperado al desbloquear: {str(e)}")

@app.post("/add-watermark")
async def add_watermark(
    file: UploadFile = File(...),
    mode: str = Form("text"), # "text" or "image"
    # Text params
    text: str = Form(""),
    font_size: int = Form(50),
    color: str = Form("#ff0000"),
    # Image params
    image_file: UploadFile = File(None),
    scale: float = Form(1.0),
    # Common params
    opacity: float = Form(0.5),
    rotation: int = Form(0),
    position: str = Form("center") # center, top-left, top-right, bottom-left, bottom-right
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo no es un PDF válido.")
    
    try:
        content = await file.read()
        if fitz is None:
            raise HTTPException(status_code=500, detail="Librería PyMuPDF no instalada.")
            
        pdf_doc = fitz.open(stream=content, filetype="pdf")
        
        # Hex to RGB
        hex_color = color.lstrip('#')
        rgb = tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))

        for page in pdf_doc:
            page_rect = page.rect
            width = page_rect.width
            height = page_rect.height
            
            if mode == "text" and text:
                # Text Watermark
                # Create a small redaction/overlay or just insert text
                # For professional look, we use insert_text or insert_textbox
                
                # Approximate text size to calculate position
                text_width = font_size * len(text) * 0.5 
                text_height = font_size
                
                x, y = 0, 0
                if position == "center":
                    x, y = (width - text_width) / 2, (height + text_height) / 2
                elif position == "top-left":
                    x, y = 50, 50 + text_height
                elif position == "top-right":
                    x, y = width - text_width - 50, 50 + text_height
                elif position == "bottom-left":
                    x, y = 50, height - 50
                elif position == "bottom-right":
                    x, y = width - text_width - 50, height - 50

                # PyMuPDF uses 'fill_opacity' for transparency
                # We use 'morph' to allow arbitrary rotation (not just multiples of 90)
                pos = fitz.Point(x, y)
                page.insert_text(
                    pos, 
                    text, 
                    fontsize=font_size, 
                    color=rgb, 
                    fill_opacity=opacity,
                    morph=(pos, fitz.Matrix(rotation))
                )
                
            elif mode == "image" and image_file:
                # Image Watermark
                img_content = await image_file.read()
                img_io = io.BytesIO(img_content)
                
                # Load image to get dimensions
                img_fitz = fitz.open(stream=img_io, filetype=image_file.filename.split('.')[-1])
                img_rect = img_fitz[0].rect
                
                target_width = img_rect.width * scale
                target_height = img_rect.height * scale
                
                rect = fitz.Rect(0, 0, target_width, target_height)
                
                if position == "center":
                    rect.x0 = (width - target_width) / 2
                    rect.y0 = (height - target_height) / 2
                elif position == "top-left":
                    rect.x0, rect.y0 = 50, 50
                elif position == "top-right":
                    rect.x0, rect.y0 = width - target_width - 50, 50
                elif position == "bottom-left":
                    rect.x0, rect.y0 = 50, height - target_height - 50
                elif position == "bottom-right":
                    rect.x0, rect.y0 = width - target_width - 50, height - target_height - 50
                
                rect.x1 = rect.x0 + target_width
                rect.y1 = rect.y0 + target_height

                # For images, PyMuPDF only allows multiples of 90 degrees
                # Round to nearest 90 multiple
                img_rotation = (round(rotation / 90) * 90) % 360

                page.insert_image(
                    rect, 
                    stream=img_content, 
                    overlay=True, 
                    keep_proportion=True,
                    rotate=img_rotation,
                    opacity=opacity
                )
                img_fitz.close()

        output = io.BytesIO()
        pdf_doc.save(output)
        pdf_doc.close()
        
        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={'Content-Disposition': f'attachment; filename="con_marca_{file.filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al agregar marca de agua: {str(e)}")


@app.post("/compare-pdfs")
async def compare_pdfs(files: List[UploadFile] = File(...)):
    import difflib
    
    if len(files) != 2:
        raise HTTPException(status_code=400, detail="Debe subir exactamente 2 archivos PDF")
    
    try:
        doc1 = fitz.open(stream=await files[0].read(), filetype="pdf")
        doc2 = fitz.open(stream=await files[1].read(), filetype="pdf")
        
        diff_results = {
            "total_differences": 0,
            "differences": [],
            "filenames": [files[0].filename, files[1].filename]
        }
        
        num_pages = min(doc1.page_count, doc2.page_count)
        
        for p in range(num_pages):
            page1_lines = doc1[p].get_text("text").splitlines()
            page2_lines = doc2[p].get_text("text").splitlines()
            
            matcher = difflib.SequenceMatcher(None, page1_lines, page2_lines)
            
            for tag, i1, i2, j1, j2 in matcher.get_opcodes():
                if tag != 'equal':
                    before_text = " ".join(page1_lines[i1:i2]).strip()
                    after_text = " ".join(page2_lines[j1:j2]).strip()
                    if before_text or after_text:
                        diff_results["differences"].append({
                            "page": p + 1,
                            "line": f"{i1+1}-{i2}" if i1 + 1 != i2 and i1 != i2 else str(i1 + 1),
                            "before": before_text,
                            "after": after_text
                        })
                        diff_results["total_differences"] += 1
                        
        doc1.close()
        doc2.close()
        
        return diff_results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparando PDFs: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
