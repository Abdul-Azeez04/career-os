"use client"

import { useState, useEffect } from "react"
import { clientGetAllCertifications, clientCreateCertification, clientUpdateCertification, clientDeleteCertification } from "@/lib/data/client"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react"
import { Modal, FormField, Input, FormActions } from "@/components/admin/modal"

const EMPTY = { title: "", issuer: "", issue_date: "", expiry_date: "", credential_id: "", credential_url: "", badge_url: "", is_published: true, sort_order: 0 }

export default function CertAdmin() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => { setLoading(true); setItems(await clientGetAllCertifications()); setLoading(false) }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (item: any) => { setEditing(item); setForm(item); setModalOpen(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { await clientUpdateCertification(editing.id, form); toast.success("Updated") }
      else { await clientCreateCertification(form); toast.success("Added") }
      setModalOpen(false); load()
    } catch { toast.error("Save failed") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return
    try { await clientDeleteCertification(id); toast.success("Deleted"); load() }
    catch { toast.error("Delete failed") }
  }

  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Certifications</h1>
          <p className="text-muted-foreground mt-1">{items.length} certifications</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(cert => (
          <div key={cert.id} className="bg-card border border-border rounded-xl p-5 group hover:border-primary/30 transition-colors">
            {cert.badge_url ? (
              <img src={cert.badge_url} alt={cert.title} className="w-16 h-16 object-contain mb-4 rounded-lg" />
            ) : (
              <div className="w-16 h-16 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-serif font-bold text-primary">{cert.title[0]}</span>
              </div>
            )}
            <div className="font-bold mb-1">{cert.title}</div>
            <div className="text-sm text-muted-foreground mb-1">{cert.issuer}</div>
            {cert.issue_date && (
              <div className="text-xs font-mono text-muted-foreground mb-3">
                {new Date(cert.issue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
            )}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {cert.credential_url && (
                <a href={cert.credential_url} target="_blank" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => openEdit(cert)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cert.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Certification" : "Add Certification"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Title">
            <Input value={form.title} onChange={e => f("title", e.target.value)} placeholder="AWS Certified Developer" required />
          </FormField>
          <FormField label="Issuing Body">
            <Input value={form.issuer} onChange={e => f("issuer", e.target.value)} placeholder="Amazon Web Services" required />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Issue Date">
              <Input type="date" value={form.issue_date || ""} onChange={e => f("issue_date", e.target.value)} />
            </FormField>
            <FormField label="Expiry Date">
              <Input type="date" value={form.expiry_date || ""} onChange={e => f("expiry_date", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Credential URL">
            <Input type="url" value={form.credential_url || ""} onChange={e => f("credential_url", e.target.value)} placeholder="https://..." />
          </FormField>
          <FormField label="Badge Image URL">
            <Input type="url" value={form.badge_url || ""} onChange={e => f("badge_url", e.target.value)} placeholder="https://..." />
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
