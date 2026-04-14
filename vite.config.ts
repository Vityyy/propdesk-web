import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_URL

  if (!apiBaseUrl) {
    throw new Error('Missing required env var: VITE_API_URL')
  }

  const shouldUseProxy = mode === 'development' && apiBaseUrl.startsWith('/')

  if (shouldUseProxy && mode === 'development' && !env.VITE_DEV_PROXY_TARGET) {
    throw new Error('Missing required env var for dev proxy: VITE_DEV_PROXY_TARGET')
  }

  return {
    plugins: [tailwindcss(), react()],
    server: shouldUseProxy
      ? {
          proxy: {
            [apiBaseUrl]: {
              target: env.VITE_DEV_PROXY_TARGET,
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
