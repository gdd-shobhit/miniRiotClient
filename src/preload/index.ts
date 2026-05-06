/**
 * PRELOAD SCRIPT — The security bridge (contextBridge)
 *
 * Phase 2 additions:
 *   - Games API: invoke 'games:getAll'
 *   - Settings API: invoke 'settings:getAll' and 'settings:set'
 *   - Launch API: invoke 'game:launch' + subscribe to 'game:status' push events
 *
 * Key pattern — push events from main to renderer:
 *   onGameStatus() registers a listener for events that main pushes via
 *   webContents.send('game:status', ...). The renderer doesn't poll; it just
 *   subscribes and reacts — same as a multicast delegate in Unreal.
 *
 *   The returned cleanup function (off) lets the renderer unsubscribe when
 *   the component unmounts — same as a game engine's or Slate's invalidation / unbinding.
 *
 * RULE: Every channel the renderer touches MUST be listed here explicitly.
 *   If it's not in contextBridge.exposeInMainWorld(), the renderer can't use it.
 */

import { contextBridge, ipcRenderer } from 'electron'
import type { Game, Settings, LaunchStatus } from '../shared/types'

const electronAPI = {
  // ── Window controls ───────────────────────────────────
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow:    () => ipcRenderer.send('window:close'),
  platform: process.platform,

  // ── Games ─────────────────────────────────────────────
  // invoke() returns a Promise — awaitable in the renderer
  getGames: (): Promise<Game[]> =>
    ipcRenderer.invoke('games:getAll'),

  // ── Settings ──────────────────────────────────────────
  getSettings: (): Promise<Settings> =>
    ipcRenderer.invoke('settings:getAll'),

  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> =>
    ipcRenderer.invoke('settings:set', key, value),

  // ── Game launch (push events) ─────────────────────────
  launchGame: (gameId: string): Promise<void> =>
    ipcRenderer.invoke('game:launch', gameId),

  // Subscribe to status events pushed FROM main.
  // Returns an unsubscribe function — call it in useEffect cleanup.
  onGameStatus: (callback: (status: LaunchStatus) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, status: LaunchStatus) =>
      callback(status)
    ipcRenderer.on('game:status', handler)
    return () => ipcRenderer.off('game:status', handler)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
