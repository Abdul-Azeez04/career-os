"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  Award,
  Code2,
  FileText,
  PenTool,
  MessageSquare,
  Image as ImageIcon,
  Menu,
  X,
  ExternalLink,
  LogOut,
  Mail,
  Tags
} from "lucide-react"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Site Settings", href: "/admin/site-settings", icon: Settings },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Certifications", href: "/admin/certifications", icon: Award },
  { label: "Skills", href: "/admin/skills", icon: Code2 },
  { label: "Projects", href: "/admin/projects", icon: FileText },
  { label: "Writing", href: "/admin/writing", icon: PenTool },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
]

const BLOG_ITEMS = [
  { label: "All Posts", href: "/admin/blog", icon: PenTool },
  { label: "Tags", href: "/admin/blog/tags", icon: Tags },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  // Check if we are on the login page, if so don't render layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#0A0A0B] border-r border-[#2A2A2D]">
      <div className="p-6 flex items-center justify-between border-b border-[#2A2A2D]">
        <Link href="/admin" className="font-serif font-bold text-xl text-[#EDEDEF]">
          Career OS <span className="text-[#D4A853]">Admin</span>
        </Link>
        <button className="md:hidden" onClick={() => setIsMobileOpen(false)}>
          <X className="w-5 h-5 text-[#8A8A8E]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-bold text-[#8A8A8E] uppercase tracking-wider">Content</div>
        <nav className="px-3 space-y-1 mb-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#D4A853]/10 text-[#D4A853] font-medium"
                    : "text-[#8A8A8E] hover:text-[#EDEDEF] hover:bg-[#1C1C1F]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#D4A853]" : ""}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 mb-2 text-xs font-bold text-[#8A8A8E] uppercase tracking-wider">Blog Engine</div>
        <nav className="px-3 space-y-1">
          {BLOG_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin/blog" && pathname.startsWith(item.href)) || (item.href === "/admin/blog" && pathname.startsWith("/admin/blog") && !pathname.includes("tags"))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#D4A853]/10 text-[#D4A853] font-medium"
                    : "text-[#8A8A8E] hover:text-[#EDEDEF] hover:bg-[#1C1C1F]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#D4A853]" : ""}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#2A2A2D]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#8A8A8E] hover:text-[#EDEDEF] hover:bg-[#1C1C1F] transition-colors mb-2"
        >
          <ExternalLink className="w-4 h-4" />
          View Live Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex text-[#EDEDEF]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-64 max-w-[80%] h-full bg-[#0A0A0B]">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-[#2A2A2D] bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-5 h-5 text-[#8A8A8E]" />
            </button>
            <h2 className="text-lg font-bold">
              {NAV_ITEMS.find(i => i.href === pathname)?.label || BLOG_ITEMS.find(i => i.href === pathname)?.label || "Admin"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#D4A853] flex items-center justify-center text-[#0A0A0B] font-bold text-sm">
              A
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
