import type { Metadata } from "next"
import { inter, playfairDisplay, jetbrainsMono } from "@/lib/fonts"
import "./globals.css"
import { ThemeProvider } from "@/components/site/theme-provider"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Abdul-Azeez — Full-Stack AI Developer & Author",
  description: "Full-Stack AI Developer specializing in Next.js, TypeScript, and AI integrations. Author of the Remnants series.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
