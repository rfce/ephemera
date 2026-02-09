/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import federation from '@originjs/vite-plugin-federation';
import path from 'node:path';

export default defineConfig(({ mode }) => ({
  root: import.meta.dirname,
  cacheDir: '../node_modules/.vite/pixels-remote',
  server: {
    port: 4201,
    host: 'localhost',
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['*'],
    },
  },
  preview: {
    port: 4201,
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
      name: 'pixels',
      filename: 'remoteEntry.js',
      exposes: {
        './PixelsApp': './src/app/AddRecipient.tsx',
        './AliasPick': './src/app/AliasPick.tsx',
        './CreateMessage': './src/app/CreateMessage.tsx',
      },
      shared: ['react', 'react-dom', 'jotai'],
    }),
  ].filter(Boolean),
  build: {
    outDir: '../dist/pixels-remote',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
