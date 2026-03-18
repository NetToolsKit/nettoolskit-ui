import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: './landing-page-new',
  build: {
    outDir: '../.build/landing-new',
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    strictPort: true,
  },
})