/**
 * VITEST CONFIG — Phase 4
 *
 * Vitest is Vite-native — it reuses the same transform pipeline (esbuild + plugins)
 * that electron-vite uses for the app. No separate Babel/ts-jest config needed.
 *
 * Two test environments are used in this project:
 *
 *   node   (default) — for unit tests of main-process code and pure functions.
 *                      Node.js APIs available, no DOM. Fast, no overhead.
 *
 *   jsdom            — for functional (component) tests. Provides a simulated
 *                      browser DOM so React can render and @testing-library/react
 *                      can query the output.
 *                      Annotate individual test files with:
 *                        // @vitest-environment jsdom
 *                      to override the default.
 *
 * Path aliases mirror electron-vite.config.ts so shared imports resolve in tests.
 *
 * globals: true — makes describe/it/expect available without importing them,
 *                 matching Vitest's recommended "globals" mode. You can still
 *                 import them explicitly if you prefer IDE autocompletion.
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    // Exclude Playwright E2E tests — they're run separately via `playwright test`
    exclude: ['tests/e2e/**', 'node_modules/**'],
    setupFiles: ['tests/functional/setup.ts'],
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@':         resolve(__dirname, 'src/renderer/src')
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/renderer/src/utils/**',
        'src/main/native/**',
        'src/main/ipc/**'
      ]
    }
  }
})
