"use client"

import { useState, useEffect, use } from "react"
import { clientGetBlogPostById, clientUpdateBlogPost, clientCreateBlogPost, clientGetAllBlogTags, clientCreateBlogTag } from "@/lib/data/client-blog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, Plus, X } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { slugify } from "@/lib/content-utils"

const RichTextEditor = dynamic(() => import("@/components/admin/rich-text-editor"), { ssr: false, loading: () => <div className="h-[400px] bg-[#141416] border border-[#2A2A2D] rounded-xl animate-pulse" /> })

export default function BlogPostEditor({ params }: any) {
  const unwrappedParams = use(params) as { id: string }
  const isNew = unwrappedParams.id === "new"
  const router = useRouter()

  const [post, setPost] = useState<any>({
    title: "", slug: "", excerpt: "", cover_image_url: "",
    body_html: "", body_markdown: "", category: "",
    tags: [], status: "draft", scheduled_at: "",
    published_at: "", reading_time_minutes: 0,
    seo_title: "", seo_description: "", og_image_url: "",
    is_featured: false,
  })
  const [allTags, setAllTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSEO, setShowSEO] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [autoSlug, setAutoSlug] = useState(true)

  useEffect(() => {
    Promise.all([
      isNew ? Promise.resolve(null) : clientGetBlogPostById(unwrappedParams.id),
      clientGetAllBlogTags(),
    ]).then(([postData, tags]) => {
      if (postData) { setPost(postData); setAutoSlug(false) }
      setAllTags(tags)
      setLoading(false)
    })
  }, [unwrappedParams.id, isNew])

  const handleChange = (field: string, value: any) => {
    setPost((prev: any) => {
      const next = { ...prev, [field]: value }
      if (field === "title" && autoSlug) next.slug = slugify(value)
      return next
    })
  }

  const handleBodyChange = (html: string) => {
    const wordCount = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
    setPost((prev: any) => ({
      ...prev,
      body_html: html,
      reading_time_minutes: Math.max(1, Math.ceil(wordCount / 220)),
    }))
  }

  const toggleTag = (tagSlug: string) => {
    setPost((prev: any) => ({
      ...prev,
      tags: prev.tags.includes(tagSlug) ? prev.tags.filter((t: string) => t !== tagSlug) : [...prev.tags, tagSlug],
    }))
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return
    try {
      const tag = await clientCreateBlogTag({ name: newTagName, slug: slugify(newTagName) })
      setAllTags(prev => [...prev, tag])
      setPost((prev: any) => ({ ...prev, tags: [...prev.tags, tag.slug] }))
      setNewTagName("")
      toast.success("Tag created")
    } catch { toast.error("Failed to create tag") }
  }

  const handleSave = async (publish = false) => {
    if (!post.title || !post.slug) { toast.error("Title and slug are required"); return }
    setSaving(true)
    try {
      const payload = {
        ...post,
        status: publish ? "published" : post.status,
        published_at: publish && !post.published_at ? new Date().toISOString() : post.published_at || null,
        scheduled_at: post.scheduled_at || null,
        cover_image_url: post.cover_image_url || null,
        seo_title: post.seo_title || null,
        seo_description: post.seo_description || null,
        og_image_url: post.og_image_url || null,
      }
      if (isNew) {
        await clientCreateBlogPost(payload)
        toast.success("Post created!")
        router.push("/admin/blog")
      } else {
        await clientUpdateBlogPost(post.id, payload)
        toast.success(publish ? "Published!" : "Saved!")
      }
    } catch { toast.error("Failed to save") }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-5xl pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin/blog" className="flex items-center gap-2 text-[#8A8A8E] hover:text-[#EDEDEF] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#8A8A8E]">{post.reading_time_minutes} min read</span>
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 border border-[#2A2A2D] rounded-lg hover:bg-[#1C1C1F] text-sm font-medium disabled:opacity-50">
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="px-4 py-2 bg-[#D4A853] text-[#0A0A0B] rounded-lg text-sm font-bold hover:bg-[#D4A853]/90 disabled:opacity-50">
            Publish
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text" value={post.title} onChange={e => handleChange("title", e.target.value)}
        placeholder="Post title..."
        className="w-full bg-transparent border-none text-4xl font-serif font-bold text-[#EDEDEF] placeholder-[#2A2A2D] focus:outline-none mb-2"
      />

      {/* Slug */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-xs text-[#8A8A8E] font-mono">/blog/</span>
        <input
          type="text" value={post.slug}
          onChange={e => { setAutoSlug(false); handleChange("slug", e.target.value) }}
          className="bg-transparent border-none text-xs text-[#8A8A8E] font-mono focus:outline-none focus:text-[#EDEDEF]"
        />
      </div>

      {/* Metadata row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-xs font-medium text-[#8A8A8E] mb-1">Status</label>
          <select value={post.status} onChange={e => handleChange("status", e.target.value)} className="w-full px-3 py-2 bg-[#141416] border border-[#2A2A2D] rounded-lg text-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#8A8A8E] mb-1">Category</label>
          <input type="text" value={post.category || ""} onChange={e => handleChange("category", e.target.value)} placeholder="tutorial, opinion..." className="w-full px-3 py-2 bg-[#141416] border border-[#2A2A2D] rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#8A8A8E] mb-1">Cover Image URL</label>
          <input type="text" value={post.cover_image_url || ""} onChange={e => handleChange("cover_image_url", e.target.value)} className="w-full px-3 py-2 bg-[#141416] border border-[#2A2A2D] rounded-lg text-sm" />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={post.is_featured} onChange={e => handleChange("is_featured", e.target.checked)} className="rounded" />
            <span className="text-sm">Featured</span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <label className="block text-xs font-medium text-[#8A8A8E] mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {allTags.map(tag => (
            <button key={tag.id} onClick={() => toggleTag(tag.slug)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${post.tags.includes(tag.slug) ? "border-[#D4A853] bg-[#D4A853]/10 text-[#D4A853]" : "border-[#2A2A2D] text-[#8A8A8E] hover:border-[#8A8A8E]"}`}>
              {tag.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newTagName} onChange={e => setNewTagName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreateTag()} placeholder="New tag..." className="px-3 py-1.5 bg-[#141416] border border-[#2A2A2D] rounded-lg text-xs w-40" />
          <button onClick={handleCreateTag} className="px-2 py-1.5 text-xs border border-[#2A2A2D] rounded-lg hover:bg-[#1C1C1F]"><Plus className="w-3 h-3" /></button>
        </div>
      </div>

      {/* Excerpt */}
      <div className="mb-8">
        <label className="block text-xs font-medium text-[#8A8A8E] mb-1">Excerpt</label>
        <textarea value={post.excerpt || ""} onChange={e => handleChange("excerpt", e.target.value)} rows={2} placeholder="Brief summary for previews and SEO..." className="w-full px-4 py-3 bg-[#141416] border border-[#2A2A2D] rounded-lg text-sm resize-none" />
      </div>

      {/* Editor */}
      <div className="mb-8">
        <RichTextEditor content={post.body_html || ""} onChange={handleBodyChange} placeholder="Write your post..." />
      </div>

      {/* SEO Panel */}
      <div className="border border-[#2A2A2D] rounded-xl overflow-hidden">
        <button onClick={() => setShowSEO(!showSEO)} className="flex items-center justify-between w-full px-6 py-4 text-sm font-medium hover:bg-[#141416] transition-colors">
          <span>SEO Settings</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showSEO ? "rotate-180" : ""}`} />
        </button>
        {showSEO && (
          <div className="px-6 pb-6 space-y-4 border-t border-[#2A2A2D]">
            <div className="pt-4">
              <label className="block text-xs font-medium text-[#8A8A8E] mb-1">SEO Title</label>
              <input type="text" value={post.seo_title || ""} onChange={e => handleChange("seo_title", e.target.value)} className="w-full px-3 py-2 bg-[#141416] border border-[#2A2A2D] rounded-lg text-sm" placeholder={post.title || "Custom SEO title..."} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8A8A8E] mb-1">SEO Description</label>
              <textarea value={post.seo_description || ""} onChange={e => handleChange("seo_description", e.target.value)} rows={2} className="w-full px-3 py-2 bg-[#141416] border border-[#2A2A2D] rounded-lg text-sm resize-none" placeholder={post.excerpt || "Custom meta description..."} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
