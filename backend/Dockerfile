# Utilizar una imagen ligera de Python pero funcional para procesamiento de archivos
FROM python:3.11-slim-bookworm

# Instalar dependencias del sistema necesarias para OCR, Conversión de Word/Excel/PPT y procesamiento de imágenes
# tesseract-ocr: para OCR
# libreoffice: para conversiones de Office a PDF (headless)
# libgl1-mesa-glx: para algunas librerías de imagen
# ghostscript: opcional pero recomendado para PDFs
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-spa \
    tesseract-ocr-eng \
    libreoffice \
    libreoffice-common \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    libgl1 \
    libglib2.0-0 \
    fonts-liberation \
    ghostscript \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar requerimientos e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY . .

# Exponer el puerto
EXPOSE 8000

# Comando para arrancar con Gunicorn para mayor robustez en producción
# Se usa uvicornworker para manejar la asincronía de FastAPI
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "--timeout", "120"]
