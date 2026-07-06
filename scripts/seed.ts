import { createClient } from '@supabase/supabase-js'
import {
  mockSiteConfig,
  mockExperiences,
  mockCertifications,
  mockSkills,
  mockProjects,
  mockWritings,
  mockTestimonials,
  mockBlogPosts,
  mockBlogTags
} from '../src/lib/data/mock-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('Seeding Supabase with mock data...')

  // 1. Site Config
  console.log('Seeding site_config...')
  const { data: existingConfig } = await supabase.from('site_config').select('id').limit(1).single()
  if (existingConfig) {
    await supabase.from('site_config').update({ ...mockSiteConfig, id: existingConfig.id }).eq('id', existingConfig.id)
  } else {
    await supabase.from('site_config').insert(mockSiteConfig)
  }

  // 2. Clear existing dynamic tables
  console.log('Clearing existing data...')
  await supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('certifications').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('writing').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('blog_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('blog_tags').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // 3. Insert mock data
  console.log('Inserting experiences...')
  await supabase.from('experience').insert(mockExperiences)

  console.log('Inserting certifications...')
  await supabase.from('certifications').insert(mockCertifications)

  console.log('Inserting skills...')
  await supabase.from('skills').insert(mockSkills)

  console.log('Inserting projects...')
  await supabase.from('projects').insert(mockProjects)

  console.log('Inserting writing...')
  await supabase.from('writing').insert(mockWritings)

  console.log('Inserting testimonials...')
  await supabase.from('testimonials').insert(mockTestimonials)

  console.log('Inserting blog posts...')
  await supabase.from('blog_posts').insert(mockBlogPosts)

  console.log('Inserting blog tags...')
  await supabase.from('blog_tags').insert(mockBlogTags)

  console.log('✅ Seeding complete!')
}

seed().catch(console.error)
