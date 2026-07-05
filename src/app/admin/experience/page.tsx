"use client"

import { useState, useEffect } from "react"
import { clientGetAllExperiences, clientCreateExperience, clientUpdateExperience, clientDeleteExperience } from "@/lib/data/client"
import { toast } from "sonner"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Modal, FormField, Input, Textarea, Select, FormActions } from "@/components/admin/modal"

const EXP_TYPES = ["employment", "freelance", "education", "leadership", "other"]

const EMPTY = {
  title: "", org: "", location: "", type: "employment",
  description: "", start_date: "", end_date: "", is_published: true, sort_order: 0
}

export default function ExperienceAdmin() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setItems(await clientGetAllExperiences())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (item: any) => { setEditing(item); setForm(item); setModalOpen(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { await clientUpdateExperience(editing.id, form); toast.success("Updated") }
      else { await clientCreateExperience(form); toast.success("Added") }
      setModalOpen(false); load()
    } catch { toast.error("Save failed") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return
    try { await clientDeleteExperience(id); toast.success("Deleted"); load() }
    catch { toast.error("Delete failed") }
  }

  const f = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }))

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Experience</h1>
          <p className="text-muted-foreground mt-1">{items.length} entries</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Role & Org</th>
              <th className="px-6 py-3">Period</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map(exp => (
              <tr key={exp.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono px-2 py-1 bg-secondary text-secondary-foreground rounded-md uppercase">{exp.type}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold">{exp.title}</div>
                  <div className="text-sm text-muted-foreground">{exp.org}</div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                  {exp.start_date ? new Date(exp.start_date).getFullYear() : "?"} – {exp.end_date ? new Date(exp.end_date).getFullYear() : "Present"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(exp)} className="p-2 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Experience" : "Add Experience"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Title / Role">
              <Input value={form.title} onChange={e => f("title", e.target.value)} placeholder="Software Engineer" required />
            </FormField>
            <FormField label="Organization">
              <Input value={form.org} onChange={e => f("org", e.target.value)} placeholder="Company / School" required />
            </FormField>
            <FormField label="Type">
              <Select value={form.type} onChange={e => f("type", e.target.value)}>
                {EXP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </FormField>
            <FormField label="Location">
              <Input value={form.location || ""} onChange={e => f("location", e.target.value)} placeholder="Lagos, Nigeria (Remote)" />
            </FormField>
            <FormField label="Start Date">
              <Input type="date" value={form.start_date || ""} onChange={e => f("start_date", e.target.value)} />
            </FormField>
            <FormField label="End Date (leave blank for current)">
              <Input type="date" value={form.end_date || ""} onChange={e => f("end_date", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Description (Markdown supported)">
            <Textarea value={form.description || ""} onChange={e => f("description", e.target.value)} rows={5} placeholder="Key responsibilities and achievements..." />
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
