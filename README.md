# GDSI Frontend

React + TypeScript + Vite frontend for RMS.

## Requirements

- Node.js 20+
- npm 10+
- Docker (optional)

## Environment Variables

Create a local `.env` file:

```dotenv
VITE_API_URL=/api
VITE_DEV_PROXY_TARGET=http://localhost:8080
VITE_APP_NAME=ARMS
VITE_ENVIRONMENT=development
```

### How API routing works

- The app reads `VITE_API_URL` from `src/config/api.ts`.
- In local development, Vite proxies `VITE_API_URL` to `VITE_DEV_PROXY_TARGET`.
- In Docker/Render, Nginx proxies `/api` to `BACKEND_URL`.
- There are no runtime fallbacks for these variables.

## Local Development

```powershell
npm install
npm run dev
```


## Build

```powershell
npm run build
npm run preview
```

## Run With Docker (Frontend on 3000)

Build image:

```powershell
docker build -t gdsi-frontend:latest .
```

Run container:

```powershell
docker rm -f gdsi-frontend 2>$null
docker run -d --name gdsi-frontend -p 3000:80 -e BACKEND_URL=http://host.docker.internal:8080 gdsi-frontend:latest
```

Frontend dev URL:
- `http://localhost:3000`

Render URL:
- `https://gdsi-frontend.onrender.com`
- Static frontend is served by Nginx.
- Requests to `/api/*` are proxied to `BACKEND_URL`.
