# Guía de Despliegue - PDF Converter en VPS

Esta guía detalla el proceso paso a paso para desplegar la aplicación PDF Converter en un VPS utilizando Docker, junto con la configuración de red compartida para servicios comunes (Postgres, Redis) y un proxy inverso global (Nginx).

## Arquitectura

El sistema se compone de las siguientes partes en contenedores separados:
1. **Red Compartida (`shared_net`)**: Red de Docker que conecta todos los servicios.
2. **Servicios Globales**: Base de datos (PostgreSQL), Caché/Rate Limiting (Redis) y Proxy Inverso (Nginx).
3. **Aplicación**: Frontend (Next.js) y Backend (FastAPI).

## Requisitos Previos

- Un VPS con Docker y Docker Compose instalados.
- Un dominio apuntando a la IP de tu VPS.
- Llaves de API para Stripe, Brevo, Google OAuth y Google reCAPTCHA v2.

## Paso 1: Configurar la Red Compartida

Asegúrate de que la red que usarán los contenedores exista. Si ya la creaste con tu Postgres, sáltate esto.

```bash
docker network create shared_net
```

## Paso 2: Levantar Servicios Globales (Postgres y Redis)

Asegúrate de tener funcionando tus servicios de Postgres y Redis conectados a `shared_net`.

Ejemplo de cómo deberían verse tus comandos o docker-compose para estos servicios:

```yaml
# docker-compose.db.yml (Ejemplo)
version: "3.8"
services:
  postgres_new:
    image: postgres:15
    container_name: postgres_new
    restart: unless-stopped
    environment:
      POSTGRES_USER: tu_usuario
      POSTGRES_PASSWORD: tu_password
      POSTGRES_DB: tu_bd
    volumes:
      - postgres_new_data:/var/lib/postgresql/data
    networks:
      - shared_net

  redis_new:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    networks:
      - shared_net

volumes:
  postgres_new_data:
networks:
  shared_net:
    external: true
```

Inícialos con: `docker-compose -f docker-compose.db.yml up -d`

## Paso 3: Configurar el Nginx Global

Hemos creado una carpeta llamada `global-nginx` (puedes moverla a otra ruta superior en tu servidor, como `/opt/global-nginx`). Este servicio manejará el tráfico para este y futuros proyectos.

1. Navega a la carpeta de Nginx global:
   ```bash
   cd global-nginx
   ```

2. Configura tu dominio abriendo `conf.d/pdf-converter.conf` y cambiando `server_name tu-dominio.com;` por tu dominio o IP real.

3. Levanta Nginx:
   ```bash
   docker-compose up -d
   ```

## Paso 4: Configurar la Aplicación (PDF Converter)

1. Ve al directorio del código fuente:
   ```bash
   cd /ruta/a/pdf_converter
   ```

2. Configura las variables de entorno creando/editando el archivo `.env`. Este comando es solo un ejemplo de las variables que necesitas:

   ```env
   # .env
   # Base de Datos (Apunta al nombre del contenedor de postgres en la shared_net)
   DATABASE_URL=postgresql://tu_usuario:tu_password@postgres_new:5432/tu_bd

   # JWT y Auth
   NEXTAUTH_URL=https://tu-dominio.com
   NEXTAUTH_SECRET=un_secreto_generado_muy_largo

   # Google Auth
   GOOGLE_CLIENT_ID=tu_cliente_id_de_google
   GOOGLE_CLIENT_SECRET=tu_secreto_de_google

   # Stripe
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_ID=price_...

   # Brevo
   BREVO_API_KEY=xkeysib-...
   BREVO_FROM_EMAIL=noreply@tudominio.com

   # Google reCAPTCHA v2
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key
   RECAPTCHA_SECRET_KEY=tu_secret_key

   # Configuración de URL del Backend (Para que Nginx enrute correctamente)
   NEXT_PUBLIC_API_URL=/api/v1
   ```

3. Construye e inicia la aplicación:
   ```bash
   docker-compose up -d --build
   ```

La primera vez, este proceso tomará varios minutos mientras instala las dependencias de Python y Node.js.

## Paso 5: Ejecutar las Migraciones de Prisma

Dado que acabas de conectar a la base de datos de producción, debes crear las tablas:

1. Entra al contenedor del frontend:
   ```bash
   docker exec -it pdf-converter-frontend bash
   ```

2. Ejecuta la migración:
   ```bash
   docker exec -it pdf-converter-frontend npx prisma db push --url "URL"
   # o si usas migraciones: npx prisma migrate deploy
   ```

3. Sal del contenedor: `exit`

## Paso 6: Verificación y Certificados SSL

Si el dominio ya apunta a tu VPS, ingresa a `http://tu-dominio.com` y la app debería estar funcionando.

**Para asegurar la app con SSL (HTTPS):**

Si tienes certbot instalado en la máquina anfitriona:
```bash
sudo certbot certonly --standalone -d tu-dominio.com
```
Luego modifica `global-nginx/conf.d/pdf-converter.conf` para escuchar en 443, habilitar SSL y apuntar los tokens a `/etc/letsencrypt`. Reinicia nginx: `docker restart global-nginx`.

## Seguridad Integrada

Este despliegue incluye múltiples capas de protección:
- **Redes Aisladas**: Backend y BD no son accesibles desde el exterior.
- **Nginx Rate Limits**: Restringe llamadas a 15 rq/s globalmente para detener DDoS básicos.
- **Backend Redis Ban**: Bloquea IPs en el backend (FastAPI) si detecta intrusos enviando datos no válidos a webhooks constantemente.
- **reCAPTCHA v2**: Protege el login y el registro contra bots abusivos.
