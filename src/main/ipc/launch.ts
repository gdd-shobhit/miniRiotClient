/**
 * GAME LAUNCH IPC HANDLERS
 *
 * Learning note (Phase 2) — bidirectional IPC:
 *   This introduces a new pattern: main process pushing events TO the renderer.
 *   The launch sequence is async (takes time), so instead of blocking the
 *   invoke() call, main uses webContents.send() to push progress events back.
 *
 *   Flow:
 *     Renderer → invoke('game:launch', gameId)
 *     Main     → starts async sequence
 *     Main     → webContents.send('game:status', { stage: 'checking' })
 *     Main     → webContents.send('game:status', { stage: 'launching' })
 *     Main     → webContents.send('game:status', { stage: 'running' })
 *     Renderer → ipcRenderer.on('game:status', handler) receives each event
 *
 *   Analogy: This is exactly like a game engine's async loading with callbacks /
 *   progress delegates — the loader emits events as stages complete.
 *
 * IPC channels registered here:
 *   'game:launch'   → starts the launch sequence (handle)
 *   'game:status'   → pushed FROM main TO renderer (send)
 */

import { ipcMain, BrowserWindow } from 'electron'
import type { LaunchStatus } from '../../shared/types'

export type { LaunchStatus }

// Simulates a multi-stage launch sequence with async delays.
// In a real launcher, each stage would be real work:
//   checking  → verify file integrity (hash check)
//   patching  → download + apply delta patch
//   launching → spawn the game process
//   running   → monitor game process
async function simulateLaunch(gameId: string, win: BrowserWindow): Promise<void> {
  const send = (status: LaunchStatus) => win.webContents.send('game:status', status)

  const stages: Array<[LaunchStatus['stage'], string, number]> = [
    ['checking',  'Verifying game files…',     800],
    ['patching',  'No updates required.',       600],
    ['launching', 'Starting game client…',     1000],
    ['running',   'Game is running.',              0]
  ]

  for (const [stage, message, delay] of stages) {
    send({ gameId, stage, message })
    if (delay > 0) await new Promise((r) => setTimeout(r, delay))
  }
}

export function registerLaunchHandlers(): void {
  ipcMain.handle('game:launch', async (event, gameId: string): Promise<void> => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return
    await simulateLaunch(gameId, win)
  })
}
