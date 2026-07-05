import { getSiteConfig } from "@/lib/data"
import { SectionHeading } from "@/components/site/section-heading"
import { MarkdownRenderer } from "@/components/site/markdown-renderer"
import Image from "next/image"

export default async function AboutPage() {
  const config = await getSiteConfig()

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="About Me" />
        
        <div className="flex flex-col md:flex-row gap-12 items-start mt-12">
          {config.avatar_url && (
            <div className="relative w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border border-border shadow-xl">
              <Image 
                src={config.avatar_url} 
                alt={config.owner_name} 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          )}
          
          <div className={`w-full ${config.avatar_url ? 'md:w-2/3' : ''}`}>
            {config.bio_long ? (
              <div className="font-serif text-lg leading-relaxed">
                <MarkdownRenderer content={config.bio_long} />
              </div>
            ) : (
              <p className="text-xl text-muted-foreground">{config.bio_short}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
