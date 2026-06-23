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
    include: ['tests/unit/**/*.spec.ts', 'tests/architecture/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: resolve(__dirname, '../.build/coverage'),
      reporter: ['text', 'json', 'html'],
      clean: true,
      // Paths are resolved relative to the Vitest root (the project root), so
      // they must be root-relative, not relative to this config file.
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/styles/**'
      ],
      // The deterministic core (contracts + recipes) is the highest-value layer
      // to keep fully covered. Other layers are gated by their own suites.
      thresholds: {
        'src/design-system/core/components/**/*.ts': {
          statements: 100,
          functions: 100,
          lines: 100,
          branches: 90
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src')
    }
  }
})