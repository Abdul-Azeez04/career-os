"use client"

import { useState, useEffect, useRef } from "react"
import { Search as SearchIcon, Command, X, FileText, Briefcase, PenTool } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>({ projects: [], writing: [], blog: [] })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
      setResults({ projects: [], writing: [], blog: [] })
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ projects: [], writing: [], blog: [] })
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const { createBrowserClient } = await import("@supabase/ssr")
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const [projects, writing, blog] = await Promise.all([
          supabase.from("projects").select("id, title, slug").ilike("title", `%${query}%`).eq("status", "published").limit(3),
          supabase.from("writings").select("id, title, slug, type").ilike("title", `%${query}%`).eq("status", "published").limit(3),
          supabase.from("blog_posts").select("id, title, slug, category").ilike("title", `%${query}%`).eq("status", "published").limit(3)
        ])

        setResults({
          projects: projects.data || [],
          writing: writing.data || [],
          blog: blog.data || []
        })
      } catch (e) {
        // Silently fail search if mock or error
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(search, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (url: string) => {
    setIsOpen(false)
    router.push(url)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 p-2 rounded-lg text-[#8A8A8E] hover:text-[#EDEDEF] hover:bg-[#1C1C1F] transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5" />
        <span className="hidden md:flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded border border-[#2A2A2D] bg-[#0A0A0B]">
          <Command className="w-3 h-3" /> K
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-32">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#141416] border border-[#2A2A2D] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center px-4 py-3 border-b border-[#2A2A2D]">
              <SearchIcon className="w-5 h-5 text-[#8A8A8E] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent border-none px-4 text-[#EDEDEF] placeholder-[#8A8A8E] focus:outline-none"
              />
              <button onClick={() => setIsOpen(false)} className="p-1 text-[#8A8A8E] hover:text-[#EDEDEF] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!query ? (
                <div className="p-8 text-center text-sm text-[#8A8A8E]">Type to start searching...</div>
              ) : loading ? (
                <div className="p-8 text-center text-sm text-[#8A8A8E]">Searching...</div>
              ) : Object.values(results).every((arr: any) => arr.length === 0) ? (
                <div className="p-8 text-center text-sm text-[#8A8A8E]">No results found for "{query}"</div>
              ) : (
                <div className="space-y-4">
                  {results.blog.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-xs font-bold text-[#8A8A8E] uppercase tracking-wider">Blog</div>
                      {results.blog.map((item: any) => (
                        <button key={item.id} onClick={() => handleSelect(`/blog/${item.slug}`)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1C1C1F] text-left transition-colors">
                          <PenTool className="w-4 h-4 text-[#D4A853]" />
                          <div className="flex-1 truncate">{item.title}</div>
                          <div className="text-xs text-[#8A8A8E] font-mono capitalize shrink-0">{item.category}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.projects.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-xs font-bold text-[#8A8A8E] uppercase tracking-wider">Projects</div>
                      {results.projects.map((item: any) => (
                        <button key={item.id} onClick={() => handleSelect(`/work/${item.slug}`)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1C1C1F] text-left transition-colors">
                          <Briefcase className="w-4 h-4 text-blue-400" />
                          <div className="flex-1 truncate">{item.title}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.writing.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-xs font-bold text-[#8A8A8E] uppercase tracking-wider">Writing</div>
                      {results.writing.map((item: any) => (
                        <button key={item.id} onClick={() => handleSelect(`/writing/${item.slug}`)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1C1C1F] text-left transition-colors">
                          <FileText className="w-4 h-4 text-green-400" />
                          <div className="flex-1 truncate">{item.title}</div>
                          <div className="text-xs text-[#8A8A8E] font-mono capitalize shrink-0">{item.type}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-4 py-3 bg-[#0A0A0B] border-t border-[#2A2A2D] flex items-center justify-between text-xs text-[#8A8A8E] font-mono">
              <div className="flex items-center gap-2">
                <span>navigate</span>
                <span className="px-1.5 rounded border border-[#2A2A2D]">↑</span>
                <span className="px-1.5 rounded border border-[#2A2A2D]">↓</span>
              </div>
              <div className="flex items-center gap-2">
                <span>select</span>
                <span className="px-1.5 rounded border border-[#2A2A2D]">enter</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
