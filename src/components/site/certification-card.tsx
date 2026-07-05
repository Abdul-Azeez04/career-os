"use client"

import { motion } from "motion/react"
import Image from "next/image"
import { ExternalLink, Award } from "lucide-react"

export function CertificationCard({ cert, index = 0 }: { cert: any, index?: number }) {
  const dateStr = cert.issue_date 
    ? new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative h-full bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
      
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
          {cert.badge_image_url ? (
            <Image src={cert.badge_image_url} alt={cert.issuer} fill className="object-contain p-2" />
          ) : (
            <Award className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight mb-1">{cert.title}</h3>
          <p className="text-muted-foreground text-sm font-medium">{cert.issuer}</p>
          {dateStr && <p className="text-xs text-muted-foreground mt-1 font-mono">{dateStr}</p>}
        </div>
      </div>

      {cert.credential_url && (
        <a 
          href={cert.credential_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4 mt-auto"
        >
          Verify Credential <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </motion.div>
  )
}
