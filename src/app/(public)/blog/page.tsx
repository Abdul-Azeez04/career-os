import { getBlogPosts, getAllBlogTags } from "@/lib/data/blog"
import BlogIndex from "@/components/site/blog-index"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Career OS",
  description: "Technical deep-dives, career advice, and development insights.",
}

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getBlogPosts(), getAllBlogTags()])
  return <BlogIndex posts={posts} tags={tags} />
}
