/**
 * Renderer types — re-export from shared source of truth.
 * No type is defined here; everything lives in src/shared/types.ts.
 */
import type { Settings, Game, LaunchStatus, SystemInfo } from '../../../shared/types'

export type { Settings, Game, LaunchStatus, SystemInfo }

// Augment the global Window so every component gets full type-safety
// on window.electronAPI without extra imports.
declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      platform: string

      getGames: () => Promise<Game[]>

      getSettings: () => Promise<Settings>
      setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>

      launchGame: (gameId: string) => Promise<void>
      onGameStatus: (callback: (status: LaunchStatus) => void) => () => void

      // System Info from C++ native addon
      getSystemInfo: () => Promise<SystemInfo>
      onSystemInfo: (callback: (info: SystemInfo) => void) => () => void
    }
  }
}
