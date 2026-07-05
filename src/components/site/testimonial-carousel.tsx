"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"

export function TestimonialCarousel({ testimonials }: { testimonials: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  if (!testimonials || testimonials.length === 0) return null

  const next = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative max-w-4xl mx-auto px-12 py-8 bg-card border border-border rounded-2xl">
      <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20 -z-10" />
      
      <div className="relative h-[200px] sm:h-[160px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center w-full"
          >
            <p className="text-lg md:text-xl font-serif italic text-foreground mb-6 leading-relaxed">
              "{testimonials[currentIndex].quote}"
            </p>
            <div className="flex flex-col items-center">
              <span className="font-bold">{testimonials[currentIndex].author_name}</span>
              <span className="text-sm text-muted-foreground font-mono mt-1">
                {testimonials[currentIndex].author_role}
                {testimonials[currentIndex].source && ` • ${testimonials[currentIndex].source}`}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {testimonials.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(idx)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
