export interface Game {
  id: string
  title: string
  genre: string
  description: string
  status: 'installed' | 'not-installed' | 'update-available'
  lastPlayed: string | null
  playtimeHours: number
  coverColor: string   // gradient fallback while we have no real cover art
  version: string
}

// Augment the global Window interface so TypeScript knows about our
// contextBridge-exposed API (defined in preload/index.ts)
declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      platform: string
    }
  }
}
