/**
 * FUNCTIONAL TEST SETUP — Phase 4
 *
 * This file runs once before any test in the suite (configured in vitest.config.ts
 * as `setupFiles`). It extends Vitest's expect matchers with @testing-library/jest-dom
 * so you can write assertions like:
 *
 *   expect(element).toBeInTheDocument()
 *   expect(element).toHaveTextContent('Play')
 *   expect(button).toBeDisabled()
 *
 * Without this setup, you'd be limited to plain DOM assertions like:
 *   expect(element).not.toBeNull()  ← less readable, less informative on failure
 *
 * The jest-dom matchers are named after Jest convention but work identically
 * in Vitest — the two test runners share the same matcher extension protocol.
 */

import '@testing-library/jest-dom'
