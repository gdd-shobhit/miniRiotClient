/**
 * APP ROOT — Layout shell + routing
 *
 * Phase 2 additions:
 *   - useEffect on mount loads games + settings from main via IPC
 *   - initLaunchListener() registers the push-event subscriber for game status
 *     and returns a cleanup function (returned from useEffect so React calls
 *     it on unmount — preventing memory leaks from stale listeners)
 *
 * Layout:
 *   ┌─────────────────────────────────────┐
 *   │           TitleBar (40px)           │
 *   ├──────────┬──────────────────────────┤
 *   │          │                          │
 *   │ Sidebar  │   <Route content>        │
 *   │ (200px)  │                          │
 *   └──────────┴──────────────────────────┘
 */

import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import LibraryView from './views/LibraryView'
import SystemMonitorView from './views/SystemMonitorView'
import SettingsView from './views/SettingsView'
import { useGameStore } from './store/gameStore'
import { useSettingsStore } from './store/settingsStore'
import { useLaunchStore } from './store/launchStore'

export default function App(): React.JSX.Element {
  const loadGames = useGameStore((s) => s.loadGames)
  const loadSettings = useSettingsStore((s) => s.loadSettings)
  const initLaunchListener = useLaunchStore((s) => s.initLaunchListener)

  useEffect(() => {
    // Kick off both IPC fetches in parallel on app mount
    loadGames()
    loadSettings()

    // Register the push-event listener for game launch status.
    // useEffect returns the cleanup fn — React calls it on unmount.
    const unsubscribe = initLaunchListener()
    return unsubscribe
  }, [])

  return (
    <div style={styles.root}>
      <TitleBar />
      <div style={styles.body}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<LibraryView />} />
          <Route path="/monitor" element={<SystemMonitorView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#0f1923',
    overflow: 'hidden'
  },
  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden'
  }
}
