'use client'

import { useState } from 'react'
import type { Election, VoteResult } from '@/lib/types'
import CandidateCard from './CandidateCard'
import ResultsChart from './ResultsChart'
import USHeatmap from './USHeatmap'

interface Props {
  election: Election
  apiBase: string   // e.g. '/api/elections' or '/api/hypothetical'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{election.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {!results ? (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Select a candidate to see the results</p>

              <div className={`grid gap-4 ${election.candidates.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {election.candidates.map((c) => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    selected={selected === c.id}
                    onSelect={() => setSelected(c.id)}
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!selected || submitting}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Cast Vote & See Results'}
              </button>
            </>
          ) : (
            <>
              {alreadyVoted && (
                <div className="flex items-center gap-2 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                  <span>⚠️</span>
                  <span>You already voted in this election. Showing current results.</span>
                </div>
              )}

              <ResultsChart results={results} total_votes={totalVotes} />

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Results by State</p>
                <USHeatmap results={results} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
