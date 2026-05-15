/**
 * NATIVE ADDON WRAPPER — systemInfo.ts
 *
 * Phase 3: TypeScript wrapper around the compiled system_info.node binary.
 *
 * Self-Note:
 *   This is like a thin C++ wrapper class that hides a platform DLL (system_info.node)
 *   behind a clean interface - same pattern as a game engine plugin.
 */

import { createRequire } from 'module'
import { app } from 'electron'
import path from 'path'
import type { SystemInfo } from '../../shared/types'

// createRequire() is the ESM-compatible way to call require().
// analogous to how a game engine plugin would expose a function to the scripting layer.
const _require = createRequire(import.meta.url)

// Raw shape returned by the C++ addon (matches what system_info.cpp sets on the result object)
export interface NativeAddonResult {
  cpu: number
  memoryUsed: number
  memoryTotal: number
  uptime: number
}

/**
 * transformAddonResult — pure function, exported for unit testing.
 *
 * Converts raw C++ addon output into the typed SystemInfo the renderer expects:
 *   - Rounds cpu to 1 decimal place (cosmetic — no need for 4 sig figs)
 *   - Rounds memory to 2 decimal places (GB, so 2dp ≈ 10 MB precision)
 *   - Rounds uptime to 1 decimal place
 *   - Tags the result as 'native' source
 *
 * Extracting this as a pure function means we can unit test the rounding and
 * transformation logic without needing to mock Electron or the compiled addon.
 */
export function transformAddonResult(raw: NativeAddonResult): SystemInfo {
  return {
    cpu:         Math.round(raw.cpu         * 10)  / 10,
    memoryUsed:  Math.round(raw.memoryUsed  * 100) / 100,
    memoryTotal: Math.round(raw.memoryTotal * 100) / 100,
    uptime:      Math.round(raw.uptime      * 10)  / 10,
    source: 'native'
  }
}

interface NativeAddon {
  getSystemInfo(): NativeAddonResult
}

let addon: NativeAddon | null = null
let addonLoadError: string | null = null

function loadAddon(): NativeAddon | null {
  if (addon) return addon
  if (addonLoadError) return null

  // app path for dev and resources path for production
  const addonPath = app.isPackaged
    ? path.join(process.resourcesPath, 'build', 'Release', 'system_info.node')
    : path.join(app.getAppPath(), 'build', 'Release', 'system_info.node')

  // just like unreal engine plugin would load a dll and return a function pointer to the function you want to call in the plugin.
  try {
    addon = _require(addonPath) as NativeAddon
    console.log('[system-info] Native addon loaded from:', addonPath)
    return addon
  } catch (err) {
    addonLoadError = String(err)
    console.warn(
      '[system-info] Native addon failed to load — falling back to mock data.\n' +
      '  Path attempted:', addonPath, '\n' +
      '  Error:', addonLoadError, '\n' +
      '  Run: npm run rebuild'
    )
    return null
  }
}

/**
 * getSystemInfo()
 *
 * Returns live system metrics from the C++ addon.
 * Falls back to mock data if the addon can't load.
 */
export function getSystemInfo(): SystemInfo {
  const native = loadAddon()
  if(!native) 
    return { cpu: 0, memoryUsed: 0, memoryTotal: 0, uptime: 0, source: 'mock' } // null check and returning mock for safety

  // try and catch might be too much but could be useful for debugging and catching errors
  try {
    return transformAddonResult(native.getSystemInfo())
  } catch (err) {
    console.error('[system-info] getSystemInfo() threw:', err)
    return { cpu: 0, memoryUsed: 0, memoryTotal: 0, uptime: 0, source: 'mock' }
  }
}
