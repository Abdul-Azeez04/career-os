"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import Search from "./search"

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/services" },
]

export default function Navbar({ ownerName }: { ownerName: string }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A0A0B]/80 backdrop-blur-md border-b border-[#2A2A2D] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight hover:text-[#D4A853] transition-colors relative z-50">
            {ownerName}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-[#D4A853] relative ${
                      isActive ? "text-[#EDEDEF]" : "text-[#8A8A8E]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-px bg-[#D4A853]"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-[#2A2A2D]">
              <Search />
              <Link
                href="/contact"
                className="px-4 py-2 bg-[#EDEDEF] text-[#0A0A0B] text-sm font-bold rounded-full hover:bg-[#D4A853] transition-colors"
              >
                Let's Talk
              </Link>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden relative z-50">
            <Search />
            <button
              className="p-2 -mr-2 text-[#EDEDEF]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[60px] bg-[#0A0A0B]/95 backdrop-blur-xl border-t border-[#2A2A2D] z-40 md:hidden flex flex-col"
          >
            <nav className="flex flex-col p-6 gap-6 text-lg">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-medium transition-colors ${
                      isActive ? "text-[#D4A853]" : "text-[#EDEDEF]"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="pt-6 border-t border-[#2A2A2D]">
                <Link
                  href="/contact"
                  className="block w-full py-4 bg-[#D4A853] text-[#0A0A0B] text-center font-bold rounded-xl"
                >
                  Let's Talk
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
