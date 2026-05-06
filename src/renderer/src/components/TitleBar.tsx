/**
 * TITLEBAR
 *
 * Learning note:
 *   Because we set `frame: false` in BrowserWindow, Electron removes the OS
 *   title bar. We draw our own in React so we can style it to match the app.
 *   The drag region is set via -webkit-app-region: drag (Electron-specific CSS).
 *   Buttons are excluded from drag via -webkit-app-region: no-drag.
 *
 *   The window control calls go through window.electronAPI (our contextBridge
 *   preload API) — the renderer never touches Electron directly.
 */

import React from 'react'

export default function TitleBar(): React.JSX.Element {
  return (
    <header style={styles.bar}>
      {/* Drag area — user can drag the window by grabbing this */}
      <div style={styles.dragRegion}>
        <span style={styles.logo}>RIFT</span>
        <span style={styles.title}>Launcher</span>
      </div>

      {/* Window controls — must opt-out of drag region */}
      <div style={styles.controls}>
        <button
          style={styles.controlBtn}
          onClick={() => window.electronAPI.minimizeWindow()}
          title="Minimize"
        >
          <MinimizeIcon />
        </button>
        <button
          style={styles.controlBtn}
          onClick={() => window.electronAPI.maximizeWindow()}
          title="Maximize"
        >
          <MaximizeIcon />
        </button>
        <button
          style={{ ...styles.controlBtn, ...styles.closeBtn }}
          onClick={() => window.electronAPI.closeWindow()}
          title="Close"
        >
          <CloseIcon />
        </button>
      </div>
    </header>
  )
}

// ── Inline SVG Icons ────────────────────────────────────
const MinimizeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12">
    <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const MaximizeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12">
    <rect x="2" y="2" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12">
    <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ── Styles ─────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  bar: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    background: '#0a1018',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
    userSelect: 'none'
  },
  dragRegion: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    // @ts-expect-error — Electron-specific CSS property
    WebkitAppRegion: 'drag'
  },
  logo: {
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: '0.12em',
    color: '#ff4655'
  },
  title: {
    fontSize: 12,
    color: '#5a6d7e',
    letterSpacing: '0.06em'
  },
  controls: {
    display: 'flex',
    alignItems: 'stretch',
    height: '100%',
    // @ts-expect-error — Electron-specific CSS property
    WebkitAppRegion: 'no-drag'
  },
  controlBtn: {
    width: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#5a6d7e',
    transition: 'background 0.15s, color 0.15s',
  },
  closeBtn: {
    // override hover handled via onMouseEnter/Leave or CSS — kept simple here
  }
}
