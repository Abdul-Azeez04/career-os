/* ─────────────────────────────────────────────────────────
 *  Database types — manually maintained until Supabase CLI
 *  generates them via `supabase gen types typescript`.
 *  Every table from PRD §5 is represented here.
 * ───────────────────────────────────────────────────────── */

// ── Enums ──────────────────────────────────────────────
export type ExperienceType = 'education' | 'freelance' | 'employment' | 'leadership'
export type WritingType = 'poem' | 'excerpt' | 'essay' | 'post'
export type MessageStatus = 'new' | 'read' | 'replied' | 'archived'
export type AdminRole = 'owner' | 'editor'
export type SkillCategory = 'language' | 'framework' | 'tool' | 'creative'

// ── Row types (what SELECT returns) ────────────────────

export interface SiteConfig {
  id: string
  owner_name: string
  tagline: string | null
  bio_short: string | null
  bio_long: string | null
  avatar_url: string | null
  resume_pdf_url: string | null
  email: string | null
  socials: {
    twitter?: string
    github?: string
    linkedin?: string
    substack?: string
    instagram?: string
    upwork?: string
  } | null
  theme: {
    primary_color?: string
    font_heading?: string
    font_body?: string
    mode?: 'dark' | 'light'
  } | null
  seo: {
    title?: string
    description?: string
    og_image?: string
  } | null
  show_writing?: boolean
  show_services?: boolean
  updated_at: string
}

export interface Experience {
  id: string
  type: ExperienceType
  title: string
  org: string
  location: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  highlights: string[] | null
  sort_order: number
  is_published: boolean
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issue_date: string | null
  expiry_date: string | null
  credential_url: string | null
  badge_image_url: string | null
  sort_order: number
  is_published: boolean
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory | null
  proficiency: number
  sort_order: number
}

export interface Project {
  id: string
  slug: string
  title: string
  summary: string | null
  problem: string | null
  solution: string | null
  stack: string[] | null
  role: string | null
  outcome: string | null
  live_url: string | null
  repo_url: string | null
  cover_image_url: string | null
  gallery: string[] | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
}

export interface Writing {
  id: string
  slug: string
  title: string
  type: WritingType
  series: string | null
  body_markdown: string | null
  cover_image_url: string | null
  external_url: string | null
  is_published: boolean
  published_at: string
}

export interface Testimonial {
  id: string
  author_name: string
  author_role: string | null
  quote: string
  avatar_url: string | null
  source: string | null
  sort_order: number
  is_published: boolean
}

export interface ContactMessage {
  id: string
  name: string | null
  email: string | null
  message: string | null
  status: MessageStatus
  created_at: string
}

export interface AdminUser {
  id: string
  role: AdminRole
}

// ── Insert types (for creating new rows) ───────────────

export type SiteConfigInsert = Omit<SiteConfig, 'id' | 'updated_at'> & {
  id?: string
  updated_at?: string
}

export type ExperienceInsert = Omit<Experience, 'id'> & { id?: string }
export type CertificationInsert = Omit<Certification, 'id'> & { id?: string }
export type SkillInsert = Omit<Skill, 'id'> & { id?: string }
export type ProjectInsert = Omit<Project, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}
export type WritingInsert = Omit<Writing, 'id'> & { id?: string }
export type TestimonialInsert = Omit<Testimonial, 'id'> & { id?: string }
export type ContactMessageInsert = Omit<ContactMessage, 'id' | 'created_at' | 'status'> & {
  id?: string
  created_at?: string
  status?: MessageStatus
}

// ── Update types (partial) ─────────────────────────────

export type SiteConfigUpdate = Partial<Omit<SiteConfig, 'id'>>
export type ExperienceUpdate = Partial<Omit<Experience, 'id'>>
export type CertificationUpdate = Partial<Omit<Certification, 'id'>>
export type SkillUpdate = Partial<Omit<Skill, 'id'>>
export type ProjectUpdate = Partial<Omit<Project, 'id' | 'created_at'>>
export type WritingUpdate = Partial<Omit<Writing, 'id'>>
export type TestimonialUpdate = Partial<Omit<Testimonial, 'id'>>
export type ContactMessageUpdate = Partial<Omit<ContactMessage, 'id' | 'created_at'>>

// ── Full Database type (mirrors Supabase generated shape) ──

export interface Database {
  public: {
    Tables: {
      site_config: {
        Row: SiteConfig
        Insert: SiteConfigInsert
        Update: SiteConfigUpdate
      }
      experience: {
        Row: Experience
        Insert: ExperienceInsert
        Update: ExperienceUpdate
      }
      certifications: {
        Row: Certification
        Insert: CertificationInsert
        Update: CertificationUpdate
      }
      skills: {
        Row: Skill
        Insert: SkillInsert
        Update: SkillUpdate
      }
      projects: {
        Row: Project
        Insert: ProjectInsert
        Update: ProjectUpdate
      }
      writing: {
        Row: Writing
        Insert: WritingInsert
        Update: WritingUpdate
      }
      testimonials: {
        Row: Testimonial
        Insert: TestimonialInsert
        Update: TestimonialUpdate
      }
      contact_messages: {
        Row: ContactMessage
        Insert: ContactMessageInsert
        Update: ContactMessageUpdate
      }
      admin_users: {
        Row: AdminUser
        Insert: AdminUser
        Update: Partial<AdminUser>
      }
    }
  }
}
