"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Upload, Trash2, Copy, Image as ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function MediaAdmin() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      setLoading(false)
      return
    }

    const { data, error } = await supabase.storage.from("media").list()
    if (!error && data) {
      // Get public URLs
      const filesWithUrls = data.map(file => ({
        ...file,
        url: supabase.storage.from("media").getPublicUrl(file.name).data.publicUrl
      }))
      setFiles(filesWithUrls.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
    }
    setLoading(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      toast.error("Upload disabled in mock mode")
      return
    }

    const file = e.target.files[0]
    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

    const { error } = await supabase.storage.from("media").upload(fileName, file)

    if (error) {
      toast.error("Upload failed: " + error.message)
    } else {
      toast.success("File uploaded")
      fetchFiles()
    }
    setUploading(false)
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm("Delete this file permanently?")) return
    const { error } = await supabase.storage.from("media").remove([fileName])
    if (error) {
      toast.error("Delete failed")
    } else {
      toast.success("File deleted")
      fetchFiles()
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Media Library</h1>
          <p className="text-[#8A8A8E]">Upload and manage images for your site.</p>
        </div>
        <div>
          <label className="flex items-center gap-2 px-4 py-2 bg-[#D4A853] text-[#0A0A0B] font-bold rounded-lg hover:bg-[#D4A853]/90 cursor-pointer">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload File"}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" && (
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-sm">
          You are currently in mock mode. Media uploads require connecting to a real Supabase instance.
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-20 bg-[#141416] rounded-2xl border border-[#2A2A2D]">
          <ImageIcon className="w-12 h-12 text-[#2A2A2D] mx-auto mb-4" />
          <p className="text-[#8A8A8E]">No media files uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map(file => (
            <div key={file.id} className="group relative bg-[#141416] border border-[#2A2A2D] rounded-xl overflow-hidden aspect-square">
              <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(file.url)} className="p-2 bg-[#1C1C1F] hover:bg-[#2A2A2D] rounded-lg text-white" title="Copy URL">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(file.name)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
