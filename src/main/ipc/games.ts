/**
 * GAMES IPC HANDLERS
 *
 * Learning note (Phase 2):
 *   ipcMain.handle() registers a request-response channel. The renderer calls
 *   ipcRenderer.invoke('channel-name', ...args) and gets back a Promise that
 *   resolves with whatever this handler returns.
 *
 *   Pattern: handle() is for request-response (like an async function call).
 *            on()     is for fire-and-forget (like an event dispatch).
 *
 *   Analogy: handle() ≈ a C++ callable function that returns a value.
 *            on()     ≈ a multicast delegate that doesn't return.
 *
 * IPC channels registered here:
 *   'games:getAll'  → returns the full game list from disk
 */

import { ipcMain } from 'electron'
import type { Game } from '../../shared/index'

// Vite bundles JSON imports at build time — no runtime file path needed.
// In a real launcher, this would come from a network manifest or a local DB.
import gamesData from '../data/games.json'

export function registerGamesHandlers(): void {
  ipcMain.handle('games:getAll', (): Game[] => {
    return gamesData as Game[]
  })
}
