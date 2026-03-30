import { sql } from './db'
import type { VoteResult } from './types'

export async function getResults(electionId: number): Promise<{ results: VoteResult[]; total_votes: number }> {
  const rows = await sql`
    SELECT
      c.id          AS candidate_id,
      c.name        AS candidate_name,
      c.party,
      c.photo_url,
      v.state,
      COALESCE(v.count, 0) AS count
    FROM candidates c
    LEFT JOIN votes v ON v.candidate_id = c.id AND v.election_id = ${electionId}
    WHERE c.election_id = ${electionId}
    ORDER BY c.id, v.state
  `

  const map = new Map<number, VoteResult>()
  let grandTotal = 0

  for (const row of rows) {
    if (!map.has(row.candidate_id)) {
      map.set(row.candidate_id, {
        candidate_id: row.candidate_id,
        candidate_name: row.candidate_name,
        party: row.party,
        photo_url: row.photo_url,
        total_votes: 0,
        percentage: 0,
        by_state: [],
      })
    }
    const entry = map.get(row.candidate_id)!
    const count = Number(row.count)
    if (count > 0) {
      entry.total_votes += count
      grandTotal += count
      entry.by_state.push({ state: row.state, count })
    }
  }

  const results = Array.from(map.values()).map((r) => ({
    ...r,
    percentage: grandTotal > 0 ? Math.round((r.total_votes / grandTotal) * 1000) / 10 : 0,
  }))

  return { results, total_votes: grandTotal }
}
