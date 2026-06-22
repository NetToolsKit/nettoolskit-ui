/* global __dirname */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const modernSassApiOption = { api: 'modern-compiler' } as Record<string, string>

/**
 * Split strategy used by the public samples host.
 * Keeps framework/vendor code separated from feature-specific code
 * to reduce single-bundle size warnings and improve cacheability.
 */
function manualChunkByModule(id: string): string | undefined {
  const normalized = id.replace(/\\/g, '/')

  if (!normalized.includes('/node_modules/')) {
    return undefined
  }

  if (normalized.includes('/node_modules/quasar/')) {
    return 'vendor-quasar'
  }

  return 'vendor'
}

export default defineConfig({
  plugins: [vue()],
  root: './samples',
  build: {
    outDir: '../.build/samples',
    emptyOutDir: true,
    // Quasar runtime is slightly above the default 500KB warning threshold.
    // Keep a strict limit while avoiding false positives for this known vendor chunk.
    chunkSizeWarningLimit: 520,
    rollupOptions: {
      input: {
        index: resolve(__dirname, './samples/index.html'),
      },
      output: {
        manualChunks: manualChunkByModule,
      },
    },
  },
  css: {
    preprocessorOptions: {
      // Keep the runtime option while avoiding excess-property friction across
      // slightly different Vite/Sass type baselines.
      scss: modernSassApiOption,
      sass: modernSassApiOption,
    },
  },
  resolve: {
    alias: {
      '@nettoolskit/ui-vue': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
})
