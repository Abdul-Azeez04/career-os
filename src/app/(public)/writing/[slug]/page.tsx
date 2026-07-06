import { getWritingBySlug, getWritings, getSiteConfig } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Clock, Calendar, Share2 } from "lucide-react"
import { MarkdownRenderer } from "@/components/site/markdown-renderer"
import { readingTime, formatDate } from "@/lib/content-utils"
import { Metadata } from "next"
import { TwitterIcon, LinkedinIcon } from "@/components/site/brand-icons"



export async function generateMetadata({ params }: any): Promise<Metadata> {
  const p = await params
  const writing = await getWritingBySlug(p.slug)
  const config = await getSiteConfig()
  if (!writing) return {}
  const excerpt = (writing.body_markdown || "").replace(/[#*`>\-]/g, "").substring(0, 160)
  return {
    title: `${writing.title} | ${config.owner_name}`,
    description: excerpt,
    openGraph: {
      title: writing.title,
      description: excerpt,
      type: "article",
      publishedTime: writing.published_at || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: writing.title,
      description: excerpt,
    },
  }
}

export default async function WritingDetail({ params }: any) {
  const p = await params
  const [writing, allWritings] = await Promise.all([
    getWritingBySlug(p.slug),
    getWritings(),
  ])
  if (!writing) notFound()

  const related = allWritings
    .filter((w) => w.slug !== writing.slug && (w.type === writing.type || w.series === writing.series))
    .slice(0, 2)

  const rt = readingTime(writing.body_markdown || "")
  const date = formatDate(writing.published_at || new Date().toISOString())
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(writing.title)}&url=${encodeURIComponent(`/writing/${writing.slug}`)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/writing/${writing.slug}`)}`

  return (
    <article className="pb-32 pt-12">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {/* Back */}
        <Link href="/writing" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Writing
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-xs font-mono px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
              {writing.type}
            </span>
            {writing.series && (
              <span className="text-xs font-mono px-3 py-1 bg-muted text-muted-foreground rounded-full">
                {writing.series}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" /><time>{date}</time>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />{rt}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 leading-[1.1]">
            {writing.title}
          </h1>

          {writing.series && (
            <p className="text-xl text-muted-foreground italic border-l-4 border-primary pl-4 py-1">
              From the <span className="font-semibold text-foreground">{writing.series}</span> series
            </p>
          )}
        </header>

        {/* Body */}
        <div className="prose-custom">
          <MarkdownRenderer content={writing.body_markdown || ""} />
        </div>

        {/* External Link */}
        {writing.external_url && (
          <div className="mt-16 pt-8 border-t border-border">
            <a
              href={writing.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4"
            >
              Read originally published version <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-border flex items-center gap-4">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </span>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-lg font-bold mb-6">More Writing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((w) => (
                <Link
                  key={w.id}
                  href={`/writing/${w.slug}`}
                  className="group p-5 border border-border rounded-xl hover:border-primary/50 transition-colors bg-card"
                >
                  <div className="text-xs font-mono text-muted-foreground uppercase mb-2">{w.type}</div>
                  <div className="font-serif font-bold group-hover:text-primary transition-colors leading-snug">
                    {w.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
