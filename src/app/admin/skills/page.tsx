"use client"

import { useState, useEffect } from "react"
import { clientGetSkills, clientCreateSkill, clientUpdateSkill, clientDeleteSkill } from "@/lib/data/client"
import { toast } from "sonner"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Modal, FormField, Input, Select, FormActions } from "@/components/admin/modal"

const CATEGORIES = ["language", "framework", "tool", "creative", "other"]

const EMPTY_SKILL = { name: "", category: "framework", proficiency: 3, sort_order: 0 }

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY_SKILL)
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    setLoading(true)
    const data = await clientGetSkills()
    setSkills(data)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_SKILL)
    setModalOpen(true)
  }

  const openEdit = (skill: any) => {
    setEditing(skill)
    setForm({ name: skill.name, category: skill.category, proficiency: skill.proficiency, sort_order: skill.sort_order })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await clientUpdateSkill(editing.id, form)
        toast.success("Skill updated")
      } else {
        await clientCreateSkill(form)
        toast.success("Skill added")
      }
      setModalOpen(false)
      loadData()
    } catch {
      toast.error("Failed to save skill")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return
    try {
      await clientDeleteSkill(id)
      toast.success("Deleted")
      loadData()
    } catch {
      toast.error("Failed to delete")
    }
  }

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading skills...</div>

  const categories = Array.from(new Set(skills.map(s => s.category || "other")))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Skills</h1>
          <p className="text-muted-foreground mt-1">{skills.length} skills across {categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      <div className="space-y-6">
        {CATEGORIES.filter(cat => skills.some(s => (s.category || "other") === cat)).map(cat => (
          <div key={cat} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-3 border-b border-border bg-muted/50">
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground">{cat}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.filter(s => (s.category || "other") === cat).map(skill => (
                <div key={skill.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background group hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <div key={lvl} className={`w-1.5 h-1.5 rounded-full transition-colors ${lvl <= skill.proficiency ? "bg-primary" : "bg-border"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(skill)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Skill" : "Add Skill"} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Skill Name">
            <Input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. TypeScript"
              required
            />
          </FormField>
          <FormField label="Category">
            <Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label={`Proficiency: ${form.proficiency}/5`}>
            <input
              type="range"
              min={1} max={5} step={1}
              value={form.proficiency}
              onChange={e => setForm({ ...form, proficiency: Number(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Beginner</span><span>Expert</span>
            </div>
          </FormField>
          <FormField label="Sort Order">
            <Input
              type="number"
              value={form.sort_order}
              onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </FormField>
          <FormActions onCancel={() => setModalOpen(false)} saving={saving} saveLabel={editing ? "Update Skill" : "Add Skill"} />
        </form>
      </Modal>
    </div>
  )
}
