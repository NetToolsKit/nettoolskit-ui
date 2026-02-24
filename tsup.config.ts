import { defineConfig } from 'tsup';
import vue from 'esbuild-plugin-vue3';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  outDir: '.build/dist',
  dts: false,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['vue', 'quasar', 'vue-router'],
  esbuildPlugins: [vue()],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
});
