import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['react-icons', 'lucide-react', 'react-hot-toast', 'bootstrap'],
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-anim': ['aos', 'framer-motion'],
          'vendor-utils': ['axios']
        }
      }
    }
  },
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
