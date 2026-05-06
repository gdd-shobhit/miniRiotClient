import React from 'react'
import type { Game } from '../types'

interface Props {
  status: Game['status']
}

const LABELS: Record<Game['status'], string> = {
  'installed': 'Installed',
  'update-available': 'Update Available',
  'not-installed': 'Not Installed'
}

export default function StatusBadge({ status }: Props): React.JSX.Element {
  return (
    <span className={`status-${status}`} style={styles.badge}>
      <span style={styles.dot} />
      {LABELS[status]}
    </span>
  )
}

const styles: Record<string, React.CSSProperties> = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'currentColor'
  }
}
