'use client'

import { useEffect, useState } from 'react'
import type { VoteResult } from '@/lib/types'

const PARTY_COLOR: Record<string, string> = {
  Democrat:    '#2563eb',
  Republican:  '#dc2626',
  Independent: '#7c3aed',
}

interface Props {
  results: VoteResult[]
  total_votes: number
}

export default function ResultsChart({ results, total_votes }: Props) {
  const [animate, setAnimate] = useState(false)
  const sorted = [...results].sort((a, b) => b.total_votes - a.total_votes)

  useEffect(() => {
    // Trigger animation on mount
    const t = setTimeout(() => setAnimate(true), 50)
    return () => clearTimeout(t)
  }, [])

  const headerStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#8899bb',
    fontWeight: 500,
    marginBottom: '16px',
  }

  return (
    <div>
      <p style={headerStyle}>
        {total_votes.toLocaleString()} total vote{total_votes !== 1 ? 's' : ''}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sorted.map((r) => {
          const partyColor = PARTY_COLOR[r.party] ?? '#8899bb'
          const pct = r.percentage ?? 0

          return (
            <div key={r.candidate_id}>
              {/* Label row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '14px',
                      color: '#f0f4ff',
                    }}
                  >
                    {r.candidate_name}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: partyColor,
                      background: `${partyColor}22`,
                      border: `1px solid ${partyColor}44`,
                      padding: '1px 6px',
                      borderRadius: '20px',
                    }}
                  >
                    {r.party}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#f0f4ff',
                    }}
                  >
                    {pct}%
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#8899bb',
                    }}
                  >
                    ({r.total_votes.toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div
                style={{
                  height: '10px',
                  background: '#1e2d52',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: '999px',
                    background: partyColor,
                    width: animate ? `${pct}%` : '0%',
                    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
