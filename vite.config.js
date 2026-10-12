import { defineConfig } from 'vite';

// The site source lives in dist/ (served as-is by static hosting).
// Vite serves it for local dev and writes an optimized copy to build/.
export default defineConfig({
  root: 'dist',
  publicDir: false,
  build: {
    outDir: '../build',
    emptyOutDir: true,
  },
});
