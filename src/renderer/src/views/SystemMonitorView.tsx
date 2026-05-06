/**
 * SYSTEM MONITOR VIEW — Phase 1 placeholder
 *
 * In Phase 3 this will display live CPU & memory data from the C++ native addon.
 * For now it shows static placeholder values so the routing and layout work.
 *
 * The comment blocks explain what will change in each future phase — a good
 * pattern for incremental learning.
 */

import React from 'react'

export default function SystemMonitorView(): React.JSX.Element {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>System Health</h1>
        <p style={styles.subtitle}>
          Live metrics from the C++ native addon — arrives in Phase 3
        </p>
      </div>

      <div style={styles.grid}>
        <MetricCard
          label="CPU Usage"
          value="— %"
          detail="Powered by native addon in Phase 3"
          color="#ff4655"
        />
        <MetricCard
          label="Memory Used"
          value="— GB"
          detail="GlobalMemoryStatusEx from system_info.cpp"
          color="#00b4d8"
        />
        <MetricCard
          label="Available Memory"
          value="— GB"
          detail="Exposed via node-addon-api N-API"
          color="#4ade80"
        />
        <MetricCard
          label="Uptime"
          value="— hrs"
          detail="GetTickCount64 / sysinfo on Linux/Mac"
          color="#c89b3c"
        />
      </div>

      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>What is a Native Addon?</h3>
        <p style={styles.infoText}>
          A C++ native addon is a <code>.node</code> file that Node.js (and Electron) can{' '}
          <code>require()</code> like any JS module. You write C++ using the{' '}
          <strong>node-addon-api</strong> library, compile it with <code>node-gyp</code>,
          and it runs at native speed — perfect for system calls, CPU-intensive work,
          or wrapping existing C++ libraries.
        </p>
        <p style={styles.infoText}>
          <strong>Analogy:</strong> Think of it like exposing a Slate/UMG native widget
          function to Blueprint — you write the low-level C++ and expose a clean interface
          that the higher-level system (JavaScript/Blueprint) can call without knowing the details.
        </p>
      </div>
    </div>
  )
}

function MetricCard({ label, value, detail, color }: {
  label: string; value: string; detail: string; color: string
}) {
  return (
    <div style={styles.card}>
      <span style={{ ...styles.cardAccent, background: color }} />
      <div style={styles.cardContent}>
        <span style={styles.cardLabel}>{label}</span>
        <span style={{ ...styles.cardValue, color }}>{value}</span>
        <span style={styles.cardDetail}>{detail}</span>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    padding: '32px 40px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 32
  },
  header: { display: 'flex', flexDirection: 'column', gap: 6 },
  title: { fontSize: 24, fontWeight: 700, color: '#ece8e1' },
  subtitle: { fontSize: 13, color: '#5a6d7e' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16
  },
  card: {
    background: '#1e2d3d',
    borderRadius: 8,
    overflow: 'hidden',
    display: 'flex',
    border: '1px solid rgba(255,255,255,0.06)'
  },
  cardAccent: {
    width: 4,
    flexShrink: 0
  },
  cardContent: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  cardLabel: { fontSize: 11, color: '#5a6d7e', textTransform: 'uppercase', letterSpacing: '0.08em' },
  cardValue: { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  cardDetail: { fontSize: 11, color: '#2d3f50', marginTop: 4 },
  infoBox: {
    background: '#1e2d3d',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  infoTitle: { fontSize: 14, fontWeight: 600, color: '#ece8e1' },
  infoText: { fontSize: 13, color: '#9aabbd', lineHeight: 1.7 }
}
