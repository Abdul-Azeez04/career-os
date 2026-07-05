import { getSiteConfig, getExperiences, getCertifications, getSkills } from "@/lib/data"
import { FileDown, MapPin, Mail, Globe } from "lucide-react"
import { PrintButton } from "@/components/site/print-button"

export default async function ResumePage() {
  const [config, experiences, certs, skills] = await Promise.all([
    getSiteConfig(),
    getExperiences(),
    getCertifications(),
    getSkills()
  ])

  // Filter skills by high proficiency for resume
  const topSkills = skills.filter(s => s.proficiency >= 4).map(s => s.name)
  
  const empList = experiences.filter(e => e.type !== 'education')
  const eduList = experiences.filter(e => e.type === 'education')

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-serif font-bold">Curriculum Vitae</h1>
        <PrintButton />
      </div>

      <div className="bg-card border border-border p-8 md:p-12 shadow-sm rounded-xl print:border-none print:shadow-none print:p-0 print:bg-transparent">
        {/* Header */}
        <header className="border-b border-border pb-8 mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold font-serif mb-2">{config.owner_name}</h2>
            <p className="text-xl text-primary font-medium">{config.tagline}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground font-mono">
            {config.email && (
              <span className="flex items-center gap-2 justify-center md:justify-end">
                <Mail className="w-4 h-4" /> {config.email}
              </span>
            )}
            <span className="flex items-center gap-2 justify-center md:justify-end">
              <Globe className="w-4 h-4" /> abdul-azeez.dev
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest text-primary mb-6 border-b border-border/50 pb-2">Experience</h3>
              <div className="space-y-8">
                {empList.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                      <h4 className="font-bold text-lg">{exp.title}</h4>
                      <span className="text-sm font-mono text-muted-foreground shrink-0">
                        {exp.start_date ? new Date(exp.start_date).getFullYear() : ""} — {exp.end_date ? new Date(exp.end_date).getFullYear() : "Present"}
                      </span>
                    </div>
                    <div className="font-medium text-foreground mb-3">{exp.org}</div>
                    {exp.description && <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {exp.highlights.map((h: string, i: number) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest text-primary mb-6 border-b border-border/50 pb-2">Education</h3>
              <div className="space-y-6">
                {eduList.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="font-bold">{edu.title}</h4>
                    <div className="text-sm mt-1">{edu.org}</div>
                    <div className="text-sm text-muted-foreground font-mono mt-1">
                      {edu.start_date ? new Date(edu.start_date).getFullYear() : ""} — {edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest text-primary mb-6 border-b border-border/50 pb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {topSkills.map((skill) => (
                  <span key={skill} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {certs.length > 0 && (
              <section>
                <h3 className="text-lg font-bold uppercase tracking-widest text-primary mb-6 border-b border-border/50 pb-2">Certifications</h3>
                <div className="space-y-4">
                  {certs.map((cert) => (
                    <div key={cert.id}>
                      <h4 className="font-bold text-sm">{cert.title}</h4>
                      <div className="text-xs text-muted-foreground mt-1">{cert.issuer}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
