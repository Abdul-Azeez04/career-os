"use client"

import { useState } from "react"
import type { BlogPost, BlogTag } from "@/lib/data/blog"
import Link from "next/link"
import { Calendar, Clock, Search, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/content-utils"

export default function BlogIndex({ posts, tags }: { posts: BlogPost[]; tags: BlogTag[] }) {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [showCount, setShowCount] = useState(6)

  const featured = posts.find(p => p.is_featured)
  const filtered = posts.filter(p => {
    const matchTag = filter === "all" || p.tags.includes(filter)
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase()))
    return matchTag && matchSearch
  })
  const visible = filtered.slice(0, showCount)

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-xl text-[#8A8A8E] max-w-2xl">Technical deep-dives, career advice, and development insights.</p>
      </div>

      {/* Featured Post */}
      {featured && !search && filter === "all" && (
        <Link href={`/blog/${featured.slug}`} className="group block mb-16 bg-[#141416] border border-[#2A2A2D] rounded-2xl overflow-hidden hover:border-[#D4A853]/40 transition-all hover:shadow-lg hover:shadow-[#D4A853]/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="aspect-video md:aspect-auto bg-gradient-to-br from-[#D4A853]/20 via-[#1C1C1F] to-[#141416] flex items-center justify-center">
              {featured.cover_image_url ? (
                <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl font-serif font-bold text-[#D4A853]/20">{featured.title[0]}</span>
              )}
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-mono bg-[#D4A853]/10 text-[#D4A853] rounded-full uppercase">Featured</span>
                {featured.category && <span className="text-xs text-[#8A8A8E] capitalize">{featured.category}</span>}
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 group-hover:text-[#D4A853] transition-colors leading-tight">{featured.title}</h2>
              {featured.excerpt && <p className="text-[#8A8A8E] leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>}
              <div className="flex items-center gap-4 text-xs text-[#8A8A8E] font-mono">
                {featured.published_at && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(featured.published_at)}</span>}
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.reading_time_minutes} min read</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8E]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="w-full pl-10 pr-4 py-2.5 bg-[#141416] border border-[#2A2A2D] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A853]/50" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === "all" ? "bg-[#D4A853] text-[#0A0A0B]" : "bg-[#141416] border border-[#2A2A2D] text-[#8A8A8E] hover:text-[#EDEDEF]"}`}>All</button>
          {tags.map(tag => (
            <button key={tag.id} onClick={() => setFilter(tag.slug)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === tag.slug ? "text-[#0A0A0B]" : "bg-[#141416] border border-[#2A2A2D] text-[#8A8A8E] hover:text-[#EDEDEF]"}`} style={filter === tag.slug ? { backgroundColor: tag.color } : undefined}>
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="text-center py-24 text-[#8A8A8E]">
          <p className="text-lg mb-2">No posts found.</p>
          {search && <button onClick={() => setSearch("")} className="text-[#D4A853] hover:underline">Clear search</button>}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-[#141416] border border-[#2A2A2D] rounded-2xl overflow-hidden hover:border-[#D4A853]/40 transition-all hover:shadow-lg hover:shadow-[#D4A853]/5 hover:-translate-y-1 duration-300">
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
            ))}
          </div>
          {filtered.length > showCount && (
            <div className="text-center mt-12">
              <button onClick={() => setShowCount(prev => prev + 6)} className="inline-flex items-center gap-2 px-6 py-3 border border-[#2A2A2D] rounded-lg text-sm font-medium hover:border-[#D4A853] hover:text-[#D4A853] transition-colors">
                Load More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
