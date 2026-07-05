-- ═══════════════════════════════════════════════════════
-- Career OS: Initial Schema
-- All tables from PRD §5
-- ═══════════════════════════════════════════════════════

-- Reusability anchor: one row per deployment/owner
create table if not exists site_config (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  tagline text,
  bio_short text,
  bio_long text,
  avatar_url text,
  resume_pdf_url text,
  email text,
  socials jsonb,            -- {twitter, github, linkedin, substack, instagram, upwork}
  theme jsonb,              -- {primary_color, font_heading, font_body, mode}
  seo jsonb,                -- {title, description, og_image}
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
  end_date date,             -- null = present
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
  category text,             -- 'language','framework','tool','creative'
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
  gallery jsonb,              -- array of image URLs
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
  series text,                -- e.g. 'Remnants'
  body_markdown text,
  cover_image_url text,
  external_url text,          -- cross-post link (Substack)
  is_published boolean default true,
  published_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote text not null,
  avatar_url text,
  source text,                -- 'Upwork','client email', etc
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

-- ═══════════════════════════════════════════════════════
-- Indexes for common queries
-- ═══════════════════════════════════════════════════════

create index if not exists idx_experience_type on experience(type);
create index if not exists idx_experience_published on experience(is_published);
create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_projects_featured on projects(is_featured);
create index if not exists idx_projects_published on projects(is_published);
create index if not exists idx_writing_slug on writing(slug);
create index if not exists idx_writing_type on writing(type);
create index if not exists idx_writing_published on writing(is_published);
create index if not exists idx_contact_status on contact_messages(status);
