# Backend - Checklist App

## Instalación local

1. Clona el repositorio y entra a la carpeta `backend`.
2. Copia `.env.example` a `.env` y ajusta las variables si es necesario.
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor:
   ```bash
   npm run dev
   ```

## Despliegue en Railway

1. Crea un nuevo proyecto en [Railway](https://railway.app/).
2. Sube el código de la carpeta `backend`.
3. Configura las variables de entorno (`MONGO_URI`, `JWT_SECRET`, `PORT`).
4. Conecta una base de datos MongoDB (Railway ofrece integración directa).
5. Despliega el servicio. 