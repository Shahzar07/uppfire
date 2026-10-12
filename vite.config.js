import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// The site source lives in dist/ (served as-is by static hosting).
// Vite serves it for local dev and writes an optimized copy to build/.
const root = resolve(import.meta.dirname, 'dist');
const pages = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(resolve(root, d.name, 'index.html')))
  .map((d) => resolve(root, d.name, 'index.html'));

export default defineConfig({
  root: 'dist',
  publicDir: false,
  build: {
    outDir: '../build',
    emptyOutDir: true,
    rollupOptions: {
      input: [resolve(root, 'index.html'), ...pages],
    },
  },
});
