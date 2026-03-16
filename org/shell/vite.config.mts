/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { defineConfig, loadEnv } from 'vite'
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return ({
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
          "pixels": env.VITE_PIXELS,
          "create-pixels": env.VITE_CREATE_PIXELS
        },
        shared: {
          // Core UI: Must be singletons and eager to avoid "Multiple React instances" errors
          'react': { singleton: true, eager: true, requiredVersion: false },
          'react-dom': { singleton: true, eager: true, requiredVersion: false },
          'react-router-dom': { singleton: true, eager: true, requiredVersion: false },

          // State: MUST be singleton and eager so atoms sync across the Host and Remotes
          'jotai': { singleton: true, eager: true, requiredVersion: false },
          '@org/shared-state': {
            singleton: true,
            eager: true,
            requiredVersion: false
          },

          // Utilities: Singletons to save memory, but can load lazily (eager: false)
          'react-spinners': { singleton: true },
          '@emoji-mart/react': { singleton: true },
          '@emoji-mart/data': { singleton: true },
          'twemoji-parser': { singleton: true }
        }
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
  })
}

);
