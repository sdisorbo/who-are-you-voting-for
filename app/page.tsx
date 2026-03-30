'use client'

import { useEffect, useState } from 'react'
import type { Election } from '@/lib/types'
import ElectionCard from '@/components/ElectionCard'
import VoteModal from '@/components/VoteModal'

const PILL_BADGES = [
  '🔒 Anonymous',
  '📍 Location-aware',
  '⚡ Real-time results',
]

export default function RacesPage() {
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<Election | null>(null)

  useEffect(() => {
    fetch('/api/elections')
      .then((r) => r.json())
      .then((d) => { setElections(d.elections ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 24px 48px' }}>
      {/* Hero */}
      <div style={{ marginBottom: '48px' }}>
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#f0f4ff',
            margin: '0 0 10px',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          Who Are You Voting For?
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#8899bb',
            margin: '0 0 20px',
            lineHeight: 1.6,
          }}
        >
          Cast your vote anonymously. See how the country leans — by state.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PILL_BADGES.map((badge) => (
            <span
              key={badge}
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#8899bb',
                background: 'rgba(30,45,82,0.6)',
                border: '1px solid #1e2d52',
                padding: '4px 10px',
                borderRadius: '20px',
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Section title */}
      <h2
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#8899bb',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}
      >
        Active Races
      </h2>

      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '140px',
                borderRadius: '12px',
                background: '#0d1530',
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      ) : elections.length === 0 ? (
        <p style={{ color: '#8899bb', fontSize: '14px' }}>
          No active races right now. Check back soon.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {elections.map((e) => (
            <ElectionCard key={e.id} election={e} onClick={() => setActive(e)} />
          ))}
        </div>
      )}

      {active && (
        <VoteModal
          election={active}
          apiBase="/api/elections"
          onClose={() => setActive(null)}
        />
      )}
    </div>
  )
}
