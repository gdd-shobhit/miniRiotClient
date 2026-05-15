/**
 * E2E TEST — Full app launch + game launch flow
 *
 * Playwright's _electron API:
 *   `electron.launch({ args: [mainEntry] })` spawns the Electron binary with
 *   your compiled main file as the entry point.
 *   `app.firstWindow()` returns a Playwright Page for the BrowserWindow.
 *   All standard Playwright locators/assertions work from there.
 *
 * isDev fix (Phase 4 lesson):
 *   The original `isDev = process.env.NODE_ENV === 'development' || !app.isPackaged`
 *   was true during E2E tests because `app.isPackaged` is always false when running
 *   from source. This caused main to try loading localhost:5173 (not running) and
 *   open DevTools — which Playwright's `firstWindow()` attached to instead of the
 *   app window. Fixed by using `!!process.env.ELECTRON_RENDERER_URL` which
 *   electron-vite only sets during actual `electron-vite dev` runs.
 *
 * innerText + CSS text-transform lesson:
 *   `Element.innerText` returns rendered text INCLUDING CSS text-transform.
 *   So an element with `text-transform: uppercase` and content "My Games"
 *   will have innerText "MY GAMES". Always use case-insensitive comparisons
 *   or query by DOM structure rather than text content when CSS transforms apply.
 *
 * Prerequisites: the app must be built before running E2E tests.
 * Run: npm run test:e2e   (builds then runs playwright)
 */

import { test, expect, _electron as electron } from '@playwright/test'
import path from 'path'

let app: Awaited<ReturnType<typeof electron.launch>>

test.beforeAll(async () => {
  app = await electron.launch({
    args: [path.join(process.cwd(), 'out', 'main', 'index.mjs')],
    env: { ...process.env, NODE_ENV: 'production' }
  })
})

test.afterAll(async () => {
  await app.close()
})

// ── Helper ───────────────────────────────────────────────────────────────────

async function getWindow() {
  const page = await app.firstWindow()
  // 'load' fires after the JS bundle has fully executed.
  await page.waitForLoadState('load')
  return page
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test('app window opens and React app renders', async () => {
  const page = await getWindow()
  // The React root div mounts immediately after load
  await expect(page.locator('div').first()).toBeAttached()
})

test('game library loads at least one game card', async () => {
  const page = await getWindow()

  // The game list renders <li role="option"> for each game.
  // Games are already loaded (IPC resolves quickly in production).
  // waitForFunction checks DOM presence — unaffected by CSS text-transform.
  await page.waitForFunction(
    () => document.querySelectorAll('[role="option"]').length > 0,
    { timeout: 10000 }
  )

  const cardCount = await page.locator('[role="option"]').count()
  expect(cardCount).toBeGreaterThan(0)
})

test('selecting a game card shows a Play button', async () => {
  const page = await getWindow()

  // Games should already be in the DOM after load
  await page.waitForFunction(
    () => document.querySelectorAll('[role="option"]').length > 0,
    { timeout: 10000 }
  )

  // Click the first card
  await page.locator('[role="option"]').first().click()

  // Play button appears for installed games
  await expect(page.getByRole('button', { name: /^play$/i })).toBeVisible({ timeout: 3000 })
})

test('launch game flow — all stages appear in sequence', async () => {
  const page = await getWindow()

  await page.waitForFunction(
    () => document.querySelectorAll('[role="option"]').length > 0,
    { timeout: 10000 }
  )

  // Select the first game, then click Play
  await page.locator('[role="option"]').first().click()
  await page.getByRole('button', { name: /^play$/i }).click()

  // Main process emits: checking → patching → launching → running (~2.4s total).
  // { exact: true } prevents strict mode violations — "RUNNING" would otherwise
  // also match the button text "Running" and message "Game is running.".
  await expect(page.getByText('CHECKING',  { exact: true })).toBeVisible({ timeout: 3000 })
  await expect(page.getByText('PATCHING',  { exact: true })).toBeVisible({ timeout: 3000 })
  await expect(page.getByText('LAUNCHING', { exact: true })).toBeVisible({ timeout: 3000 })
  await expect(page.getByText('RUNNING',   { exact: true })).toBeVisible({ timeout: 5000 })
})

test('system monitor view shows metric labels', async () => {
  const page = await getWindow()

  // Navigate via the sidebar NavLink — label is "System" (see Sidebar.tsx NAV_ITEMS)
  await page.getByText('System').click()

  // SystemMonitorView renders four metric cards
  await expect(page.getByText(/cpu usage/i)).toBeVisible({ timeout: 5000 })
  await expect(page.getByText(/memory used/i)).toBeVisible({ timeout: 3000 })
  await expect(page.getByText(/available memory/i)).toBeVisible({ timeout: 3000 })
  await expect(page.getByText(/system uptime/i)).toBeVisible({ timeout: 3000 })
})
