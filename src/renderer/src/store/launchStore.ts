/**
 * LAUNCH STORE — ViewModel for the game launch sequence
 *
 * Learning note (Phase 2) — push event subscription:
 *   The main process sends 'game:status' events via webContents.send() as
 *   the launch progresses. This store subscribes to those events and updates
 *   state so any component can react to the current launch stage.
 *
 *   initLaunchListener() is called once in App.tsx (on mount). It registers
 *   the listener and returns a cleanup function — exactly the pattern for
 *   useEffect subscriptions in React.
 *
 *   Analogy: This is a game engine's event/delegate subscriber — register once,
 *   receive events, clean up when the context is destroyed.
 */

import { create } from 'zustand'
import type { LaunchStatus } from '../types/index'

interface LaunchStore {
  activeGameId: string | null
  status: LaunchStatus | null
  isLaunching: boolean

  launchGame: (gameId: string) => Promise<void>
  initLaunchListener: () => () => void   // returns cleanup fn
}

export const useLaunchStore = create<LaunchStore>((set) => ({
  activeGameId: null,
  status: null,
  isLaunching: false,

  launchGame: async (gameId: string) => {
    set({ activeGameId: gameId, isLaunching: true, status: null })
    await window.electronAPI.launchGame(gameId)
    // launchGame resolves when all stages are done (after 'running' stage)
    set({ isLaunching: false })
  },

  initLaunchListener: () => {
    // Subscribe to push events from main process
    const unsubscribe = window.electronAPI.onGameStatus((status: LaunchStatus) => {
      set({ status })
    })
    // Return the cleanup function — call this in useEffect's return
    return unsubscribe
  }
}))
