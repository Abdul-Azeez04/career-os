import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function makeAdmin() {
  console.log('Fetching users...')
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
  
  if (usersError) {
    console.error('Failed to list users:', usersError)
    process.exit(1)
  }

  if (users.length === 0) {
    console.log('No users found in auth.users. Please sign up first.')
    process.exit(0)
  }

  console.log(`Found ${users.length} users. Making them admins...`)

  for (const user of users) {
    const { error } = await supabase.from('admin_users').upsert({ id: user.id, role: 'owner' })
    if (error) {
      console.error(`Failed to make ${user.email} admin:`, error)
    } else {
      console.log(`Successfully made ${user.email} an admin!`)
    }
  }
}

makeAdmin().catch(console.error)
