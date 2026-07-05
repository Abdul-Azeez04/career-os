import { getBlogPosts } from "@/lib/data/blog"
import { getWritings, getSiteConfig } from "@/lib/data"

export async function GET() {
  const [posts, writings, config] = await Promise.all([
    getBlogPosts(),
    getWritings(),
    getSiteConfig(),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const items = [
    ...posts.map(p => ({
      title: p.title,
      link: `${siteUrl}/blog/${p.slug}`,
      description: p.excerpt || p.title,
      pubDate: p.published_at ? new Date(p.published_at).toUTCString() : new Date().toUTCString(),
      category: p.category || "blog",
    })),
    ...writings.map(w => ({
      title: w.title,
      link: `${siteUrl}/writing/${w.slug}`,
      description: w.body_markdown?.substring(0, 200) || w.title,
      pubDate: new Date(w.published_at).toUTCString(),
      category: w.type,
    })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${config.owner_name}'s Blog</title>
    <link>${siteUrl}</link>
    <description>${config.bio_short || config.tagline || ""}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      <category>${item.category}</category>
      <guid isPermaLink="true">${item.link}</guid>
    </item>`).join("")}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
