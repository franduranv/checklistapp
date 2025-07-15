# Checklist App

Microaplicación web para gestión de checklists de limpieza con autenticación por PIN.

## 🚀 Características

- **Autenticación simple** con PIN numérico
- **Selección de unidades** por categoría (corto plazo / renta fija)
- **Checklist de limpieza** con áreas específicas (baño, cocina, blancos, sala)
- **Subida de fotos** (antes, después, detalle) a Google Drive
- **Estados finales** (Limpio y Listo, Con Observaciones, No Listo)
- **Comentarios adicionales** para observaciones específicas
- **Diseño responsive** y minimalista

## 🛠️ Tecnologías

### Backend
- **Node.js** con Express
- **MongoDB** con Mongoose
- **Google Drive API** para almacenamiento de fotos
- **JWT** para autenticación

### Frontend
- **React** con hooks
- **Axios** para peticiones HTTP
- **CSS3** con diseño responsive

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- Cuenta de Google Cloud Platform
- Google Drive API habilitada

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/checklist-app.git
cd checklist-app
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la carpeta `backend/`:
```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/checklist-app

# JWT Secret
JWT_SECRET=your-secret-key-change-this-in-production

# Google Drive Configuration
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
GOOGLE_DRIVE_FOLDER_ID=tu-folder-id-de-google-drive

# Server Port
PORT=4000
```

### 4. Configurar Google Drive
1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Google Drive API
3. Crear cuenta de servicio y descargar `credentials.json`
4. Colocar `credentials.json` en la carpeta `backend/`
5. Crear carpeta en Google Drive y compartir con la cuenta de servicio

### 5. Configurar el Frontend
```bash
cd frontend
npm install
```

### 6. Cargar datos iniciales
```bash
cd backend
node seed.js
```

## 🚀 Ejecución

### Backend
```bash
cd backend
npm start
```
El servidor estará disponible en `http://localhost:4000`

### Frontend
```bash
cd frontend
npm start
```
La aplicación estará disponible en `http://localhost:3000`

## 👤 Datos de Prueba

- **Usuario:** Operador1
- **PIN:** 1234

## 📱 Uso

1. **Login:** Ingresa con nombre y PIN
2. **Seleccionar Unidad:** Elige el departamento a revisar
3. **Completar Checklist:**
   - Marca las áreas revisadas
   - Sube fotos (antes, después, detalle)
   - Selecciona estado final
   - Agrega comentarios si es necesario
4. **Guardar:** El sistema guarda todo automáticamente

## 🏗️ Estructura del Proyecto

```
checklist-app/
├── backend/
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── services/        # Servicios (Google Drive)
│   ├── index.js         # Servidor principal
│   └── seed.js          # Datos iniciales
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── App.js       # Componente principal
│   │   └── index.js     # Punto de entrada
│   └── public/          # Archivos públicos
└── README.md
```

## 🔒 Seguridad

- Las credenciales de Google Drive están excluidas del repositorio
- Las variables de entorno están en `.gitignore`
- Autenticación JWT para proteger las rutas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas, abre un issue en GitHub. 