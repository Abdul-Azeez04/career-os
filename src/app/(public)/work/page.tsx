import { getProjects } from "@/lib/data"
import { SectionHeading } from "@/components/site/section-heading"
import ProjectList from "@/components/site/project-list"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Work | Career OS",
  description: "A selection of applications and tools I've built.",
}

export default async function WorkPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <SectionHeading 
        title="Work" 
        subtitle="A selection of applications and tools I've built."
      />
      
      <ProjectList projects={projects} />
    </div>
  )
}
