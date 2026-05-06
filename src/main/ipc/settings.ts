/**
 * SETTINGS IPC HANDLERS
 *
 * Learning note (Phase 2):
 *   Two channels: get (read all) and set (write one key).
 *   The renderer never calls electron-store directly — it always goes through
 *   these handlers. This keeps the file system access isolated to main.
 *
 *   This is the full MVVM data flow:
 *     View (SettingsView.tsx)
 *       → ViewModel (settingsStore.ts / Zustand)
 *         → IPC invoke('settings:set', key, value)
 *           → Model (electron-store → config.json on disk)
 *
 * IPC channels registered here:
 *   'settings:getAll'       → returns all settings as a typed object
 *   'settings:set'          → writes a single key-value pair to disk
 */

import { ipcMain } from 'electron'
import { settingsStore } from '../store'
import type { Settings } from '../../shared/types'

export type { Settings }

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:getAll', (): Settings => {
    return settingsStore.store
  })

  // key is keyof Settings so TypeScript enforces valid setting names
  ipcMain.handle('settings:set', <K extends keyof Settings>(
    _event: Electron.IpcMainInvokeEvent,
    key: K,
    value: Settings[K]
  ): void => {
    settingsStore.set(key, value)
  })
}
