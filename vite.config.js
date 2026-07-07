import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [react()],
  publicDir: 'public',
  server: { port: 3000 },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
  }
})
