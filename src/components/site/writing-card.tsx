"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { BookOpen, PenTool, Edit3, AlignLeft } from "lucide-react"

const typeIcons = {
  poem: PenTool,
  excerpt: BookOpen,
  essay: AlignLeft,
  post: Edit3,
}

export function WritingCard({ 
  writing, 
  index = 0 
}: { 
  writing: any
  index?: number
}) {
  const Icon = typeIcons[writing.type as keyof typeof typeIcons] || FileText
  const date = new Date(writing.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/writing/${writing.slug}`} className="group block h-full">
        <div className="h-full flex flex-col rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/30 hover:bg-card/80 p-6">
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary rounded-md uppercase tracking-wider flex items-center gap-1.5">
              <Icon className="w-3 h-3" />
              {writing.type}
            </span>
            <span className="text-sm text-muted-foreground font-mono">{date}</span>
          </div>
          
          <h3 className="font-serif text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
            {writing.title}
          </h3>
          
          {writing.series && (
            <p className="text-sm text-muted-foreground italic mb-4">
              Part of the <span className="font-medium text-foreground">{writing.series}</span> series
            </p>
          )}
          
          <div className="mt-auto pt-6 flex items-center text-sm font-medium text-primary">
            Read piece <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

import { FileText } from "lucide-react"
