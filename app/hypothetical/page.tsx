'use client'

import { useEffect, useState } from 'react'
import type { Election } from '@/lib/types'
import ElectionCard from '@/components/ElectionCard'
import VoteModal from '@/components/VoteModal'

export default function HypotheticalPage() {
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<Election | null>(null)

  useEffect(() => {
    fetch('/api/hypothetical')
      .then((r) => r.json())
      .then((d) => { setElections(d.elections ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Hypothetical Matchups</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Who <em>would</em> you vote for? These races aren&apos;t on the ballot — yet.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1,2].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : elections.length === 0 ? (
        <p className="text-gray-400 text-sm">No hypothetical matchups yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {elections.map((e) => (
            <ElectionCard key={e.id} election={e} onClick={() => setActive(e)} />
          ))}
        </div>
      )}

      {active && (
        <VoteModal
          election={active}
          apiBase="/api/hypothetical"
          onClose={() => setActive(null)}
        />
      )}
    </>
  )
}
