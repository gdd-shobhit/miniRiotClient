/**
 * SYSTEM MONITOR VIEW
 *
 * Data flow (full round trip):
 *   C++ addon (system_info.node)
 *     → getSystemInfo() in src/main/native/systemInfo.ts
 *     → setInterval in src/main/ipc/systemInfo.ts (every 2s)
 *     → win.webContents.send('system:info', data)   ← main pushes
 *     → ipcRenderer.on('system:info', handler)       ← preload receives
 *     → onSystemInfo(callback) in contextBridge      ← preload exposes
 *     → useEffect subscription here                  ← renderer consumes
 *     → React state update → re-render
 *
 */

import React, { useEffect, useState, useRef } from 'react'
import type { SystemInfo } from '../../../shared/types'
import { formatUptime } from '../utils/formatUptime'

// Default state while first data hasn't arrived

const EMPTY_INFO: SystemInfo = {
  cpu: 0,
  memoryUsed: 0,
  memoryTotal: 0,
  uptime: 0,
  source: 'mock'
}

// Main view 

export default function SystemMonitorView(): React.JSX.Element {
  const [info, setInfo] = useState<SystemInfo>(EMPTY_INFO)
  const [connected, setConnected] = useState(false)
  const prevCpu = useRef<number>(0)

  useEffect(() => {
    // 1. Fetch initial data immediately so the UI isn't empty on first render
    window.electronAPI.getSystemInfo().then((data) => {
      setInfo(data)
      setConnected(true)
    })

    // 2. Subscribe to the 2-second push loop from main
    //    onSystemInfo returns a cleanup function — exactly like removeEventListener
    const unsubscribe = window.electronAPI.onSystemInfo((data) => {
      prevCpu.current = info.cpu
      setInfo(data)
      setConnected(true)
    })

    // 3. Cleanup: unsubscribe when this component unmounts
    return unsubscribe
  }, [])

  const memPercent = info.memoryTotal > 0
    ? (info.memoryUsed / info.memoryTotal) * 100
    : 0

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <h1 style={styles.title}>System Health</h1>
          <LiveBadge source={info.source} connected={connected} />
        </div>
        <p style={styles.subtitle}>
          Live metrics from <code style={styles.code}>system_info.node</code> —
          C++ native addon via node-addon-api · updates every 2 s
        </p>
      </div>
      <div style={styles.grid}>
        <MetricCard
          label="CPU Usage"
          value={connected ? `${info.cpu.toFixed(1)} %` : '— %'}
          detail="GetSystemTimes() delta over 2-second window"
          color="#ff4655"
          percent={info.cpu}
        />
        <MetricCard
          label="Memory Used"
          value={connected ? `${info.memoryUsed.toFixed(2)} GB` : '— GB'}
          detail={connected ? `of ${info.memoryTotal.toFixed(1)} GB total` : 'GlobalMemoryStatusEx'}
          color="#00b4d8"
          percent={memPercent}
        />
        <MetricCard
          label="Available Memory"
          value={connected ? `${(info.memoryTotal - info.memoryUsed).toFixed(2)} GB` : '— GB'}
          detail="ullAvailPhys from GlobalMemoryStatusEx"
          color="#4ade80"
          percent={100 - memPercent}
        />
        <MetricCard
          label="System Uptime"
          value={connected ? formatUptime(info.uptime) : '—'}
          detail="GetTickCount64() since last boot"
          color="#c89b3c"
          percent={Math.min((info.uptime / 24) * 100, 100)}
        />
      </div>
      <div style={styles.infoBox}>
        <span style={styles.infoTitle}>How this data gets here</span>
        <div style={styles.pipeline}>
          {[
            'system_info.cpp',
            'GetSystemTimes / GlobalMemoryStatusEx',
            'node-addon-api → .node binary',
            'getSystemInfo() wrapper',
            'IPC: system:info push (2 s)',
            'contextBridge → onSystemInfo()',
            'useEffect → setState → render'
          ].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span style={styles.pipelineStep}>{step}</span>
              {i < arr.length - 1 && <span style={styles.pipelineArrow}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

// Sub-components 

function LiveBadge({ source, connected }: { source: 'native' | 'mock'; connected: boolean }) {
  if (!connected) return null
  const isLive = source === 'native'
  return (
    <div style={{ ...styles.badge, background: isLive ? 'rgba(74,222,128,0.15)' : 'rgba(255,70,85,0.15)', border: `1px solid ${isLive ? '#4ade80' : '#ff4655'}` }}>
      <span style={{ ...styles.badgeDot, background: isLive ? '#4ade80' : '#ff4655', animation: isLive ? 'pulse 2s infinite' : 'none' }} />
      <span style={{ color: isLive ? '#4ade80' : '#ff4655', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>
        {isLive ? 'LIVE · NATIVE ADDON' : 'MOCK DATA'}
      </span>
    </div>
  )
}

function MetricCard({
  label, value, detail, color, percent
}: {
  label: string; value: string; detail: string; color: string; percent: number
}) {
  return (
    <div style={styles.card}>
      <span style={{ ...styles.cardAccent, background: color }} />
      <div style={styles.cardContent}>
        <span style={styles.cardLabel}>{label}</span>
        <span style={{ ...styles.cardValue, color }}>{value}</span>
        <span style={styles.cardDetail}>{detail}</span>
        <div style={styles.barTrack}>
          <div
            style={{
              ...styles.barFill,
              width: `${Math.min(Math.max(percent, 0), 100)}%`,
              background: color,
              transition: 'width 1.8s ease-out'
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Styles 

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    padding: '32px 40px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 32
  },
  header: { display: 'flex', flexDirection: 'column', gap: 8 },
  titleRow: { display: 'flex', alignItems: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: 700, color: '#ece8e1', margin: 0 },
  subtitle: { fontSize: 13, color: '#5a6d7e', lineHeight: 1.6 },
  code: {
    fontFamily: 'monospace',
    background: 'rgba(255,255,255,0.06)',
    padding: '1px 6px',
    borderRadius: 4,
    fontSize: 12,
    color: '#c89b3c'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 20
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 16
  },
  card: {
    background: '#1e2d3d',
    borderRadius: 8,
    overflow: 'hidden',
    display: 'flex',
    border: '1px solid rgba(255,255,255,0.06)'
  },
  cardAccent: { width: 4, flexShrink: 0 },
  cardContent: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1
  },
  cardLabel: {
    fontSize: 11,
    color: '#5a6d7e',
    textTransform: 'uppercase',
    letterSpacing: '0.08em'
  },
  cardValue: { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  cardDetail: { fontSize: 11, color: '#3d5166', marginTop: 2 },
  barTrack: {
    marginTop: 12,
    height: 3,
    borderRadius: 2,
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    minWidth: 2
  },
  infoBox: {
    background: '#1a2530',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  infoTitle: { fontSize: 12, fontWeight: 600, color: '#5a6d7e', textTransform: 'uppercase', letterSpacing: '0.08em' },
  pipeline: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center'
  },
  pipelineStep: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#9aabbd',
    background: 'rgba(255,255,255,0.04)',
    padding: '3px 8px',
    borderRadius: 4,
    border: '1px solid rgba(255,255,255,0.06)'
  },
  pipelineArrow: { fontSize: 11, color: '#2d3f50' }
}
