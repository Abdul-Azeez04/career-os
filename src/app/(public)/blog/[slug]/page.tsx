import { getBlogPostBySlug, getBlogPosts, getRelatedBlogPosts, trackPageView } from "@/lib/data/blog"
import { getSiteConfig } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Share2, Eye } from "lucide-react"
import { formatDate } from "@/lib/content-utils"
import { TwitterIcon, LinkedinIcon } from "@/components/site/brand-icons"
import { Metadata } from "next"



export async function generateMetadata({ params }: any): Promise<Metadata> {
  const p = await params
  const post = await getBlogPostBySlug(p.slug)
  if (!post) return {}
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || "",
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || "",
      type: "article",
      publishedTime: post.published_at || undefined,
    },
  }
}

export default async function BlogPostPage({ params }: any) {
  const p = await params
  const [post, config] = await Promise.all([
    getBlogPostBySlug(p.slug),
    getSiteConfig(),
  ])
  if (!post) notFound()

  // Track page view
  await trackPageView(`/blog/${post.slug}`)

  const related = await getRelatedBlogPosts(post.id, post.tags)
  const date = post.published_at ? formatDate(post.published_at) : ""

  return (
    <article className="pb-32">
      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="w-full h-64 md:h-96 bg-[#141416] overflow-hidden">
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 max-w-3xl pt-12">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#8A8A8E] hover:text-[#D4A853] transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {post.category && (
              <span className="text-xs font-mono px-3 py-1 bg-[#D4A853]/10 text-[#D4A853] rounded-full uppercase tracking-wider">{post.category}</span>
            )}
            {post.tags.map(tag => (
              <Link key={tag} href={`/blog/tag/${tag}`} className="text-xs font-mono px-3 py-1 bg-[#1C1C1F] text-[#8A8A8E] rounded-full hover:text-[#D4A853] transition-colors">#{tag}</Link>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-6 leading-[1.1]">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-[#8A8A8E] leading-relaxed mb-8">{post.excerpt}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-[#8A8A8E] font-mono border-t border-b border-[#2A2A2D] py-4">
            <span className="font-medium text-[#EDEDEF]">{config.owner_name}</span>
            {date && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{date}</span>}
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.reading_time_minutes} min read</span>
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{post.view_count} views</span>
          </div>
        </header>

        {/* Body */}
        {post.body_html && (
          <div className="prose-custom" dangerouslySetInnerHTML={{ __html: post.body_html }} />
        )}

        {/* Share */}
        <div className="mt-16 pt-8 border-t border-[#2A2A2D] flex items-center gap-4">
          <span className="text-sm text-[#8A8A8E] flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</span>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`/blog/${post.slug}`)}`} target="_blank" className="p-2.5 rounded-full border border-[#2A2A2D] hover:border-[#D4A853] hover:text-[#D4A853] transition-colors text-[#8A8A8E]">
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/blog/${post.slug}`)}`} target="_blank" className="p-2.5 rounded-full border border-[#2A2A2D] hover:border-[#D4A853] hover:text-[#D4A853] transition-colors text-[#8A8A8E]">
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href) }} className="p-2.5 rounded-full border border-[#2A2A2D] hover:border-[#D4A853] hover:text-[#D4A853] transition-colors text-[#8A8A8E] text-xs">Copy Link</button>
        </div>

        {/* Author */}
        <div className="mt-12 p-6 bg-[#141416] border border-[#2A2A2D] rounded-2xl flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A853] to-[#D4A853]/50 flex items-center justify-center text-2xl font-serif font-bold text-[#0A0A0B] shrink-0">
            {config.owner_name[0]}
          </div>
          <div>
            <div className="font-bold text-lg">{config.owner_name}</div>
            <div className="text-sm text-[#8A8A8E]">{config.tagline}</div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#2A2A2D]">
            <h3 className="text-lg font-bold mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map(p => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group p-5 border border-[#2A2A2D] rounded-xl hover:border-[#D4A853]/50 transition-colors bg-[#141416]">
                  <div className="text-xs font-mono text-[#8A8A8E] uppercase mb-2">{p.category}</div>
                  <div className="font-bold group-hover:text-[#D4A853] transition-colors leading-snug">{p.title}</div>
                  <div className="text-xs text-[#8A8A8E] mt-2">{p.reading_time_minutes} min read</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
