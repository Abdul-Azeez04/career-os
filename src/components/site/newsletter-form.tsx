"use client"

import { useActionState } from "react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function NewsletterForm({ source = "website", variant = "inline" }: { source?: string; variant?: "inline" | "card" }) {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, null)

  if (state?.success) {
    if (variant === "card") {
      return (
        <div className="bg-[#141416] border border-[#2A2A2D] rounded-2xl p-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-[#D4A853]/10 text-[#D4A853] rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold mb-2">You're on the list!</h3>
          <p className="text-[#8A8A8E]">{state.message}</p>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 text-sm text-[#D4A853] bg-[#D4A853]/10 px-4 py-3 rounded-lg border border-[#D4A853]/20">
        <CheckCircle2 className="w-4 h-4" /> {state.message}
      </div>
    )
  }

  const formContent = (
    <form action={formAction} className={`flex flex-col gap-3 ${variant === "inline" ? "sm:flex-row sm:items-start" : ""}`}>
      <input type="hidden" name="source" value={source} />
      <div className="flex-1">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8E]" />
          <input
            type="email"
            name="email"
            required
            placeholder="Your email address"
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0B] border border-[#2A2A2D] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A853]/50 focus:border-[#D4A853]"
            disabled={isPending}
          />
        </div>
        {state?.error && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {state.error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 bg-[#D4A853] text-[#0A0A0B] font-bold rounded-lg hover:bg-[#D4A853]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center min-w-[120px]"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
      </button>
    </form>
  )

  if (variant === "card") {
    return (
      <div className="bg-[#141416] border border-[#2A2A2D] rounded-2xl p-6 md:p-8">
        <h3 className="text-2xl font-serif font-bold mb-2">Stay in the loop</h3>
        <p className="text-[#8A8A8E] mb-6">Get my latest articles, tutorials, and insights delivered straight to your inbox. No spam, unsubscribe anytime.</p>
        {formContent}
      </div>
    )
  }

  return formContent
}
