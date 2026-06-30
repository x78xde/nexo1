# Nexo Lab Backend Stable 1.0

Backend API separado para conectar el frontend de Nexo Lab con Proxmox, Docker, metricas del sistema y autenticacion.

## Ejecutar en desarrollo

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

En Windows PowerShell, puedes copiar el archivo de entorno con:

```powershell
Copy-Item .env.example .env
```

## Build

```bash
npm run build
npm start
```

## Endpoints de prueba

```txt
POST http://localhost:4000/api/auth/login
GET  http://localhost:4000/api/auth/me
GET  http://localhost:4000/api/system/health
GET  http://localhost:4000/api/proxmox/nodes
GET  http://localhost:4000/api/docker/containers
```

Las rutas de Proxmox, Docker y sistema requieren:

```txt
Authorization: Bearer TOKEN
```

El token se obtiene con `POST /api/auth/login`.
