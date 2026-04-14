# GDSI Frontend

React + TypeScript + Vite frontend for RMS.

## Requirements

- Node.js 20+
- npm 10+

## Environment Variables

Create a local `.env` file:

```dotenv
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=ARMS
VITE_ENVIRONMENT=development
```

### API routing model

- The app reads `VITE_API_URL` from `src/config/api.ts`.
- `VITE_API_URL` must be an absolute backend URL (for example `https://your-backend.onrender.com`).
- There are no runtime proxy fallbacks.

## Local Development

```powershell
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

## Build

```powershell
npm run build
npm run preview
```

## Deploy on Render (Static Site)

1. Create a **Static Site** from this repository.
2. Set build command:
   - `npm install; npm run build`
3. Set publish directory:
   - `dist`
4. Add environment variables:

```env
VITE_API_URL=https://your-backend.onrender.com
VITE_APP_NAME=ARMS
VITE_ENVIRONMENT=production
```

5. Deploy.

## Notes

- Do not use `./` as Publish Directory for Render Static Site. Use `dist`.
- If you use custom domains, make sure backend CORS allows the frontend origin.
