"use client"

import { Image as ImageIcon, UploadCloud } from "lucide-react"

export default function MediaAdmin() {
  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Media Library</h1>
        <button disabled className="flex items-center gap-2 px-4 py-2 bg-primary/50 text-primary-foreground font-medium rounded-md cursor-not-allowed">
          <UploadCloud className="w-4 h-4" /> Upload File
        </button>
      </div>

      <div className="text-center py-24 bg-card border border-border border-dashed rounded-xl">
        <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
        <h3 className="text-xl font-bold mb-2">Connect Supabase Storage</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          The media library requires Supabase Storage to be configured. In a fully connected environment, this section manages cover images, avatars, and PDF resumes.
        </p>
      </div>
    </div>
  )
}
