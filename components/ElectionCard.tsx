'use client'

import type { Election } from '@/lib/types'

const STATUS_BADGE: Record<string, string> = {
  active:   'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  upcoming: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  closed:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const PARTY_DOT: Record<string, string> = {
  Democrat:    'bg-blue-500',
  Republican:  'bg-red-500',
  Independent: 'bg-purple-500',
}

interface Props {
  election: Election
  onClick: () => void
}

export default function ElectionCard({ election, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-snug">
          {election.title}
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[election.status]}`}>
          {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {election.candidates.map((c) => (
          <span key={c.id} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className={`w-2 h-2 rounded-full ${PARTY_DOT[c.party] ?? 'bg-gray-400'}`} />
            {c.name}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
        Vote &amp; see results →
      </p>
    </button>
  )
}
