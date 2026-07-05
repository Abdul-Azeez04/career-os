"use client"

import { useState, useEffect } from "react"
import { clientGetAllBlogPostsAdmin, clientDeleteBlogPost } from "@/lib/data/client-blog"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, Eye, Search } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/content-utils"

const STATUS_TABS = ["all", "published", "draft", "scheduled"]

export default function BlogAdmin() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    clientGetAllBlogPostsAdmin().then(data => { setPosts(data); setLoading(false) })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return
    try { await clientDeleteBlogPost(id); setPosts(prev => prev.filter(p => p.id !== id)); toast.success("Post deleted") }
    catch { toast.error("Failed to delete") }
  }

  const filtered = posts.filter(p => {
    const matchFilter = filter === "all" || p.status === filter
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      published: "bg-green-500/10 text-green-400 border-green-500/20",
      draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    }
    return <span className={`px-2 py-0.5 text-xs rounded-md border capitalize ${styles[status] || ""}`}>{status}</span>
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new" className="flex items-center gap-2 px-4 py-2 bg-[#D4A853] text-[#0A0A0B] font-bold rounded-lg hover:bg-[#D4A853]/90 text-sm">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8E]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="w-full pl-10 pr-4 py-2 bg-[#141416] border border-[#2A2A2D] rounded-lg text-sm" />
        </div>
        <div className="flex gap-1">
          {STATUS_TABS.map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${filter === tab ? "bg-[#D4A853] text-[#0A0A0B]" : "text-[#8A8A8E] hover:text-[#EDEDEF] hover:bg-[#1C1C1F]"}`}>
              {tab} {tab !== "all" && `(${posts.filter(p => p.status === tab).length})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#8A8A8E] bg-[#141416] rounded-xl border border-[#2A2A2D]">
          <p className="text-lg mb-2">No posts found</p>
          <Link href="/admin/blog/new" className="text-[#D4A853] hover:underline">Write your first post →</Link>
        </div>
      ) : (
        <div className="bg-[#141416] border border-[#2A2A2D] rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#0A0A0B]/50 border-b border-[#2A2A2D] text-xs text-[#8A8A8E]">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Views</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2D]">
              {filtered.map(post => (
                <tr key={post.id} className="hover:bg-[#1C1C1F]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium flex items-center gap-2">
                      {post.title}
                      {post.is_featured && <span className="px-1.5 py-0.5 text-[9px] bg-[#D4A853]/20 text-[#D4A853] rounded uppercase font-bold">Featured</span>}
                    </div>
                    <div className="text-xs text-[#8A8A8E] mt-0.5 line-clamp-1">{post.excerpt}</div>
                  </td>
                  <td className="px-6 py-4">{statusBadge(post.status)}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-sm text-[#8A8A8E] capitalize">{post.category || "—"}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-sm text-[#8A8A8E] font-mono">{post.view_count}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-xs text-[#8A8A8E] font-mono">{post.published_at ? formatDate(post.published_at) : "—"}</td>
                  <td className="px-6 py-4 text-right">
                    {post.status === "published" && (
                      <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-[#8A8A8E] hover:text-[#EDEDEF] inline-block"><Eye className="w-4 h-4" /></Link>
                    )}
                    <Link href={`/admin/blog/${post.id}`} className="p-2 text-[#8A8A8E] hover:text-[#D4A853] inline-block"><Edit2 className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-[#8A8A8E] hover:text-red-400 inline-block"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
