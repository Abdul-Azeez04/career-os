"use client"

import { useState, useEffect } from "react"
import { clientGetAllProjects, clientDeleteProject } from "@/lib/data/client"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await clientGetAllProjects()
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      await clientDeleteProject(id)
      toast.success("Deleted successfully")
      loadData()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Projects</h1>
        <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Project
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted border-b border-border text-sm">
            <tr>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Stack</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold flex items-center gap-2">
                    {project.title}
                    {project.is_featured && <span className="px-2 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full uppercase">Featured</span>}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-1">{project.summary}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-md ${project.is_published ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                    {project.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {project.stack?.slice(0, 3).map((s: string) => (
                      <span key={s} className="text-xs bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                        {s}
                      </span>
                    ))}
                    {project.stack?.length > 3 && (
                      <span className="text-xs text-muted-foreground px-1.5 py-0.5">+{project.stack.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/work/${project.slug}`} target="_blank" className="p-2 text-muted-foreground hover:text-foreground inline-block transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link href={`/admin/projects/${project.id}`} className="p-2 text-muted-foreground hover:text-primary inline-block transition-colors ml-2">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
