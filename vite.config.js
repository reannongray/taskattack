import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Changed from '/taskattack/' for custom subdomain
  publicDir: 'public',
  resolve: {
    dedupe: ['lodash']  // Help resolve lodash correctly
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: []  // Don't treat any imports as external
    }
  }
})