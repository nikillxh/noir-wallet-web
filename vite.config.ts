import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'paper-directory-route',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const paperRequest = request as { url?: string }
          if (paperRequest.url === '/paper' || paperRequest.url === '/paper/') {
            paperRequest.url = '/paper/index.html'
          }
          next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const paperRequest = request as { url?: string }
          if (paperRequest.url === '/paper' || paperRequest.url === '/paper/') {
            paperRequest.url = '/paper/index.html'
          }
          next()
        })
      },
    },
  ],
})
