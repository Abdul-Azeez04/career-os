"use client"

import { useState, useEffect } from "react"
import { clientGetAllBlogTags, clientCreateBlogTag, clientDeleteBlogTag } from "@/lib/data/client-blog"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"
import { slugify } from "@/lib/content-utils"

const PRESET_COLORS = [
  "#D4A853", // Gold (Primary)
  "#8B5CF6", // Purple
  "#0EA5E9", // Sky Blue
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#22C55E", // Green
]

export default function TagsAdmin() {
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])

  useEffect(() => {
    clientGetAllBlogTags().then(data => { setTags(data); setLoading(false) })
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    try {
      const tag = await clientCreateBlogTag({
        name: newName,
        slug: slugify(newName),
        color: newColor,
      })
      setTags(prev => [...prev, tag])
      setNewName("")
      toast.success("Tag created")
    } catch { toast.error("Failed to create tag") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag?")) return
    try {
      await clientDeleteBlogTag(id)
      setTags(prev => prev.filter(t => t.id !== id))
      toast.success("Tag deleted")
    } catch { toast.error("Failed to delete") }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Blog Tags</h1>

      <div className="bg-[#141416] border border-[#2A2A2D] rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-4">Create New Tag</h2>
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">Tag Name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Next.js" className="w-full px-3 py-2 bg-[#0A0A0B] border border-[#2A2A2D] rounded-lg text-sm" required />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-xs font-medium text-[#8A8A8E] mb-2">Color</label>
            <div className="flex gap-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color} type="button"
                  onClick={() => setNewColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${newColor === color ? "border-[#EDEDEF] scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving || !newName.trim()} className="px-6 py-2 bg-[#D4A853] text-[#0A0A0B] font-bold rounded-lg hover:bg-[#D4A853]/90 disabled:opacity-50 whitespace-nowrap flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create
          </button>
        </form>
      </div>

      <div className="bg-[#141416] border border-[#2A2A2D] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#0A0A0B]/50 border-b border-[#2A2A2D] text-xs text-[#8A8A8E]">
            <tr>
              <th className="px-6 py-3 font-medium">Tag</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium hidden md:table-cell">Created</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2D]">
            {tags.map(tag => (
              <tr key={tag.id} className="hover:bg-[#1C1C1F]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                    <span className="font-bold">{tag.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#8A8A8E] font-mono">{tag.slug}</td>
                <td className="px-6 py-4 hidden md:table-cell text-sm text-[#8A8A8E] font-mono">{new Date(tag.created_at).toISOString().split("T")[0]}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(tag.id)} className="p-2 text-[#8A8A8E] hover:text-red-400 inline-block"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#8A8A8E]">No tags created yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
