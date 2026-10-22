import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // pemisahan chunk agar bundle tetap modular & cacheable
    rollupOptions: {
      output: {
        manualChunks: {
          core: [
            './src/core/state.js',
            './src/core/bus.js',
            './src/components/registry.js',
            './src/components/templates.js',
            './src/components/contentFields.js'
          ],
          rendering: [
            './src/rendering/nodeStyle.js',
            './src/rendering/canvasRenderer.js',
            './src/rendering/selectionOverlay.js',
            './src/rendering/layersPanel.js'
          ],
          ui: [
            './src/ui/topbar.js',
            './src/ui/inspector.js',
            './src/ui/statusbar.js',
            './src/ui/libraryPanel.js',
            './src/ui/modal.js',
            './src/ui/toast.js'
          ],
          interaction: [
            './src/interaction/canvasInteraction.js',
            './src/interaction/libraryDrag.js',
            './src/interaction/keyboard.js'
          ],
          services: [
            './src/history/history.js',
            './src/persistence/storage.js',
            './src/exports/exportHtml.js',
            './src/exports/exportPng.js',
            './src/exports/exportJson.js',
            './src/exports/importJson.js',
            './src/exports/printPdf.js'
          ]
        }
      }
    }
  }
});
