'use client'

import { Link2, Check } from 'lucide-react'
import { useState } from 'react'

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/blog/${slug}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback silently
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy link"
      className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
    </button>
  )
}
