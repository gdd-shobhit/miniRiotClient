/**
 * PRELOAD SCRIPT — The security bridge (contextBridge)
 *
 * Learning note (Phase 1):
 *   This runs in a special context that has access to BOTH Node.js APIs AND
 *   the renderer's window object — but it's the ONLY place that does.
 *
 *   contextBridge.exposeInMainWorld() whitelists specific functions that the
 *   renderer can call. Nothing else from Node.js leaks into the renderer.
 *
 *   Analogy: Think of this like a game engine's RPC/exposed blueprint function
 *   table — only explicitly registered functions are callable from scripts.
 *
 * Phase 1: We expose minimal window controls (minimize/close) because we're
 * using a frameless window. IPC for data will be added in Phase 2.
 */

import { contextBridge, ipcRenderer } from 'electron'

// The API object exposed to the renderer as `window.electronAPI`
const electronAPI = {
  // Window controls — needed because we have frame: false
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),

  // Platform info — useful for conditional UI
  platform: process.platform
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// TypeScript: export the type so renderer can import it for type-safety
export type ElectronAPI = typeof electronAPI
