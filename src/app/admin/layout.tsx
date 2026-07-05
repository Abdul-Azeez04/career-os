"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Settings, Briefcase, Award, Code2,
  FolderGit2, PenTool, MessageSquare, Image as ImageIcon,
  Menu, X, ExternalLink, LogOut, ChevronRight
} from "lucide-react"

const ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Site Settings", href: "/admin/site-settings", icon: Settings },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Certifications", href: "/admin/certifications", icon: Award },
  { name: "Skills", href: "/admin/skills", icon: Code2 },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Writing", href: "/admin/writing", icon: PenTool },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Login page gets no sidebar
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200",
        "md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold font-mono text-sm">A</span>
            </div>
            <div>
              <div className="font-serif font-bold text-primary leading-none">Career OS</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-mono uppercase tracking-wider">Admin</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {ADMIN_LINKS.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(link.href + "/")
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{link.name}</span>
                {isActive && <ChevronRight className="w-3 h-3" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View Live Site
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center gap-4 px-4 md:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 -ml-2 text-muted-foreground"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <span className="text-sm font-medium text-muted-foreground capitalize">
              {pathname.replace("/admin", "").replace("/", "").replace(/-/g, " ") || "Dashboard"}
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-mono text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> Live site
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
