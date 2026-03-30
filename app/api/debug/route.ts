import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sql = getDb()
    const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM elections`
    const elections = await sql`SELECT id, slug, title, type, status FROM elections ORDER BY id`
    return NextResponse.json({ ok: true, election_count: count, elections })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
