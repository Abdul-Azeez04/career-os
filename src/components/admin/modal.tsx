"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-xl",
    lg: "max-w-3xl",
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className={cn("bg-card border border-border rounded-2xl shadow-2xl w-full flex flex-col max-h-[90vh]", sizes[size])}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-xl font-bold font-serif">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

// Reusable form field components
export function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
        className
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
        className
      )}
      {...props}
    />
  )
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
        className
      )}
      {...props}
    />
  )
}

export function FormActions({ onCancel, saving, saveLabel = "Save" }: {
  onCancel: () => void
  saving?: boolean
  saveLabel?: string
}) {
  return (
    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
      >
        {saving ? "Saving..." : saveLabel}
      </button>
    </div>
  )
}
