"use client"

import { useEffect, useState } from "react"
import { slugify } from "@/lib/content-utils"

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from HTML string
    const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi
    const found: Heading[] = []
    let match
    
    while ((match = regex.exec(content)) !== null) {
      const level = parseInt(match[1])
      // Strip inner tags
      const text = match[2].replace(/<[^>]*>/g, "")
      // Find id if it exists in the tag, otherwise slugify
      const idMatch = match[0].match(/id="([^"]+)"/)
      const id = idMatch ? idMatch[1] : slugify(text)
      
      found.push({ id, text, level })
    }
    
    setHeadings(found)
  }, [content])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav className="hidden lg:block sticky top-24 max-w-xs xl:max-w-sm ml-8 self-start">
      <h4 className="text-sm font-bold mb-4 text-[#EDEDEF] uppercase tracking-wider font-mono">On this page</h4>
      <ul className="space-y-3 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}>
            <a
              href={`#${heading.id}`}
              className={`block transition-colors ${
                activeId === heading.id
                  ? "text-[#D4A853] font-medium"
                  : "text-[#8A8A8E] hover:text-[#EDEDEF]"
              }`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
