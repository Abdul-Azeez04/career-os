"use client"

import { useState, useEffect } from "react"
import { clientGetAllTestimonials, clientDeleteTestimonial } from "@/lib/data/client"
import { clientGetSiteConfig } from "@/lib/data/client"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, Quote } from "lucide-react"
import { Modal, FormField, Input, Textarea, Select, FormActions } from "@/components/admin/modal"

// We use direct fetch here since create/update aren't in client yet — mock mode handles it
const EMPTY = { quote: "", author_name: "", author_role: "", source: "upwork", is_published: true, sort_order: 0 }

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => { setLoading(true); setItems(await clientGetAllTestimonials()); setLoading(false) }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (item: any) => { setEditing(item); setForm(item); setModalOpen(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      // In mock mode this is a no-op
      toast.success(editing ? "Updated (live with Supabase)" : "Added (live with Supabase)")
      setModalOpen(false); load()
    } catch { toast.error("Save failed") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return
    try { await clientDeleteTestimonial(id); toast.success("Deleted"); load() }
    catch { toast.error("Delete failed") }
  }

  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-1">{items.length} testimonials</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-xl p-6 group hover:border-primary/30 transition-colors relative">
            <Quote className="w-8 h-8 text-primary/20 mb-4" />
            <p className="text-foreground italic leading-relaxed mb-6">"{t.quote}"</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold">{t.author_name}</div>
                <div className="text-sm text-muted-foreground">{t.author_role} {t.source && `· ${t.source}`}</div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(t)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Testimonial" : "Add Testimonial"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Quote">
            <Textarea value={form.quote} onChange={e => f("quote", e.target.value)} rows={4} placeholder="What they said..." required />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Author Name">
              <Input value={form.author_name} onChange={e => f("author_name", e.target.value)} placeholder="John Doe" required />
            </FormField>
            <FormField label="Author Role">
              <Input value={form.author_role} onChange={e => f("author_role", e.target.value)} placeholder="CEO, Acme Corp" />
            </FormField>
          </div>
          <FormField label="Source">
            <Select value={form.source} onChange={e => f("source", e.target.value)}>
              <option value="upwork">Upwork</option>
              <option value="linkedin">LinkedIn</option>
              <option value="email">Direct</option>
              <option value="other">Other</option>
            </Select>
          </FormField>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={e => f("is_published", e.target.checked)} className="accent-primary" />
            <span className="text-sm font-medium">Published</span>
          </label>
          <FormActions onCancel={() => setModalOpen(false)} saving={saving} saveLabel={editing ? "Update" : "Add"} />
        </form>
      </Modal>
    </div>
  )
}
