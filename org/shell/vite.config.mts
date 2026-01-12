/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import path from 'node:path';
import federation from '@originjs/vite-plugin-federation';

const pixelsPath = path.resolve(__dirname, '../pixels-remote/src/app');
const createPixelsPath = path.resolve(__dirname, '../create-pixels-remote/src/app');
const uploadPath = path.resolve(__dirname, '../upload-remote/src/app');
const viewPath = path.resolve(__dirname, '../view-remote/src/app');

export default defineConfig(({ mode }) => ({
  root: import.meta.dirname,
  cacheDir: '../node_modules/.vite/shell',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    mode === 'production' &&
    federation({
      name: 'shell',
      remotes: {
        "pixels": 'http://localhost:4201/assets/remoteEntry.js',
        "create-pixels": 'http://localhost:4202/assets/remoteEntry.js',
        "upload": 'http://localhost:4203/assets/remoteEntry.js',
        "view": 'http://localhost:4204/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'jotai'],
    }),
  ].filter(Boolean),
  build: {
    outDir: '../dist/shell',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
