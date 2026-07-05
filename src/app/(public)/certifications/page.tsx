import { getCertifications } from "@/lib/data"
import { SectionHeading } from "@/components/site/section-heading"
import { CertificationCard } from "@/components/site/certification-card"

export default async function CertificationsPage() {
  const certs = await getCertifications()

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <SectionHeading 
        title="Certifications" 
        subtitle="Formal credentials and ongoing education."
      />
      
      {certs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <CertificationCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground py-12">No certifications listed yet.</div>
      )}
    </div>
  )
}
