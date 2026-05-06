/**
 * MAIN PROCESS — Electron's Node.js backend
 *
 * Phase 2 additions:
 *   - IPC handlers for games, settings, and game launch are now registered.
 *   - All domain logic lives in src/main/ipc/* modules (one per concern).
 *   - electron-store (config.json on disk) is initialized via store.ts.
 *
 * The IPC architecture mirrors a service layer in a traditional app:
 *   Renderer (View/ViewModel) → IPC → Main (Service/Model) → Disk / OS
 */

import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'
import { registerGamesHandlers } from './ipc/games'
import { registerSettingsHandlers } from './ipc/settings'
import { registerLaunchHandlers } from './ipc/launch'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    backgroundColor: '#0f1923',
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      sandbox: false
    },
    show: false
  })

  // Show window only once the renderer is fully painted (no white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (isDev) {
    const devUrl = process.env['ELECTRON_RENDERER_URL'] ?? 'http://localhost:5173'
    mainWindow.loadURL(devUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ── Window controls (Phase 1) ───────────────────────────
ipcMain.on('window:minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
ipcMain.on('window:maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  win?.isMaximized() ? win.unmaximize() : win?.maximize()
})
ipcMain.on('window:close', () => BrowserWindow.getFocusedWindow()?.close())

// ── Domain IPC handlers (Phase 2) ──────────────────────
// Each register* function calls ipcMain.handle() for its domain channels.
// Keeping them in separate modules makes it easy to unit-test each handler
// in isolation (Phase 4).
registerGamesHandlers()
registerSettingsHandlers()
registerLaunchHandlers()

// ── App lifecycle ───────────────────────────────────────
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// iOS specific lifecycle event
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
