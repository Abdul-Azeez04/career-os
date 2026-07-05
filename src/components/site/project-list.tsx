"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/site/project-card"
import { Search } from "lucide-react"

export default function ProjectList({ projects }: { projects: any[] }) {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  // Extract all unique stack technologies for filters
  const allStacks = Array.from(
    new Set(projects.flatMap((p) => p.stack || []))
  ).sort()

  // Select top 6 most common stacks for quick filters to avoid clutter
  const stackCounts = allStacks.map(stack => ({
    name: stack,
    count: projects.filter(p => p.stack?.includes(stack)).length
  })).sort((a, b) => b.count - a.count)
  
  const topFilters = ["all", "featured", ...stackCounts.slice(0, 5).map(s => s.name)]

  const filtered = projects.filter((p) => {
    const matchFilter = filter === "all" 
      ? true 
      : filter === "featured" 
        ? p.is_featured 
        : p.stack?.includes(filter)

    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.summary && p.summary.toLowerCase().includes(search.toLowerCase())) ||
      (p.stack && p.stack.some((s: string) => s.toLowerCase().includes(search.toLowerCase())))

    return matchFilter && matchSearch
  })

  // Group by featured if showing all
  const featured = filtered.filter(p => p.is_featured)
  const other = filtered.filter(p => !p.is_featured)
  const isAllView = filter === "all" && !search

  return (
    <div>
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, tech stack..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {topFilters.map(type => (
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
          {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground bg-card rounded-2xl border border-border">
          <p className="text-lg mb-2">No projects found matching your criteria.</p>
          <button onClick={() => { setSearch(""); setFilter("all") }} className="text-primary hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="flex flex-col gap-20">
          {(isAllView ? featured.length > 0 : filtered.length > 0) && (
            <div>
              {isAllView && <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">Featured Projects</h3>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(isAllView ? featured : filtered).map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            </div>
          )}
          
          {isAllView && other.length > 0 && (
            <div>
              <h3 className="text-2xl font-serif font-bold mb-8 text-muted-foreground">Other Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90">
                {other.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
