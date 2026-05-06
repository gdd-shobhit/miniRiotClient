/**
 * ELECTRON-STORE — Persistent settings Model
 *
 * Learning note (Phase 2):
 *   electron-store wraps a JSON file on disk using Node.js `fs`. It lives in
 *   the user's app data directory (e.g. %APPDATA%/rift-launcher/config.json
 *   on Windows). It's accessible only from the main process — the renderer
 *   never touches the file system directly.
 *
 *   Analogy: This is my game's SaveGame system — the main process
 *   owns the file, and the UI layer (renderer) requests reads/writes through
 *   a defined interface (IPC), never directly.
 *
 *   electron-store is typed via a schema generic — same idea as my typed
 *   C++ config structs, just in TypeScript. This is a way to ensure that the settings are always valid and consistent.
 */

import Store from 'electron-store'
import type { Settings } from '../shared/types'

export const settingsStore = new Store<Settings>({
  name: 'config',
  defaults: {
    startOnBoot: false,
    minimizeToTray: true,
    autoUpdate: true,
    region: 'NA'
  }
})
