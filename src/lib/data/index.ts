/**
 * Data access layer — every public page reads from these functions.
 * In dev mode (NEXT_PUBLIC_USE_MOCK_DATA=true), returns mock data.
 * In production, queries Supabase with RLS.
 */
import type {
  SiteConfig, Experience, Certification, Skill,
  Project, Writing, Testimonial, ContactMessage,
  ExperienceType, WritingType, MessageStatus,
  SiteConfigUpdate, ExperienceInsert, ExperienceUpdate,
  CertificationInsert, CertificationUpdate,
  SkillInsert, SkillUpdate,
  ProjectInsert, ProjectUpdate,
  WritingInsert, WritingUpdate,
  TestimonialInsert, TestimonialUpdate,
  ContactMessageInsert, ContactMessageUpdate,
} from '@/lib/supabase/database.types'
import {
  mockSiteConfig, mockExperiences, mockCertifications,
  mockSkills, mockProjects, mockWritings,
  mockTestimonials, mockMessages,
} from './mock-data'

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

// ── Helper: get server Supabase client (lazy import to avoid errors in mock mode) ──
async function getSupabase() {
  const { createClient } = await import('@/lib/supabase/server')
  return createClient()
}

// ═══════════════════════════════════════════════════════
//  SITE CONFIG
// ═══════════════════════════════════════════════════════

export async function getSiteConfig(): Promise<SiteConfig> {
  if (useMock) return mockSiteConfig

  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .limit(1)
    .single()

  if (error) throw error
  return data as SiteConfig
}

export async function updateSiteConfig(updates: SiteConfigUpdate): Promise<SiteConfig> {
  if (useMock) return { ...mockSiteConfig, ...updates } as SiteConfig

  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('site_config')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return data as SiteConfig
}

// ═══════════════════════════════════════════════════════
//  EXPERIENCE
// ═══════════════════════════════════════════════════════

export async function getExperiences(type?: ExperienceType): Promise<Experience[]> {
  if (useMock) {
    let data = mockExperiences.filter(e => e.is_published)
    if (type) data = data.filter(e => e.type === type)
    return data.sort((a, b) => a.sort_order - b.sort_order)
  }

  const supabase = await getSupabase()
  let query = supabase
    .from('experience')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')

  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Experience[]
}

export async function getAllExperiences(): Promise<Experience[]> {
  if (useMock) return mockExperiences.sort((a, b) => a.sort_order - b.sort_order)

  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return (data ?? []) as Experience[]
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  if (useMock) return mockExperiences.find(e => e.id === id) ?? null

  const supabase = await getSupabase()
  const { data, error } = await supabase.from('experience').select('*').eq('id', id).single()
  if (error) return null
  return data as Experience
}

export async function createExperience(input: ExperienceInsert): Promise<Experience> {
  if (useMock) return { ...input, id: crypto.randomUUID() } as Experience

  const supabase = await getSupabase()
  const { data, error } = await supabase.from('experience').insert(input).select().single()
  if (error) throw error
  return data as Experience
}

export async function updateExperience(id: string, updates: ExperienceUpdate): Promise<Experience> {
  if (useMock) return { ...mockExperiences[0], ...updates, id } as Experience

  const supabase = await getSupabase()
  const { data, error } = await supabase.from('experience').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Experience
}

export async function deleteExperience(id: string): Promise<void> {
  if (useMock) return

  const supabase = await getSupabase()
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) throw error
}

// ═══════════════════════════════════════════════════════
//  CERTIFICATIONS
// ═══════════════════════════════════════════════════════

export async function getCertifications(): Promise<Certification[]> {
  if (useMock) return mockCertifications.filter(c => c.is_published).sort((a, b) => a.sort_order - b.sort_order)

  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return (data ?? []) as Certification[]
}

export async function getAllCertifications(): Promise<Certification[]> {
  if (useMock) return mockCertifications
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('certifications').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Certification[]
}

export async function getCertificationById(id: string): Promise<Certification | null> {
  if (useMock) return mockCertifications.find(c => c.id === id) ?? null
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('certifications').select('*').eq('id', id).single()
  if (error) return null
  return data as Certification
}

export async function createCertification(input: CertificationInsert): Promise<Certification> {
  if (useMock) return { ...input, id: crypto.randomUUID() } as Certification
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('certifications').insert(input).select().single()
  if (error) throw error
  return data as Certification
}

export async function updateCertification(id: string, updates: CertificationUpdate): Promise<Certification> {
  if (useMock) return { ...mockCertifications[0], ...updates, id } as Certification
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('certifications').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Certification
}

export async function deleteCertification(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getSupabase()
  const { error } = await supabase.from('certifications').delete().eq('id', id)
  if (error) throw error
}

// ═══════════════════════════════════════════════════════
//  SKILLS
// ═══════════════════════════════════════════════════════

export async function getSkills(): Promise<Skill[]> {
  if (useMock) return mockSkills.sort((a, b) => a.sort_order - b.sort_order)

  const supabase = await getSupabase()
  const { data, error } = await supabase.from('skills').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Skill[]
}

export async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  const skills = await getSkills()
  return skills.reduce((acc, skill) => {
    const cat = skill.category ?? 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)
}

export async function createSkill(input: SkillInsert): Promise<Skill> {
  if (useMock) return { ...input, id: crypto.randomUUID() } as Skill
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('skills').insert(input).select().single()
  if (error) throw error
  return data as Skill
}

export async function updateSkill(id: string, updates: SkillUpdate): Promise<Skill> {
  if (useMock) return { ...mockSkills[0], ...updates, id } as Skill
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Skill
}

export async function deleteSkill(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getSupabase()
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) throw error
}

// ═══════════════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════════════

export async function getProjects(featured?: boolean): Promise<Project[]> {
  if (useMock) {
    let data = mockProjects.filter(p => p.is_published)
    if (featured !== undefined) data = data.filter(p => p.is_featured === featured)
    return data.sort((a, b) => a.sort_order - b.sort_order)
  }

  const supabase = await getSupabase()
  let query = supabase.from('projects').select('*').eq('is_published', true).order('sort_order')
  if (featured !== undefined) query = query.eq('is_featured', featured)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Project[]
}

export async function getAllProjects(): Promise<Project[]> {
  if (useMock) return mockProjects
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('projects').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Project[]
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (useMock) return mockProjects.find(p => p.slug === slug && p.is_published) ?? null

  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) return null
  return data as Project
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (useMock) return mockProjects.find(p => p.id === id) ?? null
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error) return null
  return data as Project
}

export async function createProject(input: ProjectInsert): Promise<Project> {
  if (useMock) return { ...input, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Project
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('projects').insert(input).select().single()
  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
  if (useMock) return { ...mockProjects[0], ...updates, id } as Project
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Project
}

export async function deleteProject(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getSupabase()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ═══════════════════════════════════════════════════════
//  WRITING
// ═══════════════════════════════════════════════════════

export async function getWritings(type?: WritingType): Promise<Writing[]> {
  if (useMock) {
    let data = mockWritings.filter(w => w.is_published)
    if (type) data = data.filter(w => w.type === type)
    return data.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  }

  const supabase = await getSupabase()
  let query = supabase.from('writing').select('*').eq('is_published', true).order('published_at', { ascending: false })
  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Writing[]
}

export async function getAllWritings(): Promise<Writing[]> {
  if (useMock) return mockWritings
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('writing').select('*').order('published_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Writing[]
}

export async function getWritingBySlug(slug: string): Promise<Writing | null> {
  if (useMock) return mockWritings.find(w => w.slug === slug && w.is_published) ?? null

  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('writing')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) return null
  return data as Writing
}

export async function getWritingById(id: string): Promise<Writing | null> {
  if (useMock) return mockWritings.find(w => w.id === id) ?? null
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('writing').select('*').eq('id', id).single()
  if (error) return null
  return data as Writing
}

export async function createWriting(input: WritingInsert): Promise<Writing> {
  if (useMock) return { ...input, id: crypto.randomUUID() } as Writing
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('writing').insert(input).select().single()
  if (error) throw error
  return data as Writing
}

export async function updateWriting(id: string, updates: WritingUpdate): Promise<Writing> {
  if (useMock) return { ...mockWritings[0], ...updates, id } as Writing
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('writing').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Writing
}

export async function deleteWriting(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getSupabase()
  const { error } = await supabase.from('writing').delete().eq('id', id)
  if (error) throw error
}

// ═══════════════════════════════════════════════════════
//  TESTIMONIALS
// ═══════════════════════════════════════════════════════

export async function getTestimonials(): Promise<Testimonial[]> {
  if (useMock) return mockTestimonials.filter(t => t.is_published).sort((a, b) => a.sort_order - b.sort_order)

  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return (data ?? []) as Testimonial[]
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  if (useMock) return mockTestimonials
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')
  if (error) throw error
  return (data ?? []) as Testimonial[]
}

export async function createTestimonial(input: TestimonialInsert): Promise<Testimonial> {
  if (useMock) return { ...input, id: crypto.randomUUID() } as Testimonial
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('testimonials').insert(input).select().single()
  if (error) throw error
  return data as Testimonial
}

export async function updateTestimonial(id: string, updates: TestimonialUpdate): Promise<Testimonial> {
  if (useMock) return { ...mockTestimonials[0], ...updates, id } as Testimonial
  const supabase = await getSupabase()
  const { data, error } = await supabase.from('testimonials').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Testimonial
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getSupabase()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}

// ═══════════════════════════════════════════════════════
//  CONTACT MESSAGES
// ═══════════════════════════════════════════════════════

export async function submitContactMessage(input: ContactMessageInsert): Promise<ContactMessage> {
  if (useMock) return { ...input, id: crypto.randomUUID(), status: 'new', created_at: new Date().toISOString() } as ContactMessage

  const supabase = await getSupabase()
  const { data, error } = await supabase.from('contact_messages').insert(input).select().single()
  if (error) throw error
  return data as ContactMessage
}

export async function getMessages(status?: MessageStatus): Promise<ContactMessage[]> {
  if (useMock) {
    let data = mockMessages
    if (status) data = data.filter(m => m.status === status)
    return data
  }

  const supabase = await getSupabase()
  let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ContactMessage[]
}

export async function updateMessageStatus(id: string, status: MessageStatus): Promise<ContactMessage> {
  if (useMock) return { ...mockMessages[0], status, id } as ContactMessage

  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as ContactMessage
}

export async function deleteMessage(id: string): Promise<void> {
  if (useMock) return
  const supabase = await getSupabase()
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) throw error
}

// ═══════════════════════════════════════════════════════
//  AGGREGATE STATS (for admin dashboard)
// ═══════════════════════════════════════════════════════

export async function getAdminStats() {
  const [projects, writings, messages, testimonials, experiences, certifications] = await Promise.all([
    useMock ? Promise.resolve(mockProjects) : getAllProjects(),
    useMock ? Promise.resolve(mockWritings) : getAllWritings(),
    useMock ? Promise.resolve(mockMessages) : getMessages(),
    useMock ? Promise.resolve(mockTestimonials) : getAllTestimonials(),
    useMock ? Promise.resolve(mockExperiences) : getAllExperiences(),
    useMock ? Promise.resolve(mockCertifications) : getAllCertifications(),
  ])

  return {
    totalProjects: projects.length,
    publishedProjects: projects.filter(p => p.is_published).length,
    totalWritings: writings.length,
    publishedWritings: writings.filter(w => w.is_published).length,
    unreadMessages: messages.filter(m => m.status === 'new').length,
    totalMessages: messages.length,
    totalTestimonials: testimonials.length,
    totalExperiences: experiences.length,
    totalCertifications: certifications.length,
  }
}
