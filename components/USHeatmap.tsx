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
  Democrat:    '#1a4fa0',
  Republican:  '#9b1c1c',
  Independent: '#4c1d95',
}

const LEGEND_ENTRIES = [
  { party: 'Democrat',    color: '#1a4fa0' },
  { party: 'Republican',  color: '#9b1c1c' },
  { party: 'Independent', color: '#4c1d95' },
  { party: 'No data',     color: '#1e2d52' },
]

interface Props {
  results: VoteResult[]
}

export default function USHeatmap({ results }: Props) {
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null)
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

  if (!mounted) {
    return (
      <div
        style={{
          width: '100%',
          height: '240px',
          background: '#0d1530',
          borderRadius: '12px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <ComposableMap
        projection="geoAlbersUsa"
        style={{ width: '100%', height: 'auto', background: 'transparent' }}
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const fips = geo.id?.toString().padStart(2, '0') ?? ''
                const stateCode = FIPS_TO_STATE[fips]
                const data = stateCode ? stateData[stateCode] : undefined
                const fill = data ? (PARTY_COLOR[data.party] ?? '#2e4070') : '#1e2d52'

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      default: { opacity: data ? 0.9 : 0.6, outline: 'none' },
                      hover:   { opacity: 1, outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e: React.MouseEvent) => {
                      if (!stateCode) return
                      const content = data
                        ? `${stateCode}: ${data.breakdown}`
                        : `${stateCode}: No votes yet`
                      setTooltip({ content, x: e.clientX, y: e.clientY })
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
          style={{
            position: 'fixed',
            zIndex: 9999,
            pointerEvents: 'none',
            background: '#0d1530',
            color: '#f0f4ff',
            border: '1px solid #1e2d52',
            fontSize: '12px',
            padding: '6px 10px',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            maxWidth: '260px',
            left: tooltip.x + 12,
            top: tooltip.y - 8,
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '10px',
          justifyContent: 'center',
        }}
      >
        {LEGEND_ENTRIES.map(({ party, color }) => (
          <span
            key={party}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              color: '#8899bb',
            }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: color,
                display: 'inline-block',
              }}
            />
            {party}
          </span>
        ))}
      </div>
    </div>
  )
}
