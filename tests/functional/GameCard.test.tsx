// @vitest-environment jsdom
/**
 * FUNCTIONAL TEST — GameCard component
 *
 * Learning note — functional tests vs unit tests:
 *
 *   Unit test:      tests a single function in isolation, no rendering.
 *   Functional test: renders a React component and tests what the USER sees
 *                    (text, roles, attributes), not implementation details.
 *
 *   @testing-library/react's philosophy: "The more your tests resemble the way
 *   your software is used, the more confidence they give you."
 *
 *   Key rule: query by role/text/label — the same way a user (or screen reader)
 *   would find elements. Avoid querying by class name or internal component state.
 *
 * The `// @vitest-environment jsdom` annotation at the top tells Vitest to run
 * this specific file in a jsdom environment (simulated browser DOM) instead of
 * the default Node.js environment. Required for React rendering.
 *
 * Run: npm run test:functional
 */

import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameCard from '../../src/renderer/src/components/GameCard'
import type { Game } from '../../src/shared/types'

// ── Test fixture ─────────────────────────────────────────────────────────────

const mockGame: Game = {
  id: 'test-game-1',
  title: 'Valorant',
  genre: 'Tactical Shooter',
  description: 'Test description',
  status: 'installed',
  lastPlayed: '2025-01-15',
  playtimeHours: 142,
  coverColor: '#ff4655',
  version: '9.04'
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GameCard', () => {
  it('renders the game title', () => {
    render(<GameCard game={mockGame} isSelected={false} onSelect={vi.fn()} />)
    expect(screen.getByText('Valorant')).toBeInTheDocument()
  })

  it('renders the game genre', () => {
    render(<GameCard game={mockGame} isSelected={false} onSelect={vi.fn()} />)
    expect(screen.getByText('Tactical Shooter')).toBeInTheDocument()
  })

  it('renders the status badge for installed games', () => {
    render(<GameCard game={mockGame} isSelected={false} onSelect={vi.fn()} />)
    expect(screen.getByText('Installed')).toBeInTheDocument()
  })

  it('renders the correct status badge for update-available games', () => {
    const updateGame: Game = { ...mockGame, status: 'update-available' }
    render(<GameCard game={updateGame} isSelected={false} onSelect={vi.fn()} />)
    expect(screen.getByText('Update Available')).toBeInTheDocument()
  })

  it('renders the correct status badge for not-installed games', () => {
    const notInstalledGame: Game = { ...mockGame, status: 'not-installed' }
    render(<GameCard game={notInstalledGame} isSelected={false} onSelect={vi.fn()} />)
    expect(screen.getByText('Not Installed')).toBeInTheDocument()
  })

  it('has role="option" for accessibility', () => {
    render(<GameCard game={mockGame} isSelected={false} onSelect={vi.fn()} />)
    // @testing-library queries by ARIA role — the same way screen readers navigate
    const card = screen.getByRole('option')
    expect(card).toBeInTheDocument()
  })

  it('reflects aria-selected=false when not selected', () => {
    render(<GameCard game={mockGame} isSelected={false} onSelect={vi.fn()} />)
    const card = screen.getByRole('option')
    expect(card).toHaveAttribute('aria-selected', 'false')
  })

  it('reflects aria-selected=true when selected', () => {
    render(<GameCard game={mockGame} isSelected={true} onSelect={vi.fn()} />)
    const card = screen.getByRole('option')
    expect(card).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn()
    render(<GameCard game={mockGame} isSelected={false} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('option'))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('does not call onSelect for a different card', () => {
    const onSelectA = vi.fn()
    const onSelectB = vi.fn()

    const { rerender } = render(
      <GameCard game={mockGame} isSelected={false} onSelect={onSelectA} />
    )
    // Re-render as a different game — ensure the right callback fires
    rerender(
      <GameCard
        game={{ ...mockGame, id: 'other-game', title: 'League of Legends' }}
        isSelected={false}
        onSelect={onSelectB}
      />
    )
    fireEvent.click(screen.getByRole('option'))
    expect(onSelectA).not.toHaveBeenCalled()
    expect(onSelectB).toHaveBeenCalledTimes(1)
  })
})
