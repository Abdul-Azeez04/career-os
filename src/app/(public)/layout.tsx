import { getSiteConfig } from "@/lib/data"
import Navbar from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import ReadingProgress from "@/components/site/reading-progress"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig()

  return (
    <div className="flex flex-col min-h-screen">
      <ReadingProgress />
      <Navbar ownerName={config.owner_name} />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer config={config} />
    </div>
  )
}
