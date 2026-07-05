"use client"

import { useActionState } from "react"
import { submitContactForm } from "@/app/actions/contact"
import { SectionHeading } from "@/components/site/section-heading"
import { Send, CheckCircle2 } from "lucide-react"

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null)

  if (state?.success) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-24 max-w-2xl text-center">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4">Message Sent</h1>
        <p className="text-xl text-muted-foreground">{state.message}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-2xl">
      <SectionHeading 
        title="Get in Touch" 
        subtitle="Have a project in mind, or just want to say hi? I'd love to hear from you."
        centered
      />

      <div className="bg-card border border-border p-8 rounded-2xl mt-12">
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Jane Doe"
              />
              {state?.errors?.name && (
                <p className="text-destructive text-sm mt-1">{state.errors.name[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="jane@example.com"
              />
              {state?.errors?.email && (
                <p className="text-destructive text-sm mt-1">{state.errors.email[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="What is this regarding?"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              placeholder="Tell me about your project..."
            />
            {state?.errors?.message && (
              <p className="text-destructive text-sm mt-1">{state.errors.message[0]}</p>
            )}
          </div>

          {state?.message && !state?.success && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Sending...' : 'Send Message'}
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
