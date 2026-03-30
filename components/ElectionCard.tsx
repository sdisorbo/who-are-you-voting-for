'use client'

import { useState } from 'react'
import type { Election } from '@/lib/types'

const PARTY_COLOR: Record<string, string> = {
  Democrat:    '#2563eb',
  Republican:  '#dc2626',
  Independent: '#7c3aed',
}

const PARTY_BG: Record<string, string> = {
  Democrat:    'rgba(37,99,235,0.15)',
  Republican:  'rgba(220,38,38,0.15)',
  Independent: 'rgba(124,58,237,0.15)',
}

function getAccentColor(election: Election): string {
  const firstParty = election.candidates[0]?.party
  return PARTY_COLOR[firstParty] ?? '#1e2d52'
}

interface Props {
  election: Election
  onClick: () => void
}

export default function ElectionCard({ election, onClick }: Props) {
  const [hovered, setHovered] = useState(false)
  const accent = getAccentColor(election)

  const cardStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    background: '#090f24',
    border: `1px solid ${hovered ? accent : '#1e2d52'}`,
    borderLeft: `4px solid ${accent}`,
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.4)` : 'none',
    display: 'block',
  }

  const statusInfo = (() => {
    switch (election.status) {
      case 'active':
        return {
          dot: '#22c55e',
          label: 'LIVE',
          color: '#22c55e',
          bg: 'rgba(34,197,94,0.1)',
        }
      case 'upcoming':
        return {
          dot: '#eab308',
          label: 'UPCOMING',
          color: '#eab308',
          bg: 'rgba(234,179,8,0.1)',
        }
      default:
        return {
          dot: '#6b7280',
          label: 'CLOSED',
          color: '#6b7280',
          bg: 'rgba(107,114,128,0.1)',
        }
    }
  })()

  return (
    <button
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Status badge */}
      <div style={{ marginBottom: '10px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: statusInfo.color,
            background: statusInfo.bg,
            padding: '3px 8px',
            borderRadius: '4px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: statusInfo.dot,
              display: 'inline-block',
            }}
          />
          {statusInfo.label}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#f0f4ff',
          marginBottom: '12px',
          lineHeight: 1.3,
        }}
      >
        {election.title}
      </h3>

      {/* Candidates */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {election.candidates.map((c) => {
          const pColor = PARTY_COLOR[c.party] ?? '#8899bb'
          const pBg = PARTY_BG[c.party] ?? 'rgba(136,153,187,0.15)'
          return (
            <span
              key={c.id}
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: pColor,
                background: pBg,
                padding: '3px 8px',
                borderRadius: '20px',
                border: `1px solid ${pColor}33`,
              }}
            >
              {c.name}
            </span>
          )
        })}
      </div>

      {/* CTA */}
      <p
        style={{
          fontSize: '12px',
          color: '#8899bb',
          fontWeight: 500,
        }}
      >
        Vote &amp; See Results →
      </p>
    </button>
  )
}
