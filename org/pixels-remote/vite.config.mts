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
        './TrackMessage': './src/app/TrackMessage.tsx',
      },
      shared: {
        // Core: Must be singletons and eager for the app to boot and sync correctly
        'react': { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false },
        'react-router-dom': { singleton: true, eager: true, requiredVersion: false },

        // State: MUST be singleton and eager for Jotai atoms to communicate between remotes
        'jotai': { singleton: true, eager: true, requiredVersion: false },
        '@org/shared-state': {
          singleton: true,
          eager: true,
          requiredVersion: false
        },

        // UI/Utilities: Singletons to save memory, but eager is usually not required
        'react-spinners': { singleton: true },
        '@emoji-mart/react': { singleton: true },
        '@emoji-mart/data': { singleton: true },
        'twemoji-parser': { singleton: true },
        'ua-parser-js': { singleton: true },
        'react-toolkit': { singleton: true }
      }
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
