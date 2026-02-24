import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  root: './landing-page',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, './landing-page/index.html')
    }
  },
  resolve: {
    alias: {
      '@nettoolskit/ui-vue': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  }
})
