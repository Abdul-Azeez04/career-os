"use client"

import { useState, useEffect, use } from "react"
import { clientGetWritingById, clientUpdateWriting, clientCreateWriting } from "@/lib/data/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function WritingEditor({ params }: any) {
  const unwrappedParams = use(params) as { id: string }
  const isNew = unwrappedParams.id === "new"
  const router = useRouter()
  
  const [writing, setWriting] = useState<any>({
    title: "", slug: "", type: "post", series: "", body_markdown: "",
    external_url: "", published_at: new Date().toISOString(), is_published: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) {
      setLoading(false)
      return
    }
    clientGetWritingById(unwrappedParams.id).then(data => {
      if (data) setWriting(data)
      setLoading(false)
    })
  }, [unwrappedParams.id, isNew])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (isNew) {
        await clientCreateWriting(writing)
        toast.success("Piece created")
        router.push("/admin/writing")
      } else {
        await clientUpdateWriting(writing.id, writing)
        toast.success("Piece updated")
      }
    } catch (e) {
      toast.error("Failed to save piece")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  const handleChange = (field: string, value: any) => setWriting({ ...writing, [field]: value })

  return (
    <div className="max-w-4xl pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">{isNew ? 'New Piece' : 'Edit Piece'}</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/writing')} className="px-4 py-2 border border-border rounded-md hover:bg-muted">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Piece'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-card border border-border p-6 rounded-xl space-y-4">
          <h2 className="font-bold text-xl mb-4">Metadata</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={writing.title} onChange={e => handleChange('title', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input type="text" value={writing.slug} onChange={e => handleChange('slug', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={writing.type} onChange={e => handleChange('type', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md">
                <option value="post">Post</option>
                <option value="essay">Essay</option>
                <option value="poem">Poem</option>
                <option value="excerpt">Excerpt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Series</label>
              <input type="text" value={writing.series || ''} onChange={e => handleChange('series', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-4">
          <h2 className="font-bold text-xl mb-4">Content (Markdown)</h2>
          <textarea 
            value={writing.body_markdown} 
            onChange={e => handleChange('body_markdown', e.target.value)} 
            rows={20} 
            className="w-full px-4 py-4 bg-background border border-border rounded-md font-mono text-sm leading-relaxed" 
          />
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-4">
          <h2 className="font-bold text-xl mb-4">Publishing</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">External Link</label>
            <input type="url" value={writing.external_url || ''} onChange={e => handleChange('external_url', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={writing.is_published} onChange={e => handleChange('is_published', e.target.checked)} className="rounded border-border text-primary" />
            <span className="text-sm font-medium">Published</span>
          </div>
        </div>
      </div>
    </div>
  )
}
