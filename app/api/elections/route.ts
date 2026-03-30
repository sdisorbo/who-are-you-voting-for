import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const elections = await sql`
      SELECT e.id, e.slug, e.title, e.type, e.status, e.created_at,
        json_agg(json_build_object(
          'id', c.id,
          'name', c.name,
          'party', c.party,
          'photo_url', c.photo_url
        ) ORDER BY c.id) AS candidates
      FROM elections e
      JOIN candidates c ON c.election_id = e.id
      WHERE e.type = 'current'
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `
    return NextResponse.json({ elections })
  } catch (err) {
    console.error('GET /api/elections error:', err)
    return NextResponse.json({ error: 'Failed to fetch elections' }, { status: 500 })
  }
}
