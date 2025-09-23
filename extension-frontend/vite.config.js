import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'content-scripts/content': resolve(__dirname, 'src/content-scripts/content.jsx'),
        'content-scripts/youtubeInjector': resolve(__dirname, 'src/content-scripts/youtubeInjector.jsx'),
        'background/service-worker': resolve(__dirname, 'src/background/service-worker.js'),
        'content-scripts/loader': resolve(__dirname, 'src/content-scripts/loader.js'),
      },
      output: {
        format: 'es',
        entryFileNames: 'scripts/[name].js',
        chunkFileNames: 'assets/[name].js',
        // This forces all CSS output into a single, predictable file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/style.css';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
    emptyOutDir: true,
  },
});