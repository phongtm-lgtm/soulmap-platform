import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: resolve(__dirname, '../images'),
  server: {
    fs: {
      allow: [resolve(__dirname), resolve(__dirname, '../images')],
    },
  },
})
