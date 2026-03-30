'use client'

import { useState } from 'react'
import type { Election, VoteResult } from '@/lib/types'
import CandidateCard from './CandidateCard'
import ResultsChart from './ResultsChart'
import USHeatmap from './USHeatmap'

interface Props {
  election: Election
  apiBase: string
  onClose: () => void
}

export default function VoteModal({ election, apiBase, onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<VoteResult[] | null>(null)
  const [totalVotes, setTotalVotes] = useState(0)
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!selected || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/${election.slug}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: selected }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Vote failed')
      setResults(data.results)
      setTotalVotes(data.total_votes)
      setAlreadyVoted(!!data.alreadyVoted)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  }

  const modalStyle: React.CSSProperties = {
    background: '#090f24',
    border: '1px solid #1e2d52',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '640px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #1e2d52',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f4ff',
    margin: 0,
  }

  const closeStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#8899bb',
    fontSize: '22px',
    lineHeight: 1,
    padding: '0 4px',
  }

  const bodyStyle: React.CSSProperties = {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#8899bb',
    textAlign: 'center',
    margin: 0,
  }

  const candidateGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: election.candidates.length === 2 ? '1fr 1fr' : '1fr',
    gap: '12px',
  }

  const submitStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    cursor: selected && !submitting ? 'pointer' : 'not-allowed',
    fontWeight: 700,
    fontSize: '14px',
    color: '#ffffff',
    background: selected
      ? 'linear-gradient(90deg, #2563eb 0%, #dc2626 100%)'
      : '#1e2d52',
    opacity: selected && !submitting ? 1 : 0.5,
    transition: 'opacity 0.15s, background 0.15s',
  }

  const alreadyVotedStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(234,179,8,0.1)',
    border: '1px solid rgba(234,179,8,0.3)',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#fbbf24',
  }

  const errorStyle: React.CSSProperties = {
    color: '#f87171',
    fontSize: '13px',
    textAlign: 'center',
  }

  const heatmapLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#8899bb',
    marginBottom: '8px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  }

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>{election.title}</h2>
          <button style={closeStyle} onClick={onClose}>&times;</button>
        </div>

        <div style={bodyStyle}>
          {!results ? (
            <>
              <p style={subtitleStyle}>Select a candidate to reveal the results</p>

              <div style={candidateGridStyle}>
                {election.candidates.map((c) => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    selected={selected === c.id}
                    onSelect={() => setSelected(c.id)}
                  />
                ))}
              </div>

              {error && <p style={errorStyle}>{error}</p>}

              <button
                style={submitStyle}
                onClick={handleSubmit}
                disabled={!selected || submitting}
              >
                {submitting ? 'Submitting…' : 'Cast Vote & See Results'}
              </button>
            </>
          ) : (
            <>
              {alreadyVoted && (
                <div style={alreadyVotedStyle}>
                  <span>⚠️</span>
                  <span>You already voted — showing current results</span>
                </div>
              )}

              <ResultsChart results={results} total_votes={totalVotes} />

              <div>
                <p style={heatmapLabelStyle}>Results by State</p>
                <USHeatmap results={results} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
