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
          // Preload only what the host needs to mount. This emits modulepreload
          // links in index.html, so these chunks fetch concurrently.
          'react': { singleton: true, requiredVersion: false, modulePreload: true },
          'react-dom': { singleton: true, requiredVersion: false, modulePreload: true },
          'react-router-dom': { singleton: true, requiredVersion: false, modulePreload: true },

          // State remains singleton, but is module-preloaded alongside React.
          'jotai': { singleton: true, requiredVersion: false, modulePreload: true },
          '@org/shared-state': {
            singleton: true,
            requiredVersion: false,
            modulePreload: true
          }
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
