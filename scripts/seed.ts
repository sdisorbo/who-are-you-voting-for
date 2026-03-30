import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL_UNPOOLED (or DATABASE_URL) must be set in .env.local')
  process.exit(1)
}

const sql = neon(url)

async function main() {
  console.log('Creating tables...')

  await sql`
    CREATE TABLE IF NOT EXISTS elections (
      id         SERIAL PRIMARY KEY,
      slug       TEXT UNIQUE NOT NULL,
      title      TEXT NOT NULL,
      type       TEXT NOT NULL CHECK (type IN ('current', 'hypothetical')),
      status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'closed')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS candidates (
      id          SERIAL PRIMARY KEY,
      election_id INT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
      name        TEXT NOT NULL,
      party       TEXT NOT NULL,
      photo_url   TEXT
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id           SERIAL PRIMARY KEY,
      election_id  INT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
      candidate_id INT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
      state        CHAR(2) NOT NULL DEFAULT 'XX',
      count        INT NOT NULL DEFAULT 0,
      UNIQUE (election_id, candidate_id, state)
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS ip_votes (
      id          SERIAL PRIMARY KEY,
      ip_hash     TEXT NOT NULL,
      election_id INT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
      voted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (ip_hash, election_id)
    )
  `

  console.log('Tables created.')
  console.log('Seeding elections...')

  // ── Current races ──────────────────────────────────────────────────────────
  const [vaGov] = await sql`
    INSERT INTO elections (slug, title, type, status)
    VALUES ('2026-governor-va', '2026 Virginia Governor Race', 'current', 'active')
    ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    RETURNING id
  `
  await sql`
    INSERT INTO candidates (election_id, name, party, photo_url) VALUES
      (${vaGov.id}, 'Democratic Candidate', 'Democrat',    NULL),
      (${vaGov.id}, 'Republican Candidate', 'Republican',  NULL)
    ON CONFLICT DO NOTHING
  `

  const [njGov] = await sql`
    INSERT INTO elections (slug, title, type, status)
    VALUES ('2026-governor-nj', '2026 New Jersey Governor Race', 'current', 'active')
    ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    RETURNING id
  `
  await sql`
    INSERT INTO candidates (election_id, name, party, photo_url) VALUES
      (${njGov.id}, 'Democratic Candidate', 'Democrat',   NULL),
      (${njGov.id}, 'Republican Candidate', 'Republican', NULL)
    ON CONFLICT DO NOTHING
  `

  const [paSen] = await sql`
    INSERT INTO elections (slug, title, type, status)
    VALUES ('2026-senate-pa', '2026 U.S. Senate — Pennsylvania', 'current', 'active')
    ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    RETURNING id
  `
  await sql`
    INSERT INTO candidates (election_id, name, party, photo_url) VALUES
      (${paSen.id}, 'Democratic Candidate', 'Democrat',   NULL),
      (${paSen.id}, 'Republican Candidate', 'Republican', NULL)
    ON CONFLICT DO NOTHING
  `

  // ── Hypothetical ───────────────────────────────────────────────────────────
  const [pres28] = await sql`
    INSERT INTO elections (slug, title, type, status)
    VALUES ('2028-president-vance-newsom', '2028 Presidential: Vance vs. Newsom', 'hypothetical', 'active')
    ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    RETURNING id
  `
  await sql`
    INSERT INTO candidates (election_id, name, party, photo_url) VALUES
      (${pres28.id}, 'JD Vance',      'Republican', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/JD_Vance_official_photo.jpg/440px-JD_Vance_official_photo.jpg'),
      (${pres28.id}, 'Gavin Newsom',  'Democrat',   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Gavin_Newsom_signing.jpg/440px-Gavin_Newsom_signing.jpg')
    ON CONFLICT DO NOTHING
  `

  console.log('✅ Seed complete!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
