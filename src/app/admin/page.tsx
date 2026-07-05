"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { clientGetAdminStats } from "@/lib/data/client"
import { FolderGit2, PenTool, MessageSquare, Award, ArrowRight } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    clientGetAdminStats().then(setStats)
  }, [])

  if (!stats) return <div className="p-8">Loading dashboard...</div>

  const statCards = [
    { name: "Projects", value: stats.total_projects, icon: FolderGit2, href: "/admin/projects" },
    { name: "Writing", value: stats.total_writings, icon: PenTool, href: "/admin/writing" },
    { name: "Unread Messages", value: stats.unread_messages, icon: MessageSquare, href: "/admin/messages", alert: stats.unread_messages > 0 },
    { name: "Testimonials", value: stats.total_testimonials, icon: Award, href: "/admin/testimonials" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href} className="block group">
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">{stat.name}</span>
                <stat.icon className={`w-5 h-5 ${stat.alert ? 'text-destructive' : 'text-primary'}`} />
              </div>
              <div className={`text-4xl font-serif font-bold ${stat.alert ? 'text-destructive' : ''}`}>
                {stat.value}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/writing/new" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors">
              <span className="font-medium">Draft new writing</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link href="/admin/projects/new" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors">
              <span className="font-medium">Add new project</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link href="/admin/site-settings" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors">
              <span className="font-medium">Update site config</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
