"use client"

import { useState, useEffect } from "react"
import { adminUpdateSiteConfig } from "@/app/actions/admin"
import { clientGetSiteConfig } from "@/lib/data/client"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { FormField, Input, Textarea } from "@/components/admin/modal"

export default function SiteSettings() {
  const [config, setConfig] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { clientGetSiteConfig().then(setConfig) }, [])

  if (!config) return <div className="text-muted-foreground animate-pulse">Loading settings...</div>

  const f = (k: string, v: any) => setConfig((p: any) => ({ ...p, [k]: v }))
  const fSocial = (k: string, v: any) => setConfig((p: any) => ({ ...p, socials: { ...p.socials, [k]: v } }))
  const fSeo = (k: string, v: any) => setConfig((p: any) => ({ ...p, seo: { ...p.seo, [k]: v } }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await adminUpdateSiteConfig(config)
      toast.success("Settings saved")
    } catch (e: any) { toast.error("Save failed: " + e.message) }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-8 pb-24">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-serif font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Global configuration for your Career OS</p>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Identity */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-lg">Identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Owner Name">
            <Input value={config.owner_name || ""} onChange={e => f("owner_name", e.target.value)} />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={config.email || ""} onChange={e => f("email", e.target.value)} />
          </FormField>
        </div>
        <FormField label="Tagline">
          <Input value={config.tagline || ""} onChange={e => f("tagline", e.target.value)} />
        </FormField>
        <FormField label="Short Bio (Hero)">
          <Textarea value={config.bio_short || ""} onChange={e => f("bio_short", e.target.value)} rows={2} />
        </FormField>
        <FormField label="Long Bio (About Page, Markdown)">
          <Textarea value={config.bio_long || ""} onChange={e => f("bio_long", e.target.value)} rows={6} />
        </FormField>
      </section>

      {/* Social Links */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-lg">Social Links</h2>
        <div className="grid grid-cols-2 gap-4">
          {["github", "twitter", "linkedin", "instagram", "substack", "upwork"].map(key => (
            <FormField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
              <Input
                type="url"
                value={config.socials?.[key] || ""}
                onChange={e => fSocial(key, e.target.value)}
                placeholder="https://..."
              />
            </FormField>
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-lg">SEO</h2>
        <FormField label="Meta Title">
          <Input value={config.seo?.title || ""} onChange={e => fSeo("title", e.target.value)} />
        </FormField>
        <FormField label="Meta Description">
          <Textarea value={config.seo?.description || ""} onChange={e => fSeo("description", e.target.value)} rows={3} />
        </FormField>
        <FormField label="Keywords (comma separated)">
          <Input value={(config.seo?.keywords || []).join(", ")} onChange={e => fSeo("keywords", e.target.value.split(",").map((s: string) => s.trim()))} />
        </FormField>
      </section>

      {/* Feature Flags */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-lg">Feature Toggles</h2>
        {[
          { key: "show_writing", label: "Show Writing section" },
          { key: "show_services", label: "Show Services page" },
          { key: "show_testimonials", label: "Show Testimonials" },
          { key: "show_resume", label: "Show Resume page" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-10 h-6 rounded-full relative transition-colors ${config[key] ? "bg-primary" : "bg-muted"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${config[key] ? "translate-x-5" : "translate-x-1"}`} />
              <input type="checkbox" checked={!!config[key]} onChange={e => f(key, e.target.checked)} className="sr-only" />
            </div>
            <span className="text-sm font-medium">{label}</span>
          </label>
        ))}
      </section>
    </form>
  )
}
