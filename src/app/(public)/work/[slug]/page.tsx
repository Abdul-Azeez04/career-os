import { getProjectBySlug, getProjects } from "@/lib/data"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { GithubIcon } from "@/components/site/brand-icons"
import { MarkdownRenderer } from "@/components/site/markdown-renderer"
import { Metadata } from "next"



export async function generateMetadata({ params }: any): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) return {}
  return {
    title: `${project.title} | Career OS`,
    description: project.summary,
  }
}

export default async function ProjectCaseStudy({ params }: any) {
  const project = await getProjectBySlug(params.slug)
  if (!project) notFound()

  return (
    <article className="pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link href="/work" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Work
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6">{project.title}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">{project.summary}</p>
          
          <div className="flex flex-wrap items-center gap-4">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                View Live <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-background hover:bg-muted font-medium rounded-md transition-colors">
                Source Code <GithubIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl mt-16">
        {project.cover_image_url && (
          <div className="w-full aspect-video relative rounded-2xl overflow-hidden border border-border mb-16 shadow-2xl">
            <Image src={project.cover_image_url} alt={project.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {project.problem && (
              <section>
                <h2 className="text-2xl font-serif font-bold mb-4">The Problem</h2>
                <div className="prose dark:prose-invert">
                  <MarkdownRenderer content={project.problem} />
                </div>
              </section>
            )}
            
            {project.solution && (
              <section>
                <h2 className="text-2xl font-serif font-bold mb-4">The Solution</h2>
                <div className="prose dark:prose-invert">
                  <MarkdownRenderer content={project.solution} />
                </div>
              </section>
            )}
            
            {project.outcome && (
              <section>
                <h2 className="text-2xl font-serif font-bold mb-4">Outcome</h2>
                <div className="prose dark:prose-invert">
                  <MarkdownRenderer content={project.outcome} />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-4">Role</h3>
              <p className="font-medium">{project.role || "Developer"}</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-4">Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.stack?.map((tech: string) => (
                  <span key={tech} className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
