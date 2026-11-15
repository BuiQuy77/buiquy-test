import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Allows easy deployment to any static host (Vercel, Netlify, GitHub Pages) without path issues
  server: {
    watch: {
      ignored: ['**/*.py', '**/*.pdf', '**/datasource/**']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/datasource': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
