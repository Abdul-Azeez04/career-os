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

// ── Mock Data ──
const mockBlogPosts: BlogPost[] = [
  {
    id: 'bp-1', slug: 'building-career-os-nextjs-supabase',
    title: 'Building a Career OS with Next.js 15 and Supabase',
    excerpt: 'How I designed a self-editable personal platform that doubles as a developer portfolio and author brand — and made it forkable.',
    cover_image_url: null,
    body_html: '<h2>The Problem</h2><p>Every developer needs a portfolio. Every author needs a platform. I needed both — without maintaining two separate sites.</p><h2>Architecture</h2><p>The solution is a single Next.js 15 application with a Supabase backend. Every piece of content is a database row, not hardcoded HTML.</p><h3>Key Decisions</h3><ul><li>Server components for public pages (SEO)</li><li>Client components for the admin dashboard (interactivity)</li><li>Row-Level Security so the public API is read-only</li></ul><h2>The Admin Dashboard</h2><p>The admin panel is a full CRUD interface for every content type — projects, writing, experience, skills, certifications, testimonials, and now blog posts.</p><blockquote><p>The best CMS is the one you actually use.</p></blockquote><h2>Making It Forkable</h2><p>One seed script, one set of environment variables, and anyone can deploy their own Career OS. The site_config table makes every deployment unique.</p>',
    body_markdown: '## The Problem\n\nEvery developer needs a portfolio. Every author needs a platform. I needed both.\n\n## Architecture\n\nThe solution is a single Next.js 15 application with a Supabase backend.',
    category: 'tutorial', tags: ['nextjs', 'supabase'],
    status: 'published', scheduled_at: null,
    published_at: '2026-07-01T00:00:00Z', view_count: 142,
    reading_time_minutes: 8, seo_title: null, seo_description: null,
    og_image_url: null, is_featured: true,
    created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z',
  },
  {
    id: 'bp-2', slug: 'why-every-developer-should-write',
    title: 'Why Every Developer Should Write',
    excerpt: 'Writing forces clarity of thought. If you can explain a system in prose, you understand it. If you can not, you are guessing.',
    cover_image_url: null,
    body_html: '<h2>The Clarity Test</h2><p>Writing is thinking. When you write about a technical concept, you discover the gaps in your understanding.</p><h2>Compound Returns</h2><p>A blog post written today compounds forever. It builds your reputation, attracts opportunities, and helps others.</p><h2>Getting Started</h2><p>Start with what you just learned. Write the tutorial you wish existed. Ship it imperfect.</p>',
    body_markdown: '## The Clarity Test\n\nWriting is thinking. When you write about a technical concept, you discover the gaps in your understanding.',
    category: 'opinion', tags: ['career', 'writing-craft'],
    status: 'published', scheduled_at: null,
    published_at: '2026-06-20T00:00:00Z', view_count: 89,
    reading_time_minutes: 5, seo_title: null, seo_description: null,
    og_image_url: null, is_featured: false,
    created_at: '2026-06-20T00:00:00Z', updated_at: '2026-06-20T00:00:00Z',
  },
  {
    id: 'bp-3', slug: 'ai-assisted-workflow-2026',
    title: 'My AI-Assisted Development Workflow in 2026',
    excerpt: 'The tools I use daily — from AI pair programming to automated testing — and the philosophy behind choosing human-in-the-loop over full automation.',
    cover_image_url: null,
    body_html: '<h2>The Stack</h2><p>My current development workflow leans heavily on AI assistance, but always with a human making the final call.</p>',
    body_markdown: '## The Stack\n\nMy current development workflow leans heavily on AI assistance.',
    category: 'devlog', tags: ['ai-ml'],
    status: 'draft', scheduled_at: null,
    published_at: null, view_count: 0,
    reading_time_minutes: 6, seo_title: null, seo_description: null,
    og_image_url: null, is_featured: false,
    created_at: '2026-07-04T00:00:00Z', updated_at: '2026-07-04T00:00:00Z',
  },
]

const mockBlogTags: BlogTag[] = [
  { id: 'bt-1', name: 'AI & Machine Learning', slug: 'ai-ml', description: null, color: '#8B5CF6', created_at: '2026-01-01T00:00:00Z' },
  { id: 'bt-2', name: 'Next.js', slug: 'nextjs', description: null, color: '#0EA5E9', created_at: '2026-01-01T00:00:00Z' },
  { id: 'bt-3', name: 'Supabase', slug: 'supabase', description: null, color: '#22C55E', created_at: '2026-01-01T00:00:00Z' },
  { id: 'bt-4', name: 'Career', slug: 'career', description: null, color: '#10B981', created_at: '2026-01-01T00:00:00Z' },
  { id: 'bt-5', name: 'Writing', slug: 'writing-craft', description: null, color: '#F59E0B', created_at: '2026-01-01T00:00:00Z' },
  { id: 'bt-6', name: 'Freelancing', slug: 'freelancing', description: null, color: '#D4A853', created_at: '2026-01-01T00:00:00Z' },
]

const mockSubscribers: NewsletterSubscriber[] = [
  { id: 'ns-1', email: 'fan@example.com', name: 'Jane Reader', status: 'active', source: 'blog-post', subscribed_at: '2026-06-15T00:00:00Z' },
]

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

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
