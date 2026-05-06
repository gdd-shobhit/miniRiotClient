/**
 * LIBRARY VIEW — Phase 2
 *
 * Changes from Phase 1:
 *   - Games come from useGameStore (loaded via IPC on app mount)
 *   - Launch button triggers useLaunchStore.launchGame()
 *   - LaunchStatusBar shows real-time push events from main process
 *
 * The full IPC round-trip on Play click:
 *   1. User clicks Play
 *   2. launchGame(gameId) → invoke('game:launch', gameId)
 *   3. Main process: simulateLaunch() starts, sends 'game:status' events
 *   4. preload: onGameStatus listener receives events, calls our callback
 *   5. launchStore updates `status` state
 *   6. LaunchStatusBar re-renders with each new stage
 */

import React from 'react'
import { useGameStore } from '../store/gameStore'
import { useLaunchStore } from '../store/launchStore'
import GameCard from '../components/GameCard'
import StatusBadge from '../components/StatusBadge'

export default function LibraryView(): React.JSX.Element {
  const { games, selectedGameId, status: loadStatus, selectGame } = useGameStore()
  const { launchGame, isLaunching, activeGameId, status: launchStatus } = useLaunchStore()
  const selectedGame = games.find((g) => g.id === selectedGameId) ?? games[0]

  if (loadStatus === 'idle' || loadStatus === 'loading') {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#5a6d7e', fontSize: 13 }}>Loading library…</span>
      </div>
    )
  }

  if (!selectedGame) return <div style={{ flex: 1 }} />

  const isThisGameLaunching = isLaunching && activeGameId === selectedGame.id
  const isThisGameRunning = !isLaunching && activeGameId === selectedGame.id && launchStatus?.stage === 'running'
  const isButtonDisabled = isThisGameLaunching || isThisGameRunning

  return (
    <div style={styles.container}>
      {/* ── Left: Game List ─────────────────────────── */}
      <aside style={styles.gameList}>
        <div style={styles.listHeader}>
          <h2 style={styles.listTitle}>My Games</h2>
          <span style={styles.count}>{games.length}</span>
        </div>
        <ul style={styles.list} role="listbox">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isSelected={game.id === selectedGameId}
              onSelect={() => selectGame(game.id)}
            />
          ))}
        </ul>
      </aside>

      {/* ── Right: Game Detail ──────────────────────── */}
      <main style={styles.detail}>
        <div style={{ ...styles.hero, background: selectedGame.coverColor }}>
          <div style={styles.heroOverlay}>
            <h1 style={styles.heroTitle}>{selectedGame.title}</h1>
            <p style={styles.heroGenre}>{selectedGame.genre}</p>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.row}>
            <StatusBadge status={selectedGame.status} />
            <span style={styles.version}>v{selectedGame.version}</span>
          </div>

          <p style={styles.description}>{selectedGame.description}</p>

          <div style={styles.statsRow}>
            <Stat label="Hours Played" value={selectedGame.playtimeHours.toString()} />
            <Stat label="Last Played" value={selectedGame.lastPlayed ?? 'Never'} />
          </div>

          {/* Launch status bar — visible during and after launch */}
          {isThisGameLaunching || (launchStatus && activeGameId === selectedGame.id) ? (
            <LaunchStatusBar
              stage={launchStatus?.stage ?? 'checking'}
              message={launchStatus?.message ?? 'Preparing…'}
            />
          ) : null}

          <div style={styles.actions}>
            {selectedGame.status === 'installed' && (
              <button
                style={{ ...styles.btnPrimary, ...(isButtonDisabled ? styles.btnDisabled : {}) }}
                onClick={() => !isButtonDisabled && launchGame(selectedGame.id)}
                disabled={isButtonDisabled}
              >
                {isThisGameLaunching ? 'Launching…' : isThisGameRunning ? 'Running' : 'Play'}
              </button>
            )}
            {selectedGame.status === 'update-available' && (
              <>
                <button style={styles.btnPrimary} onClick={() => launchGame(selectedGame.id)}>Play</button>
                <button style={styles.btnSecondary}>Update</button>
              </>
            )}
            {selectedGame.status === 'not-installed' && (
              <button style={styles.btnPrimary}>Install</button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={statStyles.container}>
      <span style={statStyles.label}>{label}</span>
      <span style={statStyles.value}>{value}</span>
    </div>
  )
}

const STAGE_COLORS: Record<string, string> = {
  checking:  '#c89b3c',
  patching:  '#00b4d8',
  launching: '#ff4655',
  running:   '#4ade80',
  error:     '#ef4444'
}

function LaunchStatusBar({ stage, message }: { stage: string; message: string }) {
  const color = STAGE_COLORS[stage] ?? '#9aabbd'
  return (
    <div style={launchStyles.bar}>
      <span style={{ ...launchStyles.dot, background: color }} />
      <span style={{ ...launchStyles.stage, color }}>{stage.toUpperCase()}</span>
      <span style={launchStyles.message}>{message}</span>
    </div>
  )
}

const launchStyles: Record<string, React.CSSProperties> = {
  bar: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', background: 'rgba(0,0,0,0.3)',
    borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)'
  },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  stage: { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', flexShrink: 0 },
  message: { fontSize: 13, color: '#9aabbd' }
}

const statStyles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 2 },
  label: { fontSize: 11, color: '#5a6d7e', textTransform: 'uppercase', letterSpacing: '0.06em' },
  value: { fontSize: 16, fontWeight: 600, color: '#ece8e1' }
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flex: 1, overflow: 'hidden' },
  gameList: {
    width: 280, borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden'
  },
  listHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 16px 8px'
  },
  listTitle: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#5a6d7e'
  },
  count: {
    fontSize: 11, color: '#2d3f50', background: 'rgba(255,255,255,0.05)',
    padding: '2px 7px', borderRadius: 10
  },
  list: { listStyle: 'none', overflowY: 'auto', flex: 1, padding: '4px 8px' },
  detail: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  hero: { height: 220, position: 'relative', flexShrink: 0 },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.2) 100%)',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px 32px'
  },
  heroTitle: { fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: '#ece8e1' },
  heroGenre: { fontSize: 13, color: '#9aabbd', marginTop: 4 },
  content: {
    padding: '24px 32px', display: 'flex', flexDirection: 'column',
    gap: 20, overflowY: 'auto', flex: 1
  },
  row: { display: 'flex', alignItems: 'center', gap: 16 },
  version: { fontSize: 11, color: '#2d3f50', letterSpacing: '0.04em' },
  description: { fontSize: 14, color: '#9aabbd', lineHeight: 1.7, maxWidth: 560 },
  statsRow: { display: 'flex', gap: 40 },
  actions: { display: 'flex', gap: 12 },
  btnPrimary: {
    padding: '10px 32px', background: '#ff4655', color: '#ece8e1',
    fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase',
    borderRadius: 2, cursor: 'pointer', border: 'none', transition: 'background 0.15s'
  },
  btnDisabled: { background: '#5a2d34', cursor: 'not-allowed' },
  btnSecondary: {
    padding: '10px 32px', background: 'transparent', color: '#9aabbd',
    fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase',
    borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)',
    transition: 'border-color 0.15s'
  }
}
