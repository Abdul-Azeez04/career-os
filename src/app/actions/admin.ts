"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function adminUpdateSiteConfig(updates: any) {
  if (!supabaseUrl) {
    return { error: "Missing NEXT_PUBLIC_SUPABASE_URL." }
  }
  
  const key = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!key) {
    return { error: "Missing Supabase keys in environment." }
  }
  
  const supabase = createClient(supabaseUrl, key)
  
  const { data, error } = await supabase
    .from('site_config')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', updates.id)
    .select()
    .single()
    
  if (error) {
    if (error.code === 'PGRST116') {
      return { error: "Security rules (RLS) blocked the save. Please go to Supabase -> Authentication -> Policies, and click 'Disable RLS' for the site_config table." }
    }
    return { error: error.message }
  }
  
  return { data }
}
