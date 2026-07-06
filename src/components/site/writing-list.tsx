"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, Calendar, Search } from "lucide-react"
import { readingTime, formatDateShort } from "@/lib/content-utils"

const TYPE_FILTERS = ["all", "post", "essay", "poem", "excerpt"]

export default function WritingPage({ writings }: { writings: any[] }) {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = writings.filter((w) => {
    const matchType = filter === "all" || w.type === filter
    const matchSearch = !search ||
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      (w.series && w.series.toLowerCase().includes(search.toLowerCase()))
    return matchType && matchSearch
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search writing..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-sm text-muted-foreground mb-6">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-lg">No writing found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((writing, i) => (
            <Link
              key={writing.id}
              href={`/writing/${writing.slug}`}
              className="group block bg-card border border-border rounded-2xl p-7 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 duration-300"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                  {writing.type}
                </span>
                {writing.series && (
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    {writing.series}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-serif font-bold leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-3">
                {writing.title}
              </h3>
              {writing.body_markdown && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                  {writing.body_markdown.replace(/[#*`>\-\[\]]/g, "").substring(0, 140)}...
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mt-auto">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {formatDateShort(writing.published_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {readingTime(writing.body_markdown)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
