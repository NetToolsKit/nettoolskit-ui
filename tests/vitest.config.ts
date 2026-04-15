/**
 * Tests/vitest config module.
 */

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  cacheDir: resolve(__dirname, '../.build/vitest/cache'),
  css: {
    preprocessorOptions: {
      scss: {
        // Tests should use the same Sass API as production builds.
        api: 'modern-compiler',
      },
      sass: {
        api: 'modern-compiler',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, './setup.ts')],
    include: ['tests/unit/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../.build/coverage',
      reporter: ['text', 'json', 'html'],
      clean: true,
      include: ['../src/**/*.ts', '../src/**/*.vue'],
      exclude: [
        '../src/**/*.d.ts',
        '../src/**/index.ts',
        '../src/styles/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src')
    }
  }
})
