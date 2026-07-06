"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function adminUpdateSiteConfig(updates: any) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return { error: "Missing SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables." }
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Update without needing RLS because we use the Service Role Key
  const { data, error } = await supabase
    .from('site_config')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', updates.id)
    .select()
    .single()
    
  if (error) {
    return { error: error.message }
  }
  
  return { data }
}
