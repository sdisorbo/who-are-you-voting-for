/**
 * Extract the US state from a request using Vercel's built-in geo headers.
 * Vercel automatically injects these on every request — no library needed.
 *
 * Header reference:
 *   x-vercel-ip-country         → "US"
 *   x-vercel-ip-country-region  → state code e.g. "PA"
 *
 * Falls back to "XX" locally (where headers aren't present).
 */
export function getStateFromRequest(request: Request): string {
  const country = request.headers.get('x-vercel-ip-country')
  const region  = request.headers.get('x-vercel-ip-country-region')

  if (country === 'US' && region && region.length === 2) {
    return region.toUpperCase()
  }
  return 'XX'
}
