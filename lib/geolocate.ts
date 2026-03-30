import geoip from 'geoip-lite'

export function getStateFromIp(ip: string): string {
  try {
    const geo = geoip.lookup(ip)
    if (geo && geo.country === 'US' && geo.region) {
      return geo.region // 2-letter state code e.g. "PA"
    }
  } catch {
    // ignore lookup errors
  }
  return 'XX' // unknown
}
