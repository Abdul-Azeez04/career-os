// @ts-nocheck
import { createAdminClient } from '../src/lib/supabase/admin'
import * as fs from 'fs'
import * as path from 'path'

async function seed() {
  console.log('Starting seed process...')
  
  const ownerDataPath = path.join(__dirname, 'owner.json')
  if (!fs.existsSync(ownerDataPath)) {
    console.error('owner.json not found in scripts directory.')
    process.exit(1)
  }

  const data = JSON.parse(fs.readFileSync(ownerDataPath, 'utf8'))
  const supabase = createAdminClient()

  console.log('Upserting site_config...')
  // We just clear and insert to ensure 1 row
  await supabase.from('site_config').delete().neq('id', '00000000-0000-0000-0000-000000000000') // delete all
  const { error: siteError } = await supabase.from('site_config').insert(data.site_config)
  if (siteError) console.error('Error inserting site_config:', siteError)

  const tables = ['experience', 'certifications', 'skills', 'projects', 'writing', 'testimonials']
  
  for (const table of tables) {
    if (data[table] && Array.isArray(data[table])) {
      console.log(`Upserting ${table}...`)
      await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (data[table as keyof typeof data].length > 0) {
        const { error } = await supabase.from(table).insert(data[table as keyof typeof data] as any)
        if (error) console.error(`Error inserting ${table}:`, error)
      }
    }
  }

  console.log('Seed completed successfully.')
}

seed().catch(console.error)
