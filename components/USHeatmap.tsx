'use client'

import { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import type { VoteResult } from '@/lib/types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

// FIPS code → 2-letter state abbreviation
const FIPS_TO_STATE: Record<string, string> = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE',
  '11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA',
  '20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN',
  '28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM',
  '36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI',
  '45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA',
  '54':'WV','55':'WI','56':'WY',
}

const PARTY_COLOR: Record<string, string> = {
  Democrat:    '#1a6fc4',
  Republican:  '#c0392b',
  Independent: '#6c3483',
}

interface Props {
  results: VoteResult[]
}

export default function USHeatmap({ results }: Props) {
  const [tooltip, setTooltip] = useState<{ state: string; content: string; x: number; y: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Build per-state winner map
  const stateData: Record<string, { winner: string; party: string; breakdown: string }> = {}
  const allStates = new Set<string>()
  results.forEach((r) => r.by_state.forEach((s) => allStates.add(s.state)))

  allStates.forEach((state) => {
    let maxCount = -1
    let winner = ''
    let party = ''
    const breakdown = results
      .map((r) => {
        const s = r.by_state.find((b) => b.state === state)
        const count = s?.count ?? 0
        if (count > maxCount) { maxCount = count; winner = r.candidate_name; party = r.party }
        return `${r.candidate_name}: ${count}`
      })
      .join(' · ')
    stateData[state] = { winner, party, breakdown }
  })

  if (!mounted) return (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
  )

  return (
    <div className="relative w-full">
      <ComposableMap projection="geoAlbersUsa" className="w-full h-auto">
        <ZoomableGroup zoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const fips = geo.id?.toString().padStart(2, '0') ?? ''
                const stateCode = FIPS_TO_STATE[fips]
                const data = stateCode ? stateData[stateCode] : undefined
                const fill = data ? (PARTY_COLOR[data.party] ?? '#9ca3af') : '#d1d5db'

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      default: { opacity: data ? 0.85 : 0.4, outline: 'none' },
                      hover:   { opacity: 1, outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e: React.MouseEvent) => {
                      if (!stateCode) return
                      const content = data
                        ? `${stateCode}: ${data.breakdown}`
                        : `${stateCode}: No votes yet`
                      setTooltip({ state: stateCode, content, x: e.clientX, y: e.clientY })
                    }}
                    onMouseMove={(e: React.MouseEvent) => {
                      setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2 justify-center text-xs text-gray-500 dark:text-gray-400">
        {Object.entries(PARTY_COLOR).map(([party, color]) => (
          <span key={party} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color }} />
            {party}
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block bg-gray-300" />
          No data
        </span>
      </div>
    </div>
  )
}
