/**
 * SHARED TYPES — single source of truth
 *
 * This file is importable by main, preload, and renderer alike.
 * No process-specific imports (no 'electron', no DOM APIs) are allowed here
 * — it must be pure TypeScript interfaces so all three build targets can use it.
 */

export interface Settings {
  startOnBoot: boolean
  minimizeToTray: boolean
  autoUpdate: boolean
  region: string
}

export interface Game {
  id: string
  title: string
  genre: string
  description: string
  status: 'installed' | 'not-installed' | 'update-available'
  lastPlayed: string | null
  playtimeHours: number
  coverColor: string
  version: string
}

export interface LaunchStatus {
  gameId: string
  stage: 'checking' | 'patching' | 'launching' | 'running' | 'error'
  message: string
}
