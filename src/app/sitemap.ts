import { MetadataRoute } from "next"
import { getProjects, getWritings } from "@/lib/data"
import { getBlogPosts } from "@/lib/data/blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, writings, posts] = await Promise.all([
    getProjects(),
    getWritings(),
    getBlogPosts()
  ])

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const routes = [
    "",
    "/about",
    "/experience",
    "/certifications",
    "/work",
    "/writing",
    "/blog",
    "/services",
    "/resume",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  const projectRoutes = projects.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const writingRoutes = writings.map((w) => ({
    url: `${baseUrl}/writing/${w.slug}`,
    lastModified: new Date(w.updated_at || w.created_at || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...routes, ...projectRoutes, ...writingRoutes, ...blogRoutes]
}
