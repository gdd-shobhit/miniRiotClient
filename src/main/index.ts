/**
 * MAIN PROCESS — Electron's Node.js backend
 *
 * Learning note (Phase 1):
 *   Think of this like your game engine's main thread. It owns the OS window,
 *   file system, and any native resources. The renderer (React UI) runs in a
 *   sandboxed Chromium context — similar to how UMG/Slate widgets are isolated
 *   from engine systems and communicate via delegates/events.
 *
 *   Main <-> Renderer communication happens over IPC (Inter-Process
 *   Communication). We'll wire that up in Phase 2. For now, main just
 *   creates the window and loads the renderer HTML.
 */

import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'

// electron-vite provides these helpers to resolve the correct path in dev vs
// production (similar to how your engine resolves asset paths per config).
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,        // Frameless — we'll draw our own title bar in React
    backgroundColor: '#0f1923',
    webPreferences: {
      // preload.js is the ONLY bridge between main and renderer.
      // contextIsolation: true (default) means renderer has no direct access
      // to Node.js APIs — it can only use what preload explicitly exposes.
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      sandbox: false
    },
    show: false // Don't flash a white window before React loads
  })

  // Show window only once the renderer is fully painted (no white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Open external links in the system browser, not in the Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (isDev) {
    // electron-vite sets ELECTRON_RENDERER_URL to the Vite dev server address
    // (including port, which may vary if 5173 is taken). Always use this env var.
    const devUrl = process.env['ELECTRON_RENDERER_URL'] ?? 'http://localhost:5173'
    mainWindow.loadURL(devUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Window control IPC handlers (needed for our frameless window)
// These handle the messages sent from preload's electronAPI
ipcMain.on('window:minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
ipcMain.on('window:maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  win?.isMaximized() ? win.unmaximize() : win?.maximize()
})
ipcMain.on('window:close', () => BrowserWindow.getFocusedWindow()?.close())

// Electron lifecycle: createWindow only after the platform is ready
app.whenReady().then(() => {
  createWindow()

  // macOS convention: re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // On macOS apps stay active until explicitly quit
  if (process.platform !== 'darwin') app.quit()
})
