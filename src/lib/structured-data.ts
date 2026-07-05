/**
 * JSON-LD structured data generators for SEO.
 */
import type { SiteConfig, Project, Writing } from '@/lib/supabase/database.types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://abdul-azeez.dev'

export function generatePersonSchema(config: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.owner_name,
    description: config.bio_short,
    url: siteUrl,
    image: config.avatar_url,
    email: config.email ? `mailto:${config.email}` : undefined,
    sameAs: [
      config.socials?.twitter,
      config.socials?.github,
      config.socials?.linkedin,
      config.socials?.substack,
      config.socials?.instagram,
    ].filter(Boolean),
    jobTitle: config.tagline,
  }
}

export function generateWebSiteSchema(config: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.seo?.title ?? `${config.owner_name} — ${config.tagline}`,
    description: config.seo?.description ?? config.bio_short,
    url: siteUrl,
    author: {
      '@type': 'Person',
      name: config.owner_name,
    },
  }
}

export function generateProjectSchema(project: Project, config: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/work/${project.slug}`,
    image: project.cover_image_url,
    author: {
      '@type': 'Person',
      name: config.owner_name,
    },
    dateCreated: project.created_at,
    keywords: project.stack?.join(', '),
  }
}

export function generateWritingSchema(writing: Writing, config: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': writing.type === 'poem' ? 'Poem' : 'Article',
    name: writing.title,
    headline: writing.title,
    url: `${siteUrl}/writing/${writing.slug}`,
    image: writing.cover_image_url,
    author: {
      '@type': 'Person',
      name: config.owner_name,
    },
    datePublished: writing.published_at,
    isPartOf: writing.series ? {
      '@type': 'CreativeWorkSeries',
      name: writing.series,
    } : undefined,
  }
}
