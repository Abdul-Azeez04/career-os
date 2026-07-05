"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"

export function ProjectCard({ 
  project, 
  index = 0 
}: { 
  project: any
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/work/${project.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(212,168,83,0.1)]">
          
          <div className="aspect-video w-full relative bg-muted flex items-center justify-center overflow-hidden">
            {project.cover_image_url ? (
              <Image 
                src={project.cover_image_url} 
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="font-serif text-4xl text-muted-foreground/30 font-bold opacity-50">
                {project.title.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
              <span className="text-primary font-medium flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                View Case Study <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">{project.summary}</p>
            
            <div className="flex flex-wrap gap-2">
              {project.stack?.slice(0, 4).map((tech: string) => (
                <span key={tech} className="text-xs font-mono px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
                  {tech}
                </span>
              ))}
              {project.stack && project.stack.length > 4 && (
                <span className="text-xs font-mono px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
                  +{project.stack.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
