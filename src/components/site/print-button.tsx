"use client"

import { FileDown } from "lucide-react"

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm font-medium print:hidden"
    >
      <FileDown className="w-4 h-4" /> Download PDF
    </button>
  )
}
