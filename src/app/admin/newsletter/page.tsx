"use client"

import { useState, useEffect } from "react"
import { clientGetNewsletterSubscribers } from "@/lib/data/client-blog"
import { Download, Search } from "lucide-react"

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    clientGetNewsletterSubscribers().then(data => { setSubscribers(data); setLoading(false) })
  }, [])

  const filtered = subscribers.filter(s => {
    const matchFilter = filter === "all" || s.status === filter
    const matchSearch = !search || s.email.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Name,Status,Source,Date\n"
      + filtered.map(s => `${s.email},${s.name || ""},${s.status},${s.source || ""},${s.subscribed_at}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `subscribers-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Newsletter</h1>
          <p className="text-[#8A8A8E]">{subscribers.filter(s => s.status === "active").length} active subscribers</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-[#2A2A2D] rounded-lg hover:bg-[#1C1C1F] text-sm font-medium transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8E]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search emails..." className="w-full pl-10 pr-4 py-2 bg-[#141416] border border-[#2A2A2D] rounded-lg text-sm" />
        </div>
        <div className="flex gap-1">
          {["all", "active", "unsubscribed"].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${filter === tab ? "bg-[#D4A853] text-[#0A0A0B]" : "text-[#8A8A8E] hover:text-[#EDEDEF] hover:bg-[#1C1C1F]"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#141416] border border-[#2A2A2D] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#0A0A0B]/50 border-b border-[#2A2A2D] text-xs text-[#8A8A8E]">
            <tr>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium hidden md:table-cell">Source</th>
              <th className="px-6 py-3 font-medium">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2D]">
            {filtered.map(sub => (
              <tr key={sub.id} className="hover:bg-[#1C1C1F]/50 transition-colors">
                <td className="px-6 py-4 font-medium">{sub.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 text-xs rounded-md border capitalize ${sub.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-[#2A2A2D] text-[#8A8A8E] border-[#2A2A2D]"}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-sm text-[#8A8A8E]">{sub.source || "—"}</td>
                <td className="px-6 py-4 text-sm text-[#8A8A8E] font-mono">{new Date(sub.subscribed_at).toISOString().split("T")[0]}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#8A8A8E]">No subscribers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
