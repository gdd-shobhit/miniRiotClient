/**
 * ZUSTAND STORE — Phase 1
 *
 * Learning note:
 *   Zustand is a minimal state manager. Think of it like a lightweight
 *   version of your MVVM ViewModel — it holds state and exposes actions.
 *   No boilerplate classes needed; just a typed create() call.
 *
 *   In Phase 2, the `games` array will come from the main process via IPC
 *   instead of being hardcoded here.
 */

import { create } from 'zustand'
import type { Game } from '../types'

const MOCK_GAMES: Game[] = [
  {
    id: 'valorant',
    title: 'VALORANT',
    genre: 'Tactical Shooter',
    description: 'A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities.',
    status: 'installed',
    lastPlayed: '2026-05-05',
    playtimeHours: 412,
    coverColor: 'linear-gradient(135deg, #ff4655 0%, #1a1a2e 100%)',
    version: '9.08'
  },
  {
    id: 'lol',
    title: 'League of Legends',
    genre: 'MOBA',
    description: 'Two teams of powerful champions, each with a unique design and playstyle, battle head-to-head.',
    status: 'installed',
    lastPlayed: '2026-04-20',
    playtimeHours: 1024,
    coverColor: 'linear-gradient(135deg, #c89b3c 0%, #0a1428 100%)',
    version: '14.9'
  },
  {
    id: 'tft',
    title: 'Teamfight Tactics',
    genre: 'Auto Battler',
    description: 'Build the ultimate team in this round-based strategy game set in the League of Legends universe.',
    status: 'update-available',
    lastPlayed: '2026-03-10',
    playtimeHours: 87,
    coverColor: 'linear-gradient(135deg, #00b4d8 0%, #03045e 100%)',
    version: '14.8'
  },
  {
    id: 'lor',
    title: 'Legends of Runeterra',
    genre: 'Card Game',
    description: 'Express yourself with an ever-growing roster of champions and cards from the world of Runeterra.',
    status: 'not-installed',
    lastPlayed: null,
    playtimeHours: 0,
    coverColor: 'linear-gradient(135deg, #7b2d8b 0%, #1a0a2e 100%)',
    version: '5.4'
  },
  {
    id: 'wildrift',
    title: 'Wild Rift',
    genre: 'MOBA',
    description: 'The League of Legends experience redesigned for mobile and console.',
    status: 'not-installed',
    lastPlayed: null,
    playtimeHours: 0,
    coverColor: 'linear-gradient(135deg, #2d6a4f 0%, #081c15 100%)',
    version: '5.2'
  }
]

interface GameStore {
  games: Game[]
  selectedGameId: string | null
  selectGame: (id: string) => void
}

export const useGameStore = create<GameStore>((set) => ({
  games: MOCK_GAMES,
  selectedGameId: MOCK_GAMES[0].id,
  selectGame: (id) => set({ selectedGameId: id })
}))
