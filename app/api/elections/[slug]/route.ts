import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const [election] = await sql`
      SELECT e.id, e.slug, e.title, e.type, e.status, e.created_at,
        json_agg(json_build_object(
          'id', c.id,
          'name', c.name,
          'party', c.party,
          'photo_url', c.photo_url
        ) ORDER BY c.id) AS candidates
      FROM elections e
      JOIN candidates c ON c.election_id = e.id
      WHERE e.slug = ${slug}
      GROUP BY e.id
    `
    if (!election) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ election })
  } catch (err) {
    console.error('GET /api/elections/[slug] error:', err)
    return NextResponse.json({ error: 'Failed to fetch election' }, { status: 500 })
  }
}
