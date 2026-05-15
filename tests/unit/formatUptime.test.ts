/**
 * UNIT TEST — formatUptime (pure function)
 *
 * This is the simplest kind of unit test: a pure function with no dependencies.
 * Same input → same output every time. No mocks, no setup, instant feedback.
 *
 * Why test this first? It's the ideal introduction to Vitest's syntax.
 * Once you understand describe/it/expect here, the pattern scales to
 * more complex tests (mocked modules, async handlers, React components).
 *
 * Run: npm run test:unit
 */

import { describe, it, expect } from 'vitest'
import { formatUptime } from '../../src/renderer/src/utils/formatUptime'

describe('formatUptime', () => {
  it('shows only minutes when uptime is under an hour', () => {
    expect(formatUptime(0)).toBe('0m')
    expect(formatUptime(0.5)).toBe('30m')
    expect(formatUptime(0.99)).toBe('59m')
  })

  it('shows hours and minutes when uptime is 1–23 hours', () => {
    expect(formatUptime(1)).toBe('1h 0m')
    expect(formatUptime(2.5)).toBe('2h 30m')
    expect(formatUptime(23.9)).toBe('23h 54m')  // 0.9 * 60 = 54m
  })

  it('shows days, hours and minutes when uptime exceeds 24 hours', () => {
    expect(formatUptime(24)).toBe('1d 0h 0m')
    expect(formatUptime(25)).toBe('1d 1h 0m')
    expect(formatUptime(49.5)).toBe('2d 1h 30m')
  })

  it('handles fractional minutes correctly', () => {
    // 1.75 hours = 1h 45m
    expect(formatUptime(1.75)).toBe('1h 45m')
    // 0.25 hours = 15m
    expect(formatUptime(0.25)).toBe('15m')
  })
})
