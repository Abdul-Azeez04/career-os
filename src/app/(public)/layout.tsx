import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { getSiteConfig } from "@/lib/data"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getSiteConfig()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar ownerName={config.owner_name} />
      <main className="flex-1 pt-24">{children}</main>
      <Footer ownerName={config.owner_name} socials={config.socials} />
    </div>
  )
}
