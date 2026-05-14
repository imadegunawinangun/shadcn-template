"use client"

import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface HeroProps {
  title: string
  subtitle: string
  ctaText: string
  onCtaClick?: () => void
}

export function Hero({ title, subtitle, ctaText, onCtaClick }: HeroProps) {
  return (
    <section className="relative py-24 px-4 overflow-hidden flex flex-col items-center text-center">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
          <Sparkles className="h-4 w-4" />
          The Ultimate SaaS Template
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
          {title.split(" ").map((word, i) => (
            <span key={i} className={i % 2 === 1 ? "text-primary italic" : ""}>
              {word}{" "}
            </span>
          ))}
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group" onClick={onCtaClick}>
            {ctaText}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-lg font-bold">
            Live Demo
          </Button>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="mt-20 w-full max-w-6xl aspect-video rounded-3xl border bg-card/50 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
            <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-500/20" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
               <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <div className="h-4 w-64 bg-muted rounded-full" />
         </div>
         <div className="p-8 space-y-4">
            <div className="h-8 w-1/3 bg-muted rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
               <div className="h-32 bg-muted rounded-xl" />
               <div className="h-32 bg-muted rounded-xl" />
               <div className="h-32 bg-muted rounded-xl" />
            </div>
         </div>
      </div>
    </section>
  )
}
