/**
 * SHARED TYPES — single source of truth
 *
 * This file is importable by main, preload, and renderer alike.
 * No process-specific imports (no 'electron', no DOM APIs) are allowed here
 * — it must be pure TypeScript interfaces so all three build targets can use it.
 */

// similar to game settings struct in a game engine.
export interface Settings {
  startOnBoot: boolean
  minimizeToTray: boolean
  autoUpdate: boolean
  region: string
}

// similar to how a game engine would have a game struct with id, title, genre, description, status, last played, playtime hours, cover color, and version.
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

// similar to how a game engine would have a launch status enum and message for the launch sequence.
export interface LaunchStatus {
  gameId: string
  stage: 'checking' | 'patching' | 'launching' | 'running' | 'error'
  message: string
}

/**
 * SystemInfo — live metrics from the C++ native addon (Phase 3).
 *
 *   cpu         — CPU usage % (0–100), delta over the last polling interval
 *   memoryUsed  — Used RAM in GB
 *   memoryTotal — Total installed RAM in GB
 *   uptime      — System uptime in hours
 *   source      — 'native' if the C++ addon loaded OK, 'mock' if fallback
 */
export interface SystemInfo {
  cpu: number
  memoryUsed: number
  memoryTotal: number
  uptime: number
  source: 'native' | 'mock'
}
