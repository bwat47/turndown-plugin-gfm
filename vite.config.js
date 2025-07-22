import { readFileSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  // Build configuration for library mode
  build: {
    lib: {
      entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.js'),
      name: 'TurndownPluginGfm',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['turndown'],
      output: {
        globals: {
          turndown: 'TurndownService'
        }
      },
      // Copy declaration files
      plugins: [
        {
          name: 'copy-dts',
          generateBundle() {
            // Read the TypeScript declaration file
            const dtsPath = resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.d.ts')
            const dtsContent = readFileSync(dtsPath, 'utf-8')
            
            this.emitFile({
              type: 'asset',
              fileName: 'index.d.ts',
              source: dtsContent
            });
          }
        }
      ]
    },
    outDir: 'lib',
    sourcemap: true,
    minify: false // Keep readable for debugging
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.js'],
      exclude: ['src/index.js'] // Exclude the main export file from coverage
    }
  }
}) 