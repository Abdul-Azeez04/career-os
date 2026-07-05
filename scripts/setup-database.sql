-- ═══════════════════════════════════════════════════════
-- CAREER OS — COMPLETE DATABASE SETUP
-- Run this entire script once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lqibjwqkmedexqvwrdjt/sql/new
-- ═══════════════════════════════════════════════════════

-- ─────────────────────────────────
-- 1. CORE TABLES
-- ─────────────────────────────────

create table if not exists site_config (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  tagline text,
  bio_short text,
  bio_long text,
  avatar_url text,
  resume_pdf_url text,
  email text,
  socials jsonb,
  theme jsonb,
  seo jsonb,
  show_writing boolean default true,
  show_services boolean default true,
  updated_at timestamptz default now()
);

create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('education','freelance','employment','leadership')),
  title text not null,
  org text not null,
  location text,
  start_date date,
  end_date date,
  description text,
  highlights text[],
  sort_order int default 0,
  is_published boolean default true
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date,
  expiry_date date,
  credential_url text,
  badge_image_url text,
  sort_order int default 0,
  is_published boolean default true
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  proficiency int check (proficiency between 1 and 5),
  sort_order int default 0
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  problem text,
  solution text,
  stack text[],
  role text,
  outcome text,
  live_url text,
  repo_url text,
  cover_image_url text,
  gallery jsonb,
  is_featured boolean default false,
  is_published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists writing (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  type text not null check (type in ('poem','excerpt','essay','post')),
  series text,
  body_markdown text,
  cover_image_url text,
  external_url text,
  tags text[] default '{}',
  is_published boolean default true,
  published_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote text not null,
  avatar_url text,
  source text,
  sort_order int default 0,
  is_published boolean default true
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  status text default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz default now()
);

create table if not exists admin_users (
  id uuid primary key references auth.users(id),
  role text default 'owner' check (role in ('owner','editor'))
);

-- ─────────────────────────────────
-- 2. BLOG ENGINE TABLES
-- ─────────────────────────────────

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_image_url text,
  body_html text,
  body_markdown text,
  category text,
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

create table if not exists blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  color text default '#D4A853',
  created_at timestamptz default now()
);

create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text unique not null,
  view_count int default 1,
  updated_at timestamptz default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  status text default 'active' check (status in ('active','unsubscribed')),
  source text,
  subscribed_at timestamptz default now()
);

-- ─────────────────────────────────
-- 3. INDEXES
-- ─────────────────────────────────

create index if not exists idx_experience_type on experience(type);
create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_projects_featured on projects(is_featured);
create index if not exists idx_writing_slug on writing(slug);
create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_blog_posts_status on blog_posts(status);
create index if not exists idx_blog_posts_published_at on blog_posts(published_at desc);
create index if not exists idx_blog_tags_slug on blog_tags(slug);
create index if not exists idx_page_views_path on page_views(path);
create index if not exists idx_newsletter_email on newsletter_subscribers(email);

-- ─────────────────────────────────
-- 4. RLS POLICIES
-- ─────────────────────────────────

create or replace function is_admin()
returns boolean as $$
begin
  return exists (select 1 from admin_users where id = auth.uid());
end;
$$ language plpgsql security definer;

-- site_config
alter table site_config enable row level security;
drop policy if exists "site_config_public_read" on site_config;
create policy "site_config_public_read" on site_config for select using (true);
drop policy if exists "site_config_admin_all" on site_config;
create policy "site_config_admin_all" on site_config for all using (is_admin());

-- experience
alter table experience enable row level security;
drop policy if exists "experience_public_read" on experience;
create policy "experience_public_read" on experience for select using (is_published = true or is_admin());
drop policy if exists "experience_admin_all" on experience;
create policy "experience_admin_all" on experience for all using (is_admin());

-- certifications
alter table certifications enable row level security;
drop policy if exists "certifications_public_read" on certifications;
create policy "certifications_public_read" on certifications for select using (is_published = true or is_admin());
drop policy if exists "certifications_admin_all" on certifications;
create policy "certifications_admin_all" on certifications for all using (is_admin());

-- skills
alter table skills enable row level security;
drop policy if exists "skills_public_read" on skills;
create policy "skills_public_read" on skills for select using (true);
drop policy if exists "skills_admin_all" on skills;
create policy "skills_admin_all" on skills for all using (is_admin());

-- projects
alter table projects enable row level security;
drop policy if exists "projects_public_read" on projects;
create policy "projects_public_read" on projects for select using (is_published = true or is_admin());
drop policy if exists "projects_admin_all" on projects;
create policy "projects_admin_all" on projects for all using (is_admin());

-- writing
alter table writing enable row level security;
drop policy if exists "writing_public_read" on writing;
create policy "writing_public_read" on writing for select using (is_published = true or is_admin());
drop policy if exists "writing_admin_all" on writing;
create policy "writing_admin_all" on writing for all using (is_admin());

-- testimonials
alter table testimonials enable row level security;
drop policy if exists "testimonials_public_read" on testimonials;
create policy "testimonials_public_read" on testimonials for select using (is_published = true or is_admin());
drop policy if exists "testimonials_admin_all" on testimonials;
create policy "testimonials_admin_all" on testimonials for all using (is_admin());

-- contact_messages
alter table contact_messages enable row level security;
drop policy if exists "contact_messages_public_insert" on contact_messages;
create policy "contact_messages_public_insert" on contact_messages for insert with check (true);
drop policy if exists "contact_messages_admin_read" on contact_messages;
create policy "contact_messages_admin_read" on contact_messages for select using (is_admin());
drop policy if exists "contact_messages_admin_all" on contact_messages;
create policy "contact_messages_admin_all" on contact_messages for all using (is_admin());

-- admin_users
alter table admin_users enable row level security;
drop policy if exists "admin_users_self_read" on admin_users;
create policy "admin_users_self_read" on admin_users for select using (id = auth.uid());

-- blog_posts
alter table blog_posts enable row level security;
drop policy if exists "blog_posts_public_read" on blog_posts;
create policy "blog_posts_public_read" on blog_posts for select using (status = 'published');
drop policy if exists "blog_posts_admin_all" on blog_posts;
create policy "blog_posts_admin_all" on blog_posts for all using (is_admin());

-- blog_tags
alter table blog_tags enable row level security;
drop policy if exists "blog_tags_public_read" on blog_tags;
create policy "blog_tags_public_read" on blog_tags for select using (true);
drop policy if exists "blog_tags_admin_all" on blog_tags;
create policy "blog_tags_admin_all" on blog_tags for all using (is_admin());

-- page_views
alter table page_views enable row level security;
drop policy if exists "page_views_public_read" on page_views;
create policy "page_views_public_read" on page_views for select using (true);
drop policy if exists "page_views_anyone_upsert" on page_views;
create policy "page_views_anyone_upsert" on page_views for insert with check (true);
drop policy if exists "page_views_anyone_update" on page_views;
create policy "page_views_anyone_update" on page_views for update using (true);

-- newsletter_subscribers
alter table newsletter_subscribers enable row level security;
drop policy if exists "newsletter_public_subscribe" on newsletter_subscribers;
create policy "newsletter_public_subscribe" on newsletter_subscribers for insert with check (true);
drop policy if exists "newsletter_admin_all" on newsletter_subscribers;
create policy "newsletter_admin_all" on newsletter_subscribers for all using (is_admin());

-- ─────────────────────────────────
-- 5. STORAGE BUCKETS
-- ─────────────────────────────────

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', true) on conflict (id) do nothing;

drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read" on storage.objects for select using (bucket_id in ('avatars', 'media', 'resumes'));
drop policy if exists "storage_authenticated_upload" on storage.objects;
create policy "storage_authenticated_upload" on storage.objects for insert with check (bucket_id in ('avatars', 'media', 'resumes') and auth.role() = 'authenticated');
drop policy if exists "storage_authenticated_update" on storage.objects;
create policy "storage_authenticated_update" on storage.objects for update using (bucket_id in ('avatars', 'media', 'resumes') and auth.role() = 'authenticated');
drop policy if exists "storage_authenticated_delete" on storage.objects;
create policy "storage_authenticated_delete" on storage.objects for delete using (bucket_id in ('avatars', 'media', 'resumes') and auth.role() = 'authenticated');

-- ─────────────────────────────────
-- 6. SEED DATA
-- ─────────────────────────────────

-- Blog tags
insert into blog_tags (name, slug, description, color) values
  ('AI & Machine Learning', 'ai-ml', 'Artificial intelligence posts', '#8B5CF6'),
  ('Next.js', 'nextjs', 'Next.js framework posts', '#0EA5E9'),
  ('TypeScript', 'typescript', 'TypeScript tips and patterns', '#3B82F6'),
  ('Career', 'career', 'Career advice and experiences', '#10B981'),
  ('Writing', 'writing-craft', 'The craft of writing', '#F59E0B'),
  ('Open Source', 'open-source', 'Open source contributions', '#EC4899'),
  ('Supabase', 'supabase', 'Supabase tips and tutorials', '#22C55E'),
  ('Freelancing', 'freelancing', 'Freelance development insights', '#D4A853')
on conflict (slug) do nothing;

-- Site config (your data — update via admin panel after setup)
insert into site_config (owner_name, tagline, bio_short, email, show_writing, show_services)
values (
  'Abdul-Azeez',
  'Full-Stack AI Developer & Author',
  'I build intelligent systems and write stories. Currently working on AI-powered tools and the Remnants fiction series.',
  'azeezadeyinka56@gmail.com',
  true,
  true
) on conflict do nothing;

select 'Setup complete! Tables, RLS, storage, and seed data created.' as status;
