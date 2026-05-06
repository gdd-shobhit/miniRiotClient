/**
 * APP ROOT — Layout shell + routing
 *
 * Layout:
 *   ┌─────────────────────────────────────┐
 *   │           TitleBar (40px)           │
 *   ├──────────┬──────────────────────────┤
 *   │          │                          │
 *   │ Sidebar  │   <Route content>        │
 *   │ (200px)  │                          │
 *   │          │                          │
 *   └──────────┴──────────────────────────┘
 *
 * Routes:
 *   /          → LibraryView
 *   /monitor   → SystemMonitorView
 *   /settings  → SettingsView
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import LibraryView from './views/LibraryView'
import SystemMonitorView from './views/SystemMonitorView'
import SettingsView from './views/SettingsView'

export default function App(): React.JSX.Element {
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
