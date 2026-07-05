import { SectionHeading } from "@/components/site/section-heading"
import Link from "next/link"
import { Code2, PenTool, CheckCircle2 } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <SectionHeading 
        title="Services" 
        subtitle="How we can work together."
        centered
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mt-16">
        {/* Engineering Lane */}
        <div className="bg-card border border-border p-8 md:p-12 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
          
          <Code2 className="w-12 h-12 text-primary mb-8" />
          <h2 className="text-3xl font-serif font-bold mb-4">Software Engineering</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            I build production-ready, full-stack web applications with a focus on AI integrations, seamless user experiences, and robust architectures.
          </p>
          
          <ul className="space-y-4 mb-12">
            {[
              "End-to-end web application development (Next.js, TypeScript, Supabase)",
              "AI tool integration (OpenAI, Anthropic APIs)",
              "Dashboard and analytics platform creation",
              "Performance optimization and refactoring"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          <Link 
            href="/contact?subject=Engineering Inquiry" 
            className="inline-block w-full text-center px-6 py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            Discuss a Project
          </Link>
        </div>

        {/* Writing Lane */}
        <div className="bg-card border border-border p-8 md:p-12 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
          
          <PenTool className="w-12 h-12 text-primary mb-8" />
          <h2 className="text-3xl font-serif font-bold mb-4">Editorial & Writing</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Beyond code, I offer editorial services for speculative fiction, technical writing, and structural manuscript consulting.
          </p>
          
          <ul className="space-y-4 mb-12">
            {[
              "Developmental editing for sci-fi and fantasy",
              "Technical blog posts and documentation",
              "Ghostwriting for technology leaders",
              "Narrative design for interactive experiences"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          <Link 
            href="/contact?subject=Writing/Editorial Inquiry" 
            className="inline-block w-full text-center px-6 py-4 border border-border bg-background hover:bg-muted font-medium rounded-xl transition-colors"
          >
            Request Editorial Rates
          </Link>
        </div>
      </div>
    </div>
  )
}
