import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function check() {
  const { data: users } = await supabase.auth.admin.listUsers()
  console.log('Auth Users:')
  users.users.forEach(u => console.log(u.id, u.email))

  const { data: adminUsers } = await supabase.from('admin_users').select('*')
  console.log('\nAdmin Users Table:')
  console.log(adminUsers)
}

check().catch(console.error)
