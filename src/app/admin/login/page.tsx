"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      router.push("/admin")
      return
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0A0A0B]">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-[#D4A853] to-[#D4A853]/50 rounded-xl flex items-center justify-center text-xl font-serif font-bold text-[#0A0A0B] mx-auto mb-4">
          C
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#EDEDEF]">Career OS</h1>
      </div>

      <div className="w-full max-w-md bg-[#141416] border border-[#2A2A2D] rounded-2xl p-8 shadow-2xl">
        <h2 className="text-xl font-bold mb-6">Admin Login</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8E]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0B] border border-[#2A2A2D] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A853]/50"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8E]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0B] border border-[#2A2A2D] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A853]/50"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 bg-[#D4A853] text-[#0A0A0B] font-bold rounded-lg hover:bg-[#D4A853]/90 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <a href="#" className="text-xs text-[#8A8A8E] hover:text-[#D4A853] transition-colors">Forgot password?</a>
        </div>
      </div>
    </div>
  )
}
