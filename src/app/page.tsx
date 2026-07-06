import {
  getSiteConfig, getProjects, getWritings, getTestimonials, getSkillsByCategory
} from "@/lib/data"
import Navbar from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Hero } from "@/components/site/hero"
import { ProjectCard } from "@/components/site/project-card"
import { WritingCard } from "@/components/site/writing-card"
import { TestimonialCarousel } from "@/components/site/testimonial-carousel"
import { SkillBadge } from "@/components/site/skill-badge"
import { SectionHeading } from "@/components/site/section-heading"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default async function Home() {
  const [config, projects, writings, testimonials, skillsByCategory] = await Promise.all([
    getSiteConfig(), getProjects(true), getWritings(), getTestimonials(), getSkillsByCategory()
  ])
  const recentWritings = writings.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar ownerName={config.owner_name} />
      <main className="flex-1 pt-24">
        <div className="flex flex-col gap-24 md:gap-32 pb-24">
          <Hero name={config.owner_name} tagline={config.tagline} bioShort={config.bio_short} />

          {projects.length > 0 && (
            <section className="container mx-auto px-4 md:px-6">
              <SectionHeading title="Selected Work" subtitle="Recent projects demonstrating full-stack AI capabilities and production readiness." />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
              </div>
              <div className="mt-12 text-center">
                <Link href="/work" className="inline-flex items-center gap-2 font-medium text-primary hover:underline underline-offset-4">
                  View all projects <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          )}

          {Object.keys(skillsByCategory).length > 0 && (
            <section className="bg-card border-y border-border py-24">
              <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="Capabilities" subtitle="Languages, frameworks, and tools I build with." centered />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-16 max-w-5xl mx-auto">
                  {["framework", "language", "tool", "creative"].map(cat => {
                    const skills = skillsByCategory[cat]; if (!skills?.length) return null
                    return (
                      <div key={cat}>
                        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-6 pb-2 border-b border-border">{cat}</h3>
                        <div className="flex flex-wrap gap-2">{skills.map(s => <SkillBadge key={s.id} skill={s} />)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {testimonials.length > 0 && (
            <section className="container mx-auto px-4 md:px-6">
              <TestimonialCarousel testimonials={testimonials} />
            </section>
          )}

          {config.show_writing && recentWritings.length > 0 && (
            <section className="container mx-auto px-4 md:px-6">
              <SectionHeading title="Latest Writing" subtitle="Essays on technology, fiction from the Remnants series, and scattered thoughts." />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentWritings.map((w, i) => <WritingCard key={w.id} writing={w} index={i} />)}
              </div>
              <div className="mt-12 text-center">
                <Link href="/writing" className="inline-flex items-center gap-2 font-medium text-primary hover:underline underline-offset-4">
                  Read more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          )}

          <section className="container mx-auto px-4 md:px-6 text-center">
            <div className="bg-primary/10 border border-primary/20 rounded-3xl p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Let's build something.</h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Whether you need a full-stack AI application or developmental editing for your manuscript — I'm currently open to projects.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg">
                  Get in touch
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer ownerName={config.owner_name} socials={config.socials} />
    </div>
  )
}
