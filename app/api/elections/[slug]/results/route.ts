import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getResults } from '@/lib/results'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const [election] = await sql`SELECT id FROM elections WHERE slug = ${slug}`
    if (!election) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const { results, total_votes } = await getResults(election.id)
    return NextResponse.json({ results, total_votes })
  } catch (err) {
    console.error('GET /api/elections/[slug]/results error:', err)
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}
