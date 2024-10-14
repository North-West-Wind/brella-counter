import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: "vite",
    outDir: "../public",
    emptyOutDir: false,
    copyPublicDir: false,
  }
})
