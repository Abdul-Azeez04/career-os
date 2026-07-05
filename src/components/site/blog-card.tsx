import Link from "next/link"
import type { BlogPost } from "@/lib/data/blog"
import { Calendar, Clock } from "lucide-react"
import { formatDate } from "@/lib/content-utils"

export default function BlogCard({ post, variant = "default" }: { post: BlogPost; variant?: "default" | "featured" }) {
  if (variant === "featured") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block bg-[#141416] border border-[#2A2A2D] rounded-2xl overflow-hidden hover:border-[#D4A853]/40 transition-all hover:shadow-lg hover:shadow-[#D4A853]/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="aspect-video md:aspect-auto bg-gradient-to-br from-[#D4A853]/20 via-[#1C1C1F] to-[#141416] flex items-center justify-center">
            {post.cover_image_url ? (
              <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl font-serif font-bold text-[#D4A853]/20">{post.title[0]}</span>
            )}
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-mono bg-[#D4A853]/10 text-[#D4A853] rounded-full uppercase">Featured</span>
              {post.category && <span className="text-xs text-[#8A8A8E] capitalize">{post.category}</span>}
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 group-hover:text-[#D4A853] transition-colors leading-tight">{post.title}</h2>
            {post.excerpt && <p className="text-[#8A8A8E] leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>}
            <div className="flex items-center gap-4 text-xs text-[#8A8A8E] font-mono">
              {post.published_at && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.published_at)}</span>}
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time_minutes} min read</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block bg-[#141416] border border-[#2A2A2D] rounded-2xl overflow-hidden hover:border-[#D4A853]/40 transition-all hover:shadow-lg hover:shadow-[#D4A853]/5 hover:-translate-y-1 duration-300">
      <div className="aspect-video bg-gradient-to-br from-[#1C1C1F] to-[#0A0A0B] flex items-center justify-center">
        {post.cover_image_url ? (
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl font-serif font-bold text-[#2A2A2D]">{post.title[0]}</span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {post.category && <span className="text-xs font-mono uppercase text-[#D4A853] bg-[#D4A853]/10 px-2 py-0.5 rounded-full">{post.category}</span>}
          {post.tags.slice(0, 2).map(t => <span key={t} className="text-xs text-[#8A8A8E]">#{t}</span>)}
        </div>
        <h3 className="text-lg font-bold mb-3 group-hover:text-[#D4A853] transition-colors leading-snug line-clamp-2">{post.title}</h3>
        {post.excerpt && <p className="text-sm text-[#8A8A8E] leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>}
        <div className="flex items-center gap-3 text-xs text-[#8A8A8E] font-mono">
          {post.published_at && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.published_at)}</span>}
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time_minutes} min</span>
        </div>
      </div>
    </Link>
  )
}
