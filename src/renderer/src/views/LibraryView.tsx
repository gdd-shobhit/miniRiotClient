/**
 * LIBRARY VIEW — Phase 1 main screen
 *
 * Split into two panels:
 *   Left:  scrollable game list (GameCard components)
 *   Right: detail panel for the selected game
 *
 * State is read from Zustand (useGameStore). This is purely presentational
 * in Phase 1 — all data is hardcoded mock data from the store.
 */

import React from 'react'
import { useGameStore } from '../store/gameStore'
import GameCard from '../components/GameCard'
import StatusBadge from '../components/StatusBadge'

export default function LibraryView(): React.JSX.Element {
  const { games, selectedGameId, selectGame } = useGameStore()
  const selectedGame = games.find((g) => g.id === selectedGameId) ?? games[0]

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
        {/* Hero banner */}
        <div style={{ ...styles.hero, background: selectedGame.coverColor }}>
          <div style={styles.heroOverlay}>
            <h1 style={styles.heroTitle}>{selectedGame.title}</h1>
            <p style={styles.heroGenre}>{selectedGame.genre}</p>
          </div>
        </div>

        {/* Detail content */}
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

          <div style={styles.actions}>
            {selectedGame.status === 'installed' && (
              <button style={styles.btnPrimary}>
                Play
              </button>
            )}
            {selectedGame.status === 'update-available' && (
              <>
                <button style={styles.btnPrimary}>Play</button>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={statStyles.container}>
      <span style={statStyles.label}>{label}</span>
      <span style={statStyles.value}>{value}</span>
    </div>
  )
}

const statStyles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 2 },
  label: { fontSize: 11, color: '#5a6d7e', textTransform: 'uppercase', letterSpacing: '0.06em' },
  value: { fontSize: 16, fontWeight: 600, color: '#ece8e1' }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  // Game list panel
  gameList: {
    width: 280,
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflow: 'hidden'
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 8px'
  },
  listTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#5a6d7e'
  },
  count: {
    fontSize: 11,
    color: '#2d3f50',
    background: 'rgba(255,255,255,0.05)',
    padding: '2px 7px',
    borderRadius: 10
  },
  list: {
    listStyle: 'none',
    overflowY: 'auto',
    flex: 1,
    padding: '4px 8px'
  },
  // Detail panel
  detail: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  hero: {
    height: 220,
    position: 'relative',
    flexShrink: 0
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.2) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '24px 32px'
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#ece8e1'
  },
  heroGenre: {
    fontSize: 13,
    color: '#9aabbd',
    marginTop: 4
  },
  content: {
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    overflowY: 'auto',
    flex: 1
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  version: {
    fontSize: 11,
    color: '#2d3f50',
    letterSpacing: '0.04em'
  },
  description: {
    fontSize: 14,
    color: '#9aabbd',
    lineHeight: 1.7,
    maxWidth: 560
  },
  statsRow: {
    display: 'flex',
    gap: 40
  },
  actions: {
    display: 'flex',
    gap: 12
  },
  btnPrimary: {
    padding: '10px 32px',
    background: '#ff4655',
    color: '#ece8e1',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: 2,
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.15s'
  },
  btnSecondary: {
    padding: '10px 32px',
    background: 'transparent',
    color: '#9aabbd',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: 2,
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.15)',
    transition: 'border-color 0.15s'
  }
}
