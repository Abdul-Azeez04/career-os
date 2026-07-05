/**
 * Migration runner — pushes all SQL files to Supabase via the REST API.
 * Run: node --env-file=.env.local scripts/migrate.js
 */

const fs = require('fs')
const path = require('path')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')

async function runSQL(sql, label) {
  const url = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`
  
  // Try using the pg endpoint
  const pgUrl = `${SUPABASE_URL}/pg/query`
  
  try {
    const response = await fetch(pgUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ query: sql }),
    })
    
    if (response.ok) {
      console.log(`✅  ${label}`)
      return true
    }
    
    const text = await response.text()
    
    // Try alternative endpoint
    const altResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'resolution=merge-duplicates',
      },
    })
    
    console.log(`⚠️   ${label} — endpoint returned ${response.status}: ${text.substring(0, 200)}`)
    return false
  } catch (err) {
    console.error(`❌  ${label}: ${err.message}`)
    return false
  }
}

async function main() {
  console.log(`\n🚀  Running migrations against ${SUPABASE_URL}\n`)
  
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  let passed = 0
  let failed = 0
  
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    const ok = await runSQL(sql, file)
    if (ok) passed++; else failed++
  }
  
  console.log(`\n📊  Results: ${passed} passed, ${failed} failed`)
  
  if (failed > 0) {
    console.log('\n💡  If migration failed, paste the SQL files into:')
    console.log(`    ${SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', '')}/sql`)
    console.log('\n    Files to run (in order):')
    files.forEach(f => console.log(`    - supabase/migrations/${f}`))
  }
}

main()
