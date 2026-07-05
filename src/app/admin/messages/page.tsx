"use client"

import { useState, useEffect } from "react"
import { clientGetMessages, clientUpdateMessageStatus, clientDeleteMessage } from "@/lib/data/client"
import { toast } from "sonner"
import { Mail, CheckCircle2, Trash2, Reply } from "lucide-react"

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await clientGetMessages()
    setMessages(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await clientUpdateMessageStatus(id, status as any)
      loadData()
    } catch (e) {
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    try {
      await clientDeleteMessage(id)
      toast.success("Deleted successfully")
      loadData()
    } catch (e) {
      toast.error("Failed to delete")
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Messages Inbox</h1>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Inbox Zero</h3>
            <p className="text-muted-foreground">You have no messages at this time.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`bg-card border rounded-xl p-6 transition-colors ${msg.status === 'new' ? 'border-primary shadow-[0_0_15px_rgba(212,168,83,0.1)]' : 'border-border'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg">{msg.sender_name}</span>
                    <span className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">{msg.status}</span>
                  </div>
                  <div className="text-sm text-primary font-medium">
                    <a href={`mailto:${msg.sender_email}`}>{msg.sender_email}</a>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
              
              {msg.subject && <h4 className="font-medium text-foreground mb-2">Subj: {msg.subject}</h4>}
              
              <div className="bg-background border border-border p-4 rounded-lg text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {msg.body}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                {msg.status === 'new' && (
                  <button 
                    onClick={() => handleStatusChange(msg.id, 'read')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Read
                  </button>
                )}
                {msg.status !== 'replied' && (
                  <button 
                    onClick={() => handleStatusChange(msg.id, 'replied')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border hover:bg-muted rounded-md"
                  >
                    <Reply className="w-4 h-4" /> Mark Replied
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md ml-auto"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
