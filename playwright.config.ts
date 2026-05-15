/**
 * PLAYWRIGHT CONFIG — Phase 4
 *
 * Playwright has first-class Electron support via the _electron API.
 * Unlike web E2E tests that drive a browser, Playwright launches the actual
 * Electron binary and attaches to its BrowserWindow — the same window the
 * user sees. This means you test the real app, not a mocked environment.
 *
 * Key differences from web Playwright tests:
 *   - No `use.baseURL` or browser selection — Electron is the "browser"
 *   - App must be built first: run `npm run build` before `npm run test:e2e`
 *   - Use `_electron.launch({ args: [mainEntry] })` to start the app
 *   - `app.firstWindow()` returns the Page object for the main window
 *   - After that, all standard Playwright locators / assertions work normally
 *
 * Reporters:
 *   - 'list' for CI-friendly output
 *   - 'html' for a browsable report (generated in playwright-report/)
 */

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // Increase action timeout to handle slow app startup
    actionTimeout: 10_000
  }
})
