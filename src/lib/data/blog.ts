/**
 * Blog data layer — follows the same mock/supabase pattern as index.ts
 */

// ── Types ──
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image_url: string | null
  body_html: string | null
  body_markdown: string | null
  category: string | null
  tags: string[]
  status: 'draft' | 'published' | 'scheduled'
  scheduled_at: string | null
  published_at: string | null
  view_count: number
  reading_time_minutes: number
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name: string | null
  status: 'active' | 'unsubscribed'
  source: string | null
  subscribed_at: string
}

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'view_count'>

import { mockBlogPosts, mockBlogTags, mockSubscribers } from './mock-data'

const useMock = false

async function getSupabase() {
  const { createClient } = await import('@/lib/supabase/server')
  return createClient()
}

// ═══════════════════════════════════════
//  PUBLIC READS
// ═══════════════════════════════════════

export async function getBlogPosts(options?: { tag?: string; featured?: boolean; limit?: number }): Promise<BlogPost[]> {
  if (useMock) {
    let data = mockBlogPosts.filter(p => p.status === 'published')
    if (options?.tag) data = data.filter(p => p.tags.includes(options.tag!))
    if (options?.featured !== undefined) data = data.filter(p => p.is_featured === options.featured)
    data.sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime())
    if (options?.limit) data = data.slice(0, options.limit)
    return data
  }
  const supabase = await getSupabase()
  let query = supabase.from('blog_posts').select('*').eq('status', 'published').order('published_at', { ascending: false })
  if (options?.tag) query = query.contains('tags', [options.tag])
  if (options?.featured !== undefined) query = query.eq('is_featured', options.featured)
  if (options?.limit) query = query.limit(options.limit)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as BlogPost[]
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (useMock) return mockBlogPosts.find(p => p.slug === slug && p.status === 'published') ?? null
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').single()
  if (error) return null
  return data as BlogPost
}

export async function getBlogPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  return getBlogPosts({ tag: tagSlug })
}

export async function getAllBlogTags(): Promise<BlogTag[]> {
  if (useMock) return mockBlogTags
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('blog_tags').select('*').order('name')
  if (error) throw error
  return (data ?? []) as BlogTag[]
}

export async function getRelatedBlogPosts(currentId: string, tags: string[], limit = 2): Promise<BlogPost[]> {
  if (useMock) return mockBlogPosts.filter(p => p.id !== currentId && p.status === 'published' && p.tags.some(t => tags.includes(t))).slice(0, limit)
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('blog_posts').select('*').eq('status', 'published').neq('id', currentId).overlaps('tags', tags).limit(limit)
  if (error) return []
  return (data ?? []) as BlogPost[]
}

export async function trackPageView(path: string): Promise<void> {
  if (useMock) return
  try {
    const supabase = await getSupabase()
    const { data: existing } = await supabase.from('page_views').select('id, view_count').eq('path', path).single()
    if (existing) {
      await supabase.from('page_views').update({ view_count: existing.view_count + 1, updated_at: new Date().toISOString() }).eq('id', existing.id)
    } else {
      await supabase.from('page_views').insert({ path, view_count: 1 })
    }
  } catch (e) { /* silently fail — page views are non-critical */ }
}

// ═══════════════════════════════════════
//  ADMIN CRUD
// ═══════════════════════════════════════

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  if (useMock) return mockBlogPosts
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as BlogPost[]
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  if (useMock) return mockBlogPosts.find(p => p.id === id) ?? null
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  if (error) return null
  return data as BlogPost
}

export async function createBlogPost(input: Partial<BlogPostInsert>): Promise<BlogPost> {
  if (useMock) return { ...mockBlogPosts[0], ...input, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), view_count: 0 } as BlogPost
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('blog_posts').insert(input).select().single()
  if (error) throw error
  return data as BlogPost
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  if (useMock) return { ...mockBlogPosts[0], ...updates, id } as BlogPost
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('blog_posts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data as BlogPost
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getSupabase()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw error
}

export async function createBlogTag(input: { name: string; slug: string; color?: string; description?: string }): Promise<BlogTag> {
  if (useMock) return { ...input, id: crypto.randomUUID(), description: input.description ?? null, color: input.color ?? '#D4A853', created_at: new Date().toISOString() } as BlogTag
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('blog_tags').insert(input).select().single()
  if (error) throw error
  return data as BlogTag
}

export async function deleteBlogTag(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getSupabase()
  const { error } = await supabase.from('blog_tags').delete().eq('id', id)
  if (error) throw error
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  if (useMock) return mockSubscribers
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as NewsletterSubscriber[]
}

export async function subscribeEmail(email: string, name?: string, source?: string): Promise<void> {
  if (useMock) return
  const supabase = await getSupabase()
  await supabase.from('newsletter_subscribers').upsert({ email, name, source, status: 'active' }, { onConflict: 'email' })
}
