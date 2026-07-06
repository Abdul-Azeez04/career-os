/**
 * Client-side blog data functions (for admin 'use client' pages)
 */
import type { BlogPost, BlogTag, NewsletterSubscriber } from './blog'
import { mockBlogPosts, mockBlogTags, mockSubscribers } from './mock-data'

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

async function getClientSupabase() {
  const { createBrowserClient } = await import('@supabase/ssr')
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}

export async function clientGetAllBlogPostsAdmin(): Promise<BlogPost[]> {
  if (useMock) {
    return mockBlogPosts as BlogPost[]
  }
  const supabase = await getClientSupabase()
  const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as BlogPost[]
}

export async function clientGetBlogPostById(id: string): Promise<BlogPost | null> {
  if (useMock) {
    return mockBlogPosts.find((p: any) => p.id === id) as BlogPost ?? null
  }
  const supabase = await getClientSupabase()
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  if (error) return null
  return data as BlogPost
}

export async function clientCreateBlogPost(input: any): Promise<BlogPost> {
  if (useMock) {
    return { ...mockBlogPosts[0], ...input, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), view_count: 0 } as BlogPost
  }
  const supabase = await getClientSupabase()
  const { data, error } = await supabase.from('blog_posts').insert(input).select().single()
  if (error) throw error
  return data as BlogPost
}

export async function clientUpdateBlogPost(id: string, updates: any): Promise<BlogPost> {
  if (useMock) {
    return { ...mockBlogPosts[0], ...updates, id } as BlogPost
  }
  const supabase = await getClientSupabase()
  const { data, error } = await supabase.from('blog_posts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data as BlogPost
}

export async function clientDeleteBlogPost(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getClientSupabase()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw error
}

export async function clientGetAllBlogTags(): Promise<BlogTag[]> {
  if (useMock) {
    return mockBlogTags as BlogTag[]
  }
  const supabase = await getClientSupabase()
  const { data, error } = await supabase.from('blog_tags').select('*').order('name')
  if (error) throw error
  return (data ?? []) as BlogTag[]
}

export async function clientCreateBlogTag(input: any): Promise<BlogTag> {
  if (useMock) {
    return { ...input, id: crypto.randomUUID(), description: input.description ?? null, color: input.color ?? '#D4A853', created_at: new Date().toISOString() } as BlogTag
  }
  const supabase = await getClientSupabase()
  const { data, error } = await supabase.from('blog_tags').insert(input).select().single()
  if (error) throw error
  return data as BlogTag
}

export async function clientDeleteBlogTag(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getClientSupabase()
  const { error } = await supabase.from('blog_tags').delete().eq('id', id)
  if (error) throw error
}

export async function clientGetNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  if (useMock) {
    return mockSubscribers as NewsletterSubscriber[]
  }
  const supabase = await getClientSupabase()
  const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as NewsletterSubscriber[]
}
