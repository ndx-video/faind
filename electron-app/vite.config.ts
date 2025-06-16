import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        main: resolve(__dirname, 'src/main.ts'),
        preload: resolve(__dirname, 'src/preload.ts')
      },
      formats: ['cjs'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: [
        'electron',
        'path',
        'fs',
        'fs/promises',
        'url',
        'child_process',
        'os',
        'crypto',
        'events',
        'stream',
        'util',
        'buffer',
        'node:path',
        'node:fs',
        'node:fs/promises',
        'node:url',
        'node:child_process',
        'node:os',
        'node:crypto',
        'node:events',
        'node:stream',
        'node:util',
        'node:buffer'
      ],
      output: {
        entryFileNames: '[name].js',
        format: 'cjs'
      }
    },
    minify: false,
    sourcemap: true,
    target: 'node18',
    ssr: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
