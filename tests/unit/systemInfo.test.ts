/**
 * UNIT TEST — transformAddonResult (pure transformation function)
 *
 * Learning note — why extract and test this function separately?
 *
 *   The full `getSystemInfo()` function has two untestable dependencies:
 *     1. Electron's `app` object (not available in a Node.js test context)
 *     2. The compiled `system_info.node` binary (platform-specific C++ code)
 *
 *   By extracting `transformAddonResult()` as a pure function, we isolate the
 *   logic we DO own — rounding, units, the 'source' tag — from the I/O we DON'T
 *   own (OS APIs, Electron runtime).
 *
 *   This is the "Humble Object" / "Pure Core, Impure Shell" pattern:
 *     - The pure core (transformAddonResult) is easy to test.
 *     - The impure shell (loadAddon, createRequire, app.getAppPath) is minimal
 *       glue code that doesn't need a unit test.
 *
 *   Analogy from game dev: test your damage formula (pure C++ math) independently
 *   from the physics collision that triggers it (engine-dependent).
 *
 * Run: npm run test:unit
 */

import { describe, it, expect } from 'vitest'
import { transformAddonResult } from '../../src/main/native/systemInfo'
import type { NativeAddonResult } from '../../src/main/native/systemInfo'

// Minimal valid raw result from the C++ addon
const makeRaw = (overrides: Partial<NativeAddonResult> = {}): NativeAddonResult => ({
  cpu: 0,
  memoryUsed: 0,
  memoryTotal: 0,
  uptime: 0,
  ...overrides
})

describe('transformAddonResult', () => {
  it('tags the result as native source', () => {
    const result = transformAddonResult(makeRaw())
    expect(result.source).toBe('native')
  })

  it('rounds cpu to 1 decimal place', () => {
    expect(transformAddonResult(makeRaw({ cpu: 33.333 })).cpu).toBe(33.3)
    expect(transformAddonResult(makeRaw({ cpu: 99.99  })).cpu).toBe(100)
    expect(transformAddonResult(makeRaw({ cpu: 0.0    })).cpu).toBe(0)
    expect(transformAddonResult(makeRaw({ cpu: 5.55   })).cpu).toBe(5.6)
  })

  it('rounds memoryUsed to 2 decimal places', () => {
    expect(transformAddonResult(makeRaw({ memoryUsed: 8.1234 })).memoryUsed).toBe(8.12)
    expect(transformAddonResult(makeRaw({ memoryUsed: 7.999  })).memoryUsed).toBe(8)
    expect(transformAddonResult(makeRaw({ memoryUsed: 0.005  })).memoryUsed).toBe(0.01)
  })

  it('rounds memoryTotal to 2 decimal places', () => {
    expect(transformAddonResult(makeRaw({ memoryTotal: 15.9876 })).memoryTotal).toBe(15.99)
    expect(transformAddonResult(makeRaw({ memoryTotal: 32.0    })).memoryTotal).toBe(32)
  })

  it('rounds uptime to 1 decimal place', () => {
    expect(transformAddonResult(makeRaw({ uptime: 14.333 })).uptime).toBe(14.3)
    expect(transformAddonResult(makeRaw({ uptime: 0.05   })).uptime).toBe(0.1)
  })

  it('preserves all four numeric fields', () => {
    const raw: NativeAddonResult = {
      cpu: 25.0,
      memoryUsed: 8.0,
      memoryTotal: 16.0,
      uptime: 12.0
    }
    const result = transformAddonResult(raw)
    expect(result.cpu).toBe(25)
    expect(result.memoryUsed).toBe(8)
    expect(result.memoryTotal).toBe(16)
    expect(result.uptime).toBe(12)
  })
})
