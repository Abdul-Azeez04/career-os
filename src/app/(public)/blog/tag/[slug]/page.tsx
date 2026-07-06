import { getBlogPostsByTag, getAllBlogTags } from "@/lib/data/blog"
import BlogCard from "@/components/site/blog-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"



export default async function TagArchivePage({ params }: any) {
  const p = await params
  const [posts, tags] = await Promise.all([
    getBlogPostsByTag(p.slug),
    getAllBlogTags(),
  ])

  const tag = tags.find(t => t.slug === p.slug)
  if (!tag) notFound()

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-5xl">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#8A8A8E] hover:text-[#D4A853] transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
      </Link>

      <div className="mb-16">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-12 h-1 rounded-full" style={{ backgroundColor: tag.color }} />
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight capitalize">{tag.name}</h1>
        </div>
        <p className="text-[#8A8A8E] text-lg">
          {tag.description || `Articles and tutorials about ${tag.name}.`}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-[#141416] rounded-2xl border border-[#2A2A2D]">
          <p className="text-[#8A8A8E]">No posts found for this tag yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
