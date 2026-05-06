/**
 * SETTINGS STORE — ViewModel for settings
 *
 * Learning note (Phase 2):
 *   This is the complete MVVM ViewModel pattern in Zustand:
 *
 *   1. State (the data the View binds to)
 *   2. loadSettings() — hydrates state from the Model (IPC → disk)
 *   3. updateSetting() — updates local state optimistically, then persists
 *      to the Model via IPC. Optimistic update = UI responds instantly,
 *      no waiting for disk write to confirm. Same pattern as a game engine's gameplay
 *      systems that predict and reconcile.
 *
 *   The View (SettingsView.tsx) only reads from here and calls actions —
 *   it has zero knowledge of IPC, electron-store, or file paths.
 */

import { create } from 'zustand'
import type { Settings } from '../types'

const DEFAULT_SETTINGS: Settings = {
  startOnBoot: false,
  minimizeToTray: true,
  autoUpdate: true,
  region: 'NA'
}

interface SettingsStore {
  settings: Settings
  status: 'idle' | 'loading' | 'ready'

  loadSettings: () => Promise<void>
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  status: 'idle',

  loadSettings: async () => {
    set({ status: 'loading' })
    const settings = await window.electronAPI.getSettings()
    set({ settings, status: 'ready' })
  },

  updateSetting: async (key, value) => {
    // Optimistic update — update UI immediately, then sync to disk
    set((state) => ({
      settings: { ...state.settings, [key]: value }
    }))
    await window.electronAPI.setSetting(key, value)
  }
}))

