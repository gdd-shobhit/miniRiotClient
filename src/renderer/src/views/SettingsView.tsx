/**
 * SETTINGS VIEW — Pure view (Phase 2)
 *
 * This component now has zero business logic and zero local state.
 * It only:
 *   1. Reads from useSettingsStore (the ViewModel)
 *   2. Calls updateSetting() actions
 *
 * The ViewModel handles the IPC call and optimistic disk write.
 * This is the completed MVVM pattern — the View is a pure function of state.
 */

import React from 'react'
import { useSettingsStore } from '../store/settingsStore'

export default function SettingsView(): React.JSX.Element {
  const { settings, status, updateSetting } = useSettingsStore()

  if (status === 'idle' || status === 'loading') {
    return <LoadingState />
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>
          Saved to disk via <code>electron-store</code> — persists across restarts
        </p>
      </div>

      <div style={styles.sections}>
        <Section title="General">
          <Toggle
            label="Start on system boot"
            description="Launch Rift Launcher when Windows starts"
            checked={settings.startOnBoot}
            onChange={(v) => updateSetting('startOnBoot', v)}
          />
          <Toggle
            label="Minimize to system tray"
            description="Keep the app running in background when window is closed"
            checked={settings.minimizeToTray}
            onChange={(v) => updateSetting('minimizeToTray', v)}
          />
        </Section>

        <Section title="Updates">
          <Toggle
            label="Auto-update games"
            description="Download and install game patches automatically"
            checked={settings.autoUpdate}
            onChange={(v) => updateSetting('autoUpdate', v)}
          />
        </Section>

        <Section title="Region">
          <div style={styles.selectRow}>
            <div>
              <div style={styles.settingLabel}>Default Region</div>
              <div style={styles.settingDesc}>Affects matchmaking and latency</div>
            </div>
            <select
              value={settings.region}
              onChange={(e) => updateSetting('region', e.target.value)}
              style={styles.select}
            >
              {['NA', 'EU', 'KR', 'AP', 'BR', 'LATAM'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </Section>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#5a6d7e', fontSize: 13 }}>Loading settings…</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={sectionStyles.container}>
      <h2 style={sectionStyles.title}>{title}</h2>
      <div style={sectionStyles.content}>{children}</div>
    </div>
  )
}

function Toggle({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div style={toggleStyles.row}>
      <div>
        <div style={toggleStyles.label}>{label}</div>
        <div style={toggleStyles.desc}>{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{ ...toggleStyles.track, ...(checked ? toggleStyles.trackOn : {}) }}
      >
        <span style={{ ...toggleStyles.thumb, ...(checked ? toggleStyles.thumbOn : {}) }} />
      </button>
    </div>
  )
}

const sectionStyles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 0 },
  title: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#5a6d7e', marginBottom: 8
  },
  content: {
    background: '#1e2d3d', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8, overflow: 'hidden'
  }
}

const toggleStyles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)'
  },
  label: { fontSize: 13, color: '#ece8e1', fontWeight: 500 },
  desc: { fontSize: 12, color: '#5a6d7e', marginTop: 2 },
  track: {
    width: 40, height: 22, borderRadius: 11, background: '#2d3f50',
    border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
    transition: 'background 0.2s'
  },
  trackOn: { background: '#ff4655' },
  thumb: {
    position: 'absolute', top: 3, left: 3, width: 16, height: 16,
    borderRadius: '50%', background: '#ece8e1', transition: 'transform 0.2s'
  },
  thumbOn: { transform: 'translateX(18px)' }
}

const styles: Record<string, React.CSSProperties> = {
  container: { flex: 1, padding: '32px 40px', overflowY: 'auto' },
  header: { marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 700, color: '#ece8e1' },
  subtitle: { fontSize: 13, color: '#5a6d7e', marginTop: 6 },
  sections: { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600 },
  selectRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px'
  },
  settingLabel: { fontSize: 13, color: '#ece8e1', fontWeight: 500 },
  settingDesc: { fontSize: 12, color: '#5a6d7e', marginTop: 2 },
  select: {
    background: '#0f1923', border: '1px solid rgba(255,255,255,0.1)',
    color: '#ece8e1', padding: '6px 12px', borderRadius: 4, fontSize: 13, cursor: 'pointer'
  }
}
