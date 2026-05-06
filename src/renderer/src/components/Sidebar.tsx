/**
 * SIDEBAR — Navigation between views
 *
 * Learning note:
 *   Uses react-router-dom's NavLink for active-state styling.
 *   NavLink automatically applies an 'active' class when the route matches,
 *   similar to how you'd track a selected tab state in MVVM.
 */

import React from 'react'
import { NavLink } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',        label: 'Library',    icon: <GridIcon /> },
  { to: '/monitor', label: 'System',     icon: <MonitorIcon /> },
  { to: '/settings',label: 'Settings',   icon: <SettingsIcon /> }
]

export default function Sidebar(): React.JSX.Element {
  return (
    <nav style={styles.nav}>
      <ul style={styles.list}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.linkActive : {})
              })}
            >
              <span style={styles.icon}>{icon}</span>
              <span style={styles.label}>{label}</span>
              {/* Active indicator bar on the left */}
            </NavLink>
          </li>
        ))}
      </ul>

      <div style={styles.version}>
        <span>v1.0.0</span>
      </div>
    </nav>
  )
}

// ── SVG Icons ───────────────────────────────────────────
function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}
function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

// ── Styles ─────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  nav: {
    width: 200,
    background: '#0d1620',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    padding: '12px 0'
  },
  list: {
    listStyle: 'none',
    flex: 1
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 20px',
    color: '#5a6d7e',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.04em',
    transition: 'color 0.15s, background 0.15s',
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent'
  },
  linkActive: {
    color: '#ece8e1',
    background: 'rgba(255,255,255,0.04)',
    borderLeftColor: '#ff4655'
  },
  icon: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {},
  version: {
    padding: '16px 20px',
    fontSize: 11,
    color: '#2d3f50',
    letterSpacing: '0.04em'
  }
}
