import Link from "next/link"
import { FileText } from "lucide-react"
import { GithubIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from "./brand-icons"

export function Footer({ 
  ownerName, 
  socials 
}: { 
  ownerName: string
  socials: any 
}) {
  return (
    <footer className="border-t border-border mt-24 py-12 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif font-bold text-xl tracking-tight block mb-4">
              {ownerName}
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Building intelligent web applications and exploring storytelling through technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/work" className="hover:text-primary transition-colors">Work</Link></li>
              <li><Link href="/writing" className="hover:text-primary transition-colors">Writing</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              {socials?.github && (
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <GithubIcon className="w-5 h-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              )}
              {socials?.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <TwitterIcon className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {socials?.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <LinkedinIcon className="w-5 h-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
              {socials?.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <InstagramIcon className="w-5 h-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {socials?.substack && (
                <a href={socials.substack} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <FileText className="w-5 h-5" />
                  <span className="sr-only">Substack</span>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {ownerName}. All rights reserved.</p>
          <p>Built with Next.js & Supabase</p>
        </div>
      </div>
    </footer>
  )
}
