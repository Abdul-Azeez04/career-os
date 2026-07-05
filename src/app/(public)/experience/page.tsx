import { getExperiences } from "@/lib/data"
import { SectionHeading } from "@/components/site/section-heading"
import { Timeline } from "@/components/site/timeline"

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <SectionHeading 
        title="Experience" 
        subtitle="My journey through engineering, development, and leadership."
        centered
      />
      <Timeline items={experiences} />
    </div>
  )
}
