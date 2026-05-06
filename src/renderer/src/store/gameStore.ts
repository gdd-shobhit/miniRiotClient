/**
 * GAME STORE — ViewModel for the game library
 *
 * Phase 2 change: games no longer live here as hardcoded data.
 * loadGames() calls window.electronAPI.getGames() which invokes the
 * 'games:getAll' IPC channel → main reads games.json from disk → returns data.
 *
 * The store now has three states a component can react to:
 *   status: 'idle'    — not yet loaded
 *   status: 'loading' — IPC call in-flight
 *   status: 'ready'   — data available
 *
 * This pattern (loading state in the ViewModel) is equivalent to how to
 * track an async asset load status in a game engine ViewModel.
 */

import { create } from 'zustand'
import type { Game } from '../types'

type Status = 'idle' | 'loading' | 'ready'

interface GameStore {
  games: Game[]
  selectedGameId: string | null
  status: Status

  loadGames: () => Promise<void>
  selectGame: (id: string) => void
}

export const useGameStore = create<GameStore>((set) => ({
  games: [],
  selectedGameId: null,
  status: 'idle',

  loadGames: async () => {
    set({ status: 'loading' })
    const games = await window.electronAPI.getGames()
    set({ games, selectedGameId: games[0]?.id ?? null, status: 'ready' })
  },

  selectGame: (id) => set({ selectedGameId: id })
}))
