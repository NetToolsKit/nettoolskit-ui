import { defineConfig } from 'tsup'
import vue from 'esbuild-plugin-vue3'

/**
 * Library bundle configuration.
 * The output stays framework-agnostic (no "use client" banner) to prevent
 * declaration build warnings and keep the package usable across runtimes.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    styles: 'src/styles/index.ts',
  },
  format: ['cjs', 'esm'],
  outDir: '.build/dist',
  dts: false,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['vue', 'quasar', 'vue-router'],
  esbuildPlugins: [vue()],
})