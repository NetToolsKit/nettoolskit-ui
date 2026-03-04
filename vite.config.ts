import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/**
 * Split strategy used by landing and CMS builds.
 * Keeps framework/vendor code separated from CMS-specific code
 * to reduce single-bundle size warnings and improve cacheability.
 */
function manualChunkByModule(id: string): string | undefined {
  const normalized = id.replace(/\\/g, '/')

  if (!normalized.includes('/node_modules/')) {
    if (normalized.includes('/landing-page/CmsApp.vue') || normalized.includes('/landing-page/cms/')) {
      return 'cms'
    }
    return undefined
  }

  if (normalized.includes('/node_modules/quasar/')) {
    return 'vendor-quasar'
  }
  if (normalized.includes('/node_modules/vue-router/')) {
    return 'vendor-vue-router'
  }

  return 'vendor'
}

export default defineConfig({
  plugins: [vue()],
  root: './landing-page',
  build: {
    outDir: '../.build/landing',
    emptyOutDir: true,
    // Quasar runtime is slightly above the default 500KB warning threshold.
    // Keep a strict limit while avoiding false positives for this known vendor chunk.
    chunkSizeWarningLimit: 520,
    rollupOptions: {
      input: resolve(__dirname, './landing-page/index.html'),
      output: {
        manualChunks: manualChunkByModule,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Explicit modern Sass API to avoid deprecated fallback behavior.
        api: 'modern-compiler',
      },
      sass: {
        // Keep parity between .scss and .sass preprocessors.
        api: 'modern-compiler',
      },
    },
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