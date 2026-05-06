/**
 * GAMECARD
 *
 * A selectable card in the library sidebar. Clicking it updates the Zustand
 * store (selectedGameId), which the GameDetail panel reads reactively.
 * This is the React equivalent of your MVVM selection binding.
 */

import React from 'react'
import type { Game } from '../types'
import StatusBadge from './StatusBadge'

interface Props {
  game: Game
  isSelected: boolean
  onSelect: () => void
}

export default function GameCard({ game, isSelected, onSelect }: Props): React.JSX.Element {
  return (
    <li
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      style={{
        ...styles.card,
        ...(isSelected ? styles.cardSelected : {})
      }}
    >
      {/* Cover art placeholder */}
      <div style={{ ...styles.cover, background: game.coverColor }} />

      <div style={styles.info}>
        <span style={styles.title}>{game.title}</span>
        <span style={styles.genre}>{game.genre}</span>
        <StatusBadge status={game.status} />
      </div>
    </li>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    cursor: 'pointer',
    borderRadius: 6,
    transition: 'background 0.15s',
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
    userSelect: 'none'
  },
  cardSelected: {
    background: 'rgba(255,255,255,0.06)',
    borderLeftColor: '#ff4655'
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 4,
    flexShrink: 0
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflow: 'hidden'
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    color: '#ece8e1',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  genre: {
    fontSize: 11,
    color: '#5a6d7e'
  }
}
