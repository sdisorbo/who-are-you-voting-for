import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashIp, getClientIp } from '@/lib/ipHash'
import { getStateFromRequest } from '@/lib/geolocate'
import { getResults } from '@/lib/results'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { candidateId } = await req.json()
    if (!candidateId) return NextResponse.json({ error: 'candidateId required' }, { status: 400 })

    const [election] = await sql`SELECT id FROM elections WHERE slug = ${slug} AND type = 'hypothetical'`
    if (!election) return NextResponse.json({ error: 'Election not found' }, { status: 404 })

    const electionId = election.id
    const ip = getClientIp(req)
    const ipHash = hashIp(ip)

    const [existing] = await sql`
      SELECT id FROM ip_votes WHERE ip_hash = ${ipHash} AND election_id = ${electionId}
    `
    if (existing) {
      const { results, total_votes } = await getResults(electionId)
      return NextResponse.json({ alreadyVoted: true, results, total_votes })
    }

    const [candidate] = await sql`
      SELECT id FROM candidates WHERE id = ${candidateId} AND election_id = ${electionId}
    `
    if (!candidate) return NextResponse.json({ error: 'Invalid candidate' }, { status: 400 })

    const state = getStateFromRequest(req)

    await sql`
      INSERT INTO votes (election_id, candidate_id, state, count)
      VALUES (${electionId}, ${candidateId}, ${state}, 1)
      ON CONFLICT (election_id, candidate_id, state)
      DO UPDATE SET count = votes.count + 1
    `
    await sql`
      INSERT INTO ip_votes (ip_hash, election_id) VALUES (${ipHash}, ${electionId})
    `

    const { results, total_votes } = await getResults(electionId)
    return NextResponse.json({ success: true, results, total_votes })
  } catch (err) {
    console.error('POST /api/hypothetical/[slug]/vote error:', err)
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}
