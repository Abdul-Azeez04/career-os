import { getWritings } from "@/lib/data"
import { SectionHeading } from "@/components/site/section-heading"
import WritingList from "@/components/site/writing-list"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Writing | Career OS",
  description: "Essays on technology, fiction, and scattered thoughts.",
}

export default async function WritingPage() {
  const writings = await getWritings()

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <SectionHeading 
        title="Writing" 
        subtitle="Thoughts on technology, essays on building, and fiction from the Remnants series."
      />
      
      <WritingList writings={writings} />
    </div>
  )
}
