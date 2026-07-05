"use client"

import { useState, useEffect } from "react"
import { clientGetAllWritings, clientDeleteWriting } from "@/lib/data/client"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function WritingAdmin() {
  const [writings, setWritings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await clientGetAllWritings()
    setWritings(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this piece?")) return
    try {
      await clientDeleteWriting(id)
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
        <h1 className="text-3xl font-serif font-bold">Writing</h1>
        <Link href="/admin/writing/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Piece
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted border-b border-border text-sm">
            <tr>
              <th className="px-6 py-3 font-medium">Title & Type</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {writings.map((writing) => (
              <tr key={writing.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold">{writing.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs uppercase bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">{writing.type}</span>
                    {writing.series && <span>Part of <em>{writing.series}</em></span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-md ${writing.is_published ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                    {writing.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                  {new Date(writing.published_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/writing/${writing.slug}`} target="_blank" className="p-2 text-muted-foreground hover:text-foreground inline-block transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link href={`/admin/writing/${writing.id}`} className="p-2 text-muted-foreground hover:text-primary inline-block transition-colors ml-2">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(writing.id)}
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
