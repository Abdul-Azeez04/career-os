/**
 * Client-safe data layer for use in 'use client' components (e.g., admin pages).
 * In mock mode: returns mock data directly.
 * In live mode: uses the browser Supabase client (no next/headers dependency).
 */
import type {
  SiteConfig, Experience, Certification, Skill,
  Project, Writing, Testimonial, ContactMessage,
  SiteConfigUpdate, ExperienceInsert, ExperienceUpdate,
  CertificationInsert, CertificationUpdate,
  SkillInsert, SkillUpdate,
  ProjectInsert, ProjectUpdate,
  WritingInsert, WritingUpdate,
  TestimonialInsert, TestimonialUpdate,
  MessageStatus,
} from '@/lib/supabase/database.types'
import {
  mockSiteConfig, mockExperiences, mockCertifications,
  mockSkills, mockProjects, mockWritings,
  mockTestimonials, mockMessages,
} from './mock-data'

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

// Helper: get browser Supabase client (no next/headers dependency)
function getClientSupabase() {
  const { createClient } = require('@/lib/supabase/client')
  return createClient()
}

// ── Site Config ──────────────────────────────────────────

export async function clientGetSiteConfig(): Promise<SiteConfig> {
  if (useMock) return mockSiteConfig
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('site_config').select('*').limit(1).single()
  if (error) throw error
  return data as SiteConfig
}

export async function clientUpdateSiteConfig(updates: SiteConfigUpdate): Promise<SiteConfig> {
  if (useMock) return { ...mockSiteConfig, ...updates } as SiteConfig
  const supabase = getClientSupabase()
  const existing = await clientGetSiteConfig()
  const { data, error } = await supabase.from('site_config').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', existing.id).select().single()
  if (error) throw error
  return data as SiteConfig
}

// ── Experience ───────────────────────────────────────────

export async function clientGetAllExperiences(): Promise<Experience[]> {
  if (useMock) return mockExperiences.sort((a, b) => a.sort_order - b.sort_order)
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('experience').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Experience[]
}

export async function clientCreateExperience(input: ExperienceInsert): Promise<Experience> {
  if (useMock) return { ...input, id: crypto.randomUUID() } as Experience
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('experience').insert(input).select().single()
  if (error) throw error
  return data as Experience
}

export async function clientUpdateExperience(id: string, updates: ExperienceUpdate): Promise<Experience> {
  if (useMock) return { ...mockExperiences[0], ...updates, id } as Experience
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('experience').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Experience
}

export async function clientDeleteExperience(id: string): Promise<void> {
  if (useMock) return
  const supabase = getClientSupabase()
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) throw error
}

// ── Certifications ───────────────────────────────────────

export async function clientGetAllCertifications(): Promise<Certification[]> {
  if (useMock) return mockCertifications
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('certifications').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Certification[]
}

export async function clientDeleteCertification(id: string): Promise<void> {
  if (useMock) return
  const supabase = getClientSupabase()
  const { error } = await supabase.from('certifications').delete().eq('id', id)
  if (error) throw error
}

export async function clientCreateCertification(input: CertificationInsert): Promise<Certification> {
  if (useMock) return { ...input, id: crypto.randomUUID() } as Certification
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('certifications').insert(input).select().single()
  if (error) throw error
  return data as Certification
}

export async function clientUpdateCertification(id: string, updates: CertificationUpdate): Promise<Certification> {
  if (useMock) return { ...mockCertifications[0], ...updates, id } as Certification
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('certifications').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Certification
}

// ── Skills ───────────────────────────────────────────────

export async function clientGetSkills(): Promise<Skill[]> {
  if (useMock) return mockSkills.sort((a, b) => a.sort_order - b.sort_order)
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('skills').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Skill[]
}

export async function clientCreateSkill(input: SkillInsert): Promise<Skill> {
  if (useMock) return { ...input, id: crypto.randomUUID() } as Skill
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('skills').insert(input).select().single()
  if (error) throw error
  return data as Skill
}

export async function clientUpdateSkill(id: string, updates: SkillUpdate): Promise<Skill> {
  if (useMock) return { ...mockSkills[0], ...updates, id } as Skill
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Skill
}

export async function clientDeleteSkill(id: string): Promise<void> {
  if (useMock) return
  const supabase = getClientSupabase()
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) throw error
}

// ── Projects ─────────────────────────────────────────────

export async function clientGetAllProjects(): Promise<Project[]> {
  if (useMock) return mockProjects
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('projects').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Project[]
}

export async function clientGetProjectById(id: string): Promise<Project | null> {
  if (useMock) return mockProjects.find(p => p.id === id) ?? null
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error) return null
  return data as Project
}

export async function clientCreateProject(input: ProjectInsert): Promise<Project> {
  if (useMock) return { ...input, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Project
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('projects').insert(input).select().single()
  if (error) throw error
  return data as Project
}

export async function clientUpdateProject(id: string, updates: ProjectUpdate): Promise<Project> {
  if (useMock) return { ...mockProjects[0], ...updates, id } as Project
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Project
}

export async function clientDeleteProject(id: string): Promise<void> {
  if (useMock) return
  const supabase = getClientSupabase()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ── Writing ──────────────────────────────────────────────

export async function clientGetAllWritings(): Promise<Writing[]> {
  if (useMock) return mockWritings
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('writing').select('*').order('published_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Writing[]
}

export async function clientGetWritingById(id: string): Promise<Writing | null> {
  if (useMock) return mockWritings.find(w => w.id === id) ?? null
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('writing').select('*').eq('id', id).single()
  if (error) return null
  return data as Writing
}

export async function clientCreateWriting(input: WritingInsert): Promise<Writing> {
  if (useMock) return { ...input, id: crypto.randomUUID() } as Writing
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('writing').insert(input).select().single()
  if (error) throw error
  return data as Writing
}

export async function clientUpdateWriting(id: string, updates: WritingUpdate): Promise<Writing> {
  if (useMock) return { ...mockWritings[0], ...updates, id } as Writing
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('writing').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Writing
}

export async function clientDeleteWriting(id: string): Promise<void> {
  if (useMock) return
  const supabase = getClientSupabase()
  const { error } = await supabase.from('writing').delete().eq('id', id)
  if (error) throw error
}

// ── Testimonials ─────────────────────────────────────────

export async function clientGetAllTestimonials(): Promise<Testimonial[]> {
  if (useMock) return mockTestimonials
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Testimonial[]
}

export async function clientDeleteTestimonial(id: string): Promise<void> {
  if (useMock) return
  const supabase = getClientSupabase()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}

// ── Messages ─────────────────────────────────────────────

export async function clientGetMessages(status?: MessageStatus): Promise<ContactMessage[]> {
  if (useMock) {
    let data = mockMessages
    if (status) data = data.filter(m => m.status === status)
    return data
  }
  const supabase = getClientSupabase()
  let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ContactMessage[]
}

export async function clientUpdateMessageStatus(id: string, status: MessageStatus): Promise<ContactMessage> {
  if (useMock) return { ...mockMessages[0], status, id } as ContactMessage
  const supabase = getClientSupabase()
  const { data, error } = await supabase.from('contact_messages').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data as ContactMessage
}

export async function clientDeleteMessage(id: string): Promise<void> {
  if (useMock) return
  const supabase = getClientSupabase()
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) throw error
}

// ── Admin Stats ──────────────────────────────────────────

export async function clientGetAdminStats() {
  if (useMock) {
    return {
      total_projects: mockProjects.length,
      total_writings: mockWritings.length,
      unread_messages: mockMessages.filter(m => m.status === 'new').length,
      total_testimonials: mockTestimonials.length,
    }
  }
  const supabase = getClientSupabase()
  const [{ count: projects }, { count: writings }, { count: testimonials }, { data: msgs }] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('writing').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('status').eq('status', 'new'),
  ])
  return {
    total_projects: projects ?? 0,
    total_writings: writings ?? 0,
    unread_messages: (msgs ?? []).length,
    total_testimonials: testimonials ?? 0,
  }
}
