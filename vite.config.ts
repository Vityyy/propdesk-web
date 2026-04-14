import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_URL || '/api'
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:8080'

  const shouldUseProxy = apiBaseUrl.startsWith('/')

  return {
    plugins: [tailwindcss(), react()],
    server: shouldUseProxy
      ? {
          proxy: {
            [apiBaseUrl]: {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
              rewrite: (path) =>
                path.startsWith(apiBaseUrl)
                  ? path.slice(apiBaseUrl.length) || '/'
                  : path,
            },
          },
        }
      : undefined,
  }
})
