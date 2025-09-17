import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Only log responses that are actual errors, ignoring 404s which our app handles.
            // This will keep the console clean from expected "Not Found" responses.
            if (proxyRes.statusCode >= 400 && proxyRes.statusCode !== 404) {
              console.log('Received ERROR Response from Target:', proxyRes.statusCode, req.url);
            }
          });
        },
      }
    }
  }
})
