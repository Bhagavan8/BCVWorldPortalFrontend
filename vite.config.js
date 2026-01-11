import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bcvworldwebsitebackend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
