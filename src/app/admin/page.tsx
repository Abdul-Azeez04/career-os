"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Users, FileText, PenTool, Eye, Mail, MessageSquare } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    views: [],
    totals: { projects: 0, posts: 0, messages: 0, subscribers: 0 }
  })
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchStats() {
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
        setStats({
          views: [
            { path: "/blog/building-career-os", views: 142 },
            { path: "/about", views: 89 },
            { path: "/", views: 250 },
          ],
          totals: { projects: 4, posts: 3, messages: 2, subscribers: 1 }
        })
        setLoading(false)
        return
      }

      const [views, projects, posts, messages, subs] = await Promise.all([
        supabase.from("page_views").select("*").order("view_count", { ascending: false }).limit(10),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("status", "active"),
      ])

      setStats({
        views: views.data || [],
        totals: {
          projects: projects.count || 0,
          posts: posts.count || 0,
          messages: messages.count || 0,
          subscribers: subs.count || 0,
        }
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" /></div>

  const chartData = stats.views.map((v: any) => ({
    name: v.path === "/" ? "Home" : v.path.replace("/blog/", "").replace("/writing/", ""),
    views: v.view_count || v.views,
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Projects", value: stats.totals.projects, icon: FileText, color: "text-blue-400" },
          { label: "Blog Posts", value: stats.totals.posts, icon: PenTool, color: "text-green-400" },
          { label: "Unread Messages", value: stats.totals.messages, icon: MessageSquare, color: "text-yellow-400" },
          { label: "Subscribers", value: stats.totals.subscribers, icon: Users, color: "text-purple-400" },
        ].map(stat => (
          <div key={stat.label} className="bg-[#141416] border border-[#2A2A2D] rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-[#8A8A8E] text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-3 bg-[#1C1C1F] rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#141416] border border-[#2A2A2D] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-5 h-5 text-[#D4A853]" />
            <h2 className="text-lg font-bold">Top Pages</h2>
          </div>
          <div className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#8A8A8E" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8A8A8E" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "#1C1C1F" }} contentStyle={{ backgroundColor: "#0A0A0B", borderColor: "#2A2A2D", borderRadius: "8px" }} />
                  <Bar dataKey="views" fill="#D4A853" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#8A8A8E]">No view data yet.</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#141416] border border-[#2A2A2D] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/admin/blog/new" className="block p-4 border border-[#2A2A2D] rounded-lg hover:border-[#D4A853] hover:bg-[#D4A853]/5 transition-colors">
              <div className="font-bold text-[#D4A853] mb-1">Write a Post</div>
              <div className="text-xs text-[#8A8A8E]">Create a new blog post</div>
            </a>
            <a href="/admin/projects" className="block p-4 border border-[#2A2A2D] rounded-lg hover:border-[#D4A853] hover:bg-[#D4A853]/5 transition-colors">
              <div className="font-bold mb-1">Add Project</div>
              <div className="text-xs text-[#8A8A8E]">Showcase your latest work</div>
            </a>
            <a href="/admin/messages" className="block p-4 border border-[#2A2A2D] rounded-lg hover:border-[#D4A853] hover:bg-[#D4A853]/5 transition-colors">
              <div className="font-bold mb-1">Check Messages</div>
              <div className="text-xs text-[#8A8A8E]">You have {stats.totals.messages} unread</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
