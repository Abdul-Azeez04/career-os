"use client"

import { motion } from "motion/react"
import Link from "next/link"

export function Hero({ 
  name, 
  tagline,
  bioShort
}: { 
  name: string
  tagline: string | null
  bioShort: string | null
}) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <motion.h1 
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            {name}
          </motion.h1>
          
          {tagline && (
            <motion.div 
              className="font-mono text-primary text-lg md:text-xl mb-6 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {tagline}
            </motion.div>
          )}
          
          {bioShort && (
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              {bioShort}
            </motion.p>
          )}
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          >
            <Link 
              href="/services" 
              className="px-8 py-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(212,168,83,0.3)] hover:shadow-[0_0_25px_rgba(212,168,83,0.5)] w-full sm:w-auto"
            >
              Hire Me
            </Link>
            <Link 
              href="/writing" 
              className="px-8 py-4 rounded-md border border-border bg-card/50 text-foreground font-medium hover:bg-card hover:border-primary/50 transition-all w-full sm:w-auto"
            >
              Read My Work
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
