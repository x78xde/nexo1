### El inicio de Nexo lab

para este proyecto estare incluyendo todo en uno, quiero variedad en este proyecto de laboratorio donde se incluya bots/productos, 

## Frontend conectado al backend

Crear `.env.local` en la raiz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Si frontend y backend pasan por Nginx bajo el mismo dominio, tambien puedes usar:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Para compilar:

```bash
npm install
npm run build
```

## Actualizar repo Git desde Debian/Proxmox

Ver estado:

```bash
git status
```

Agregar cambios:

```bash
git add .
```

Commit:

```bash
git commit -m "Conecta frontend con backend real de Nexo Lab"
```

Subir:

```bash
git push origin master
```

Si GitHub pide credenciales, usa un Personal Access Token como password o configura el remoto con SSH.
