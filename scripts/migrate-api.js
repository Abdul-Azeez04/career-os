/**
 * Migration runner using Supabase Management API
 * Run: node --env-file=.env.local scripts/migrate-api.js
 */

const fs = require('fs')
const path = require('path')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Missing env vars')
  process.exit(1)
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')

async function runSQL(sql) {
  // Use Supabase's direct database API via the project's postgres endpoint
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  })

  const text = await response.text()
  return { ok: response.ok, status: response.status, body: text }
}

async function runSQLDirect(sql) {
  // Try using the Supabase direct postgres endpoint
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_migration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({ sql_text: sql }),
  })
  const text = await response.text()
  return { ok: response.ok, status: response.status, body: text }
}

async function main() {
  console.log(`\n🚀  Running migrations for project: ${projectRef}\n`)

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    process.stdout.write(`   Running ${file}... `)
    
    const result = await runSQL(sql)
    if (result.ok) {
      console.log('✅')
    } else {
      // Try splitting into statements and running each
      console.log(`⚠️  (status ${result.status})`)
      console.log(`   Body: ${result.body.substring(0, 150)}`)
    }
  }

  console.log('\n✨  Done!\n')
}

main().catch(console.error)
