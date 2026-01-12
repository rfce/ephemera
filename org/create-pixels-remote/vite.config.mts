/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import federation from '@originjs/vite-plugin-federation';
import path from 'node:path';

export default defineConfig(({ mode }) => ({
  root: import.meta.dirname,
  cacheDir: '../node_modules/.vite/create-pixels-remote',
  server: {
    port: 4202,
    host: 'localhost',
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['*'],
    },
  },
  preview: {
    port: 4202,
    host: 'localhost',
    cors: {
      origin: '*',
    },
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    mode === 'production' &&
    federation({
      name: 'create-pixels',
      filename: 'remoteEntry.js',
      exposes: {
        './CreatePixelsApp': './src/app/index.ts',
      },
      shared: ['react', 'react-dom', 'jotai'],
    }),
  ].filter(Boolean),
  build: {
    outDir: '../dist/create-pixels-remote',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
