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
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
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
        './CreatePixelsApp': './src/app/CreatePixelsApp.tsx',
        './Header': './src/app/Header.tsx',
        './Recommended': './src/app/Recommended.tsx',
        './Dashboard': './src/app/Dashboard.tsx',
      },
      shared: {
        // Core dependencies should almost always be eager and singletons
        'react': { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false },
        'react-router-dom': { singleton: true, eager: true, requiredVersion: false },

        // State management MUST be eager to ensure atoms are ready when the UI mounts
        'jotai': { singleton: true, eager: true, requiredVersion: false },
        '@org/shared-state': {
          singleton: true,
          eager: true,
          requiredVersion: false
        },

        // These can remain lazy (default) to keep the initial load light
        'react-spinners': { singleton: true },
        '@emoji-mart/react': { singleton: true },
        '@emoji-mart/data': { singleton: true },
        'twemoji-parser': { singleton: true },
        'react-stacked-center-carousel': { singleton: true }
      }
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
