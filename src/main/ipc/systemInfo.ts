/**
 * SYSTEM INFO IPC HANDLERS
 *
 * Phase 3: Demonstrates the push-from-main pattern with a native C++ addon.
 *
 * Architecture:
 *   Main process calls the C++ addon every 2 seconds and pushes the result
 *   to the renderer via webContents.send('system:info', data).
 *   The renderer just subscribes — it never polls.
 *
 * IPC channels registered here:
 *   'system:getInfo'  → one-shot request-response (handle)
 *   'system:info'     → pushed FROM main TO renderer on a 2-second interval (send)
 */

import { ipcMain, BrowserWindow } from 'electron'
import { getSystemInfo } from '../native/systemInfo'

let pollingInterval: ReturnType<typeof setInterval> | null = null

export function registerSystemInfoHandlers(): void {
  ipcMain.handle('system:getInfo', () => getSystemInfo())
}

/**
 * startSystemInfoPolling(win)
 *
 * Establishes the CPU baseline with an initial call, then
 * starts a 2-second interval that pushes live data to the renderer.
 *
 * The interval is automatically cleared when the window is destroyed.
 */
export function startSystemInfoPolling(win: BrowserWindow): void {
  // Establish baseline so the first real reading 2s later has a valid delta
  getSystemInfo()

  pollingInterval = setInterval(() => {
    if (win.isDestroyed()) {
      stopSystemInfoPolling()
      return
    }
    const info = getSystemInfo()
    win.webContents.send('system:info', info)
  }, 2000)

  win.on('closed', stopSystemInfoPolling)
}

export function stopSystemInfoPolling(): void {
  if (pollingInterval !== null) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}
