-- ═══════════════════════════════════════════════════════
-- Career OS: Blog Engine Schema
-- Full blog with tags, page views, newsletter subscribers
-- ═══════════════════════════════════════════════════════

-- Blog posts (separate from creative 'writing' table)
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_image_url text,
  body_html text,              -- TipTap rendered HTML
  body_markdown text,          -- raw markdown backup
  category text,               -- 'tutorial','opinion','project-log','devlog'
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft','published','scheduled')),
  scheduled_at timestamptz,
  published_at timestamptz,
  view_count int default 0,
  reading_time_minutes int default 0,
  seo_title text,
  seo_description text,
  og_image_url text,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Standalone tags for blog
create table if not exists blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  color text default '#D4A853',
  created_at timestamptz default now()
);

-- Page view tracking (upsert-based)
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text unique not null,
  view_count int default 1,
  updated_at timestamptz default now()
);

-- Newsletter subscribers
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  status text default 'active' check (status in ('active','unsubscribed')),
  source text,                 -- 'blog-post','newsletter-page','footer'
  subscribed_at timestamptz default now()
);

-- ═══════════════════════════════════════════════════════
-- Add tags column to writing table if not exists
-- ═══════════════════════════════════════════════════════
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name='writing' and column_name='tags'
  ) then
    alter table writing add column tags text[] default '{}';
  end if;
end $$;

-- ═══════════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════════
create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_blog_posts_status on blog_posts(status);
create index if not exists idx_blog_posts_published_at on blog_posts(published_at desc);
create index if not exists idx_blog_posts_featured on blog_posts(is_featured);
create index if not exists idx_blog_tags_slug on blog_tags(slug);
create index if not exists idx_page_views_path on page_views(path);
create index if not exists idx_newsletter_email on newsletter_subscribers(email);
create index if not exists idx_newsletter_status on newsletter_subscribers(status);

-- ═══════════════════════════════════════════════════════
-- RLS Policies for blog
-- ═══════════════════════════════════════════════════════
alter table blog_posts enable row level security;
alter table blog_tags enable row level security;
alter table page_views enable row level security;
alter table newsletter_subscribers enable row level security;

-- Public can read published blog posts
create policy if not exists "Public can read published blog posts"
  on blog_posts for select
  using (status = 'published' and (scheduled_at is null or scheduled_at <= now()));

-- Public can read all tags
create policy if not exists "Public can read blog tags"
  on blog_tags for select using (true);

-- Public can read page views
create policy if not exists "Public can read page views"
  on page_views for select using (true);

-- Anyone can upsert page views
create policy if not exists "Anyone can upsert page views"
  on page_views for insert with check (true);

create policy if not exists "Anyone can update page views"
  on page_views for update using (true);

-- Anyone can subscribe to newsletter
create policy if not exists "Anyone can subscribe"
  on newsletter_subscribers for insert with check (true);

-- Service role gets full access (admin)
create policy if not exists "Service role full access to blog"
  on blog_posts for all using (auth.role() = 'service_role');

create policy if not exists "Service role full access to tags"
  on blog_tags for all using (auth.role() = 'service_role');

create policy if not exists "Service role full access to subscribers"
  on newsletter_subscribers for all using (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════
-- Seed: initial blog tags
-- ═══════════════════════════════════════════════════════
insert into blog_tags (name, slug, description, color) values
  ('AI & Machine Learning', 'ai-ml', 'Artificial intelligence and machine learning', '#8B5CF6'),
  ('Next.js', 'nextjs', 'Next.js framework posts', '#0EA5E9'),
  ('TypeScript', 'typescript', 'TypeScript tips and patterns', '#3B82F6'),
  ('Career', 'career', 'Career advice and experiences', '#10B981'),
  ('Writing', 'writing', 'The craft of writing', '#F59E0B'),
  ('Open Source', 'open-source', 'Open source contributions', '#EC4899'),
  ('Supabase', 'supabase', 'Supabase tips and tutorials', '#22C55E'),
  ('Freelancing', 'freelancing', 'Freelance development insights', '#D4A853')
on conflict (slug) do nothing;
