"use client"

import { useState, useEffect, use } from "react"
import { clientGetProjectById, clientUpdateProject, clientCreateProject } from "@/lib/data/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ProjectEditor({ params }: any) {
  const unwrappedParams = use(params) as { id: string }
  const isNew = unwrappedParams.id === "new"
  const router = useRouter()
  
  const [project, setProject] = useState<any>({
    title: "", slug: "", summary: "", problem: "", solution: "", outcome: "",
    stack: [], role: "", live_url: "", repo_url: "", is_featured: false, is_published: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) {
      setLoading(false)
      return
    }
    clientGetProjectById(unwrappedParams.id).then(data => {
      if (data) setProject(data)
      setLoading(false)
    })
  }, [unwrappedParams.id, isNew])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (isNew) {
        await clientCreateProject(project)
        toast.success("Project created")
        router.push("/admin/projects")
      } else {
        await clientUpdateProject(project.id, project)
        toast.success("Project updated")
      }
    } catch (e) {
      toast.error("Failed to save project")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  const handleChange = (field: string, value: any) => setProject({ ...project, [field]: value })

  const handleStackChange = (val: string) => {
    const stack = val.split(",").map(s => s.trim()).filter(Boolean)
    handleChange("stack", stack)
  }

  return (
    <div className="max-w-4xl pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">{isNew ? 'New Project' : 'Edit Project'}</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/projects')} className="px-4 py-2 border border-border rounded-md hover:bg-muted">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-card border border-border p-6 rounded-xl space-y-4">
          <h2 className="font-bold text-xl mb-4">Core Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={project.title} onChange={e => handleChange('title', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input type="text" value={project.slug} onChange={e => handleChange('slug', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea value={project.summary || ''} onChange={e => handleChange('summary', e.target.value)} rows={2} className="w-full px-3 py-2 bg-background border border-border rounded-md resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stack (comma separated)</label>
            <input type="text" value={(project.stack || []).join(", ")} onChange={e => handleStackChange(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input type="text" value={project.role || ''} onChange={e => handleChange('role', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-4">
          <h2 className="font-bold text-xl mb-4">Case Study (Markdown)</h2>
          <div>
            <label className="block text-sm font-medium mb-1">The Problem</label>
            <textarea value={project.problem || ''} onChange={e => handleChange('problem', e.target.value)} rows={4} className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">The Solution</label>
            <textarea value={project.solution || ''} onChange={e => handleChange('solution', e.target.value)} rows={4} className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Outcome</label>
            <textarea value={project.outcome || ''} onChange={e => handleChange('outcome', e.target.value)} rows={4} className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono text-sm" />
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-4">
          <h2 className="font-bold text-xl mb-4">Links & Visibility</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Live URL</label>
              <input type="url" value={project.live_url || ''} onChange={e => handleChange('live_url', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Repo URL</label>
              <input type="url" value={project.repo_url || ''} onChange={e => handleChange('repo_url', e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={project.is_featured} onChange={e => handleChange('is_featured', e.target.checked)} className="rounded border-border text-primary" />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={project.is_published} onChange={e => handleChange('is_published', e.target.checked)} className="rounded border-border text-primary" />
              <span className="text-sm font-medium">Published</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
