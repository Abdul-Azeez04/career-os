import type { MetadataRoute } from 'next'
import { getProjects, getWritings } from '@/lib/data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://abdul-azeez.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/experience`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/certifications`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/work`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/writing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ]

  // Dynamic project pages
  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const projects = await getProjects()
    projectRoutes = projects.map(project => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: new Date(project.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch {
    // Fail gracefully if data unavailable
  }

  // Dynamic writing pages
  let writingRoutes: MetadataRoute.Sitemap = []
  try {
    const writings = await getWritings()
    writingRoutes = writings.map(writing => ({
      url: `${siteUrl}/writing/${writing.slug}`,
      lastModified: new Date(writing.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // Fail gracefully if data unavailable
  }

  return [...staticRoutes, ...projectRoutes, ...writingRoutes]
}
