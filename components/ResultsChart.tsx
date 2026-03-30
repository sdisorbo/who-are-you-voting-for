'use client'

import type { VoteResult } from '@/lib/types'

const PARTY_BAR: Record<string, string> = {
  Democrat:    'bg-blue-500',
  Republican:  'bg-red-500',
  Independent: 'bg-purple-500',
}

interface Props {
  results: VoteResult[]
  total_votes: number
}

export default function ResultsChart({ results, total_votes }: Props) {
  const sorted = [...results].sort((a, b) => b.total_votes - a.total_votes)

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {total_votes.toLocaleString()} total vote{total_votes !== 1 ? 's' : ''}
      </p>
      {sorted.map((r) => (
        <div key={r.candidate_id}>
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-medium text-sm text-gray-900 dark:text-white">
              {r.candidate_name}
              <span className="ml-2 text-xs text-gray-400">{r.party}</span>
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {r.percentage}%
              <span className="ml-1 text-xs font-normal text-gray-400">({r.total_votes.toLocaleString()})</span>
            </span>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${PARTY_BAR[r.party] ?? 'bg-gray-400'}`}
              style={{ width: `${r.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
