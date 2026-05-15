/**
 * formatUptime — pure utility function
 *
 * Converts a decimal hours value to a human-readable string.
 * Extracted from SystemMonitorView so it can be unit-tested independently.
 *
 * Examples:
 *   formatUptime(0.5)   → "30m"
 *   formatUptime(2.75)  → "2h 45m"
 *   formatUptime(25.0)  → "1d 1h 0m"
 *
 * "Pure function" in the React/testing sense: same input always gives same output,
 * no side effects, no I/O — trivial to unit test with any framework.
 */
export function formatUptime(hours: number): string {
  const d = Math.floor(hours / 24)
  const h = Math.floor(hours % 24)
  const m = Math.floor((hours * 60) % 60)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}
