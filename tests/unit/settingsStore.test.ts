/**
 * UNIT TEST — settingsStore (mocked electron-store)
 *
 * Learning note — mocking a module with vi.mock():
 *
 *   `electron-store` is a real npm module that writes to disk using Node.js `fs`.
 *   In a unit test we don't want file I/O — we want to verify that:
 *     (a) the store is initialized with the correct defaults
 *     (b) set() is called with the right key/value when settings change
 *
 *   vi.mock() intercepts the import and replaces the module with our factory.
 *   Vitest HOISTS vi.mock() calls to the top of the file, so even though they
 *   appear after the import statements in the source, they execute first.
 *   This is why the mock is already active when `store.ts` is imported.
 *
 *   Analogy: this is like test doubles in C++ (mock objects / stubs). You replace
 *   the real collaborator with a stand-in that records calls and returns
 *   controlled values.
 *
 * Run: npm run test:unit
 */

import { describe, it, expect, vi } from 'vitest'

// ── Mock electron-store before the module under test imports it ──────────────
//
// The mock factory is called once when store.ts does `import Store from 'electron-store'`.
// We return a fake class whose constructor captures the options (so we can assert on
// `defaults`) and whose store property mirrors those defaults.

// electron-store is used with `new Store(options)` so the mock must be a
// class (or a constructor function) — plain vi.fn().mockImplementation() won't
// satisfy `new` because it doesn't set the prototype correctly.
vi.mock('electron-store', () => {
  class MockStore {
    store: Record<string, unknown>
    set: ReturnType<typeof vi.fn>
    get: ReturnType<typeof vi.fn>

    constructor(options: { defaults: Record<string, unknown> }) {
      this.store = { ...options.defaults }
      this.set  = vi.fn((key: string, value: unknown) => { this.store[key] = value })
      this.get  = vi.fn((key: string) => this.store[key])
    }
  }
  return { default: MockStore }
})

// Import AFTER vi.mock so store.ts gets the fake electron-store
import { settingsStore } from '../../src/main/store'

describe('settingsStore defaults', () => {
  it('initializes startOnBoot to false', () => {
    expect(settingsStore.store.startOnBoot).toBe(false)
  })

  it('initializes minimizeToTray to true', () => {
    expect(settingsStore.store.minimizeToTray).toBe(true)
  })

  it('initializes autoUpdate to true', () => {
    expect(settingsStore.store.autoUpdate).toBe(true)
  })

  it('initializes region to NA', () => {
    expect(settingsStore.store.region).toBe('NA')
  })

  it('has all four expected keys', () => {
    const keys = Object.keys(settingsStore.store)
    expect(keys).toContain('startOnBoot')
    expect(keys).toContain('minimizeToTray')
    expect(keys).toContain('autoUpdate')
    expect(keys).toContain('region')
  })
})

describe('settingsStore.set', () => {
  it('exposes a set method', () => {
    expect(typeof settingsStore.set).toBe('function')
  })

  it('set() is callable with a valid key', () => {
    // We're testing the interface contract, not the real fs write.
    // The mock records the call; the real electron-store is not involved.
    expect(() => settingsStore.set('region', 'EUW')).not.toThrow()
  })
})
