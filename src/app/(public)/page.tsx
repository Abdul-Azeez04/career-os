import { Hero } from "@/components/site/hero"
import { ProjectCard } from "@/components/site/project-card"
import { WritingCard } from "@/components/site/writing-card"
import { TestimonialCarousel } from "@/components/site/testimonial-carousel"
import { SkillBadge } from "@/components/site/skill-badge"
import { SectionHeading } from "@/components/site/section-heading"
import { 
  getSiteConfig, 
  getProjects, 
  getWritings, 
  getTestimonials,
  getSkillsByCategory
} from "@/lib/data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default async function Home() {
  const [config, projects, writings, testimonials, skillsByCategory] = await Promise.all([
    getSiteConfig(),
    getProjects(true), // Only featured
    getWritings(),
    getTestimonials(),
    getSkillsByCategory()
  ])

  const recentWritings = writings.slice(0, 3)

  return (
    <div className="flex flex-col gap-24 md:gap-32 pb-24">
      <Hero 
        name={config.owner_name} 
        tagline={config.tagline} 
        bioShort={config.bio_short} 
      />

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            title="Selected Work" 
            subtitle="Recent projects demonstrating full-stack AI capabilities and production readiness." 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/work" className="inline-flex items-center gap-2 font-medium text-primary hover:underline underline-offset-4">
              View all projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Skills */}
      {Object.keys(skillsByCategory).length > 0 && (
        <section className="bg-card border-y border-border py-24">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading 
              title="Capabilities" 
              subtitle="The languages, frameworks, and tools I use to build." 
              centered
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16 max-w-6xl mx-auto">
              {['framework', 'language', 'tool', 'creative'].map(cat => {
                const skills = skillsByCategory[cat]
                if (!skills?.length) return null
                return (
                  <div key={cat}>
                    <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-6 pb-2 border-b border-border">
                      {cat}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {skills.map(skill => (
                        <SkillBadge key={skill.id} skill={skill} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container mx-auto px-4 md:px-6">
          <TestimonialCarousel testimonials={testimonials} />
        </section>
      )}

      {/* Writing */}
      {config.show_writing && recentWritings.length > 0 && (
        <section className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            title="Latest Writing" 
            subtitle="Essays on technology, fiction from the Remnants series, and scattered thoughts." 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentWritings.map((writing, i) => (
              <WritingCard key={writing.id} writing={writing} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/writing" className="inline-flex items-center gap-2 font-medium text-primary hover:underline underline-offset-4">
              Read more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 text-center">
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Let's build something.</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Whether you need a full-stack AI application or developmental editing for your manuscript, I'm currently taking on new projects.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
