"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight, Sparkles, Layout } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface HeroProps {
  variant?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  badge?: string
  ctaText?: React.ReactNode
  secondaryCtaText?: string
  onCtaClick?: () => void
}

export function Hero({ variant, title, subtitle, badge, ctaText, secondaryCtaText, onCtaClick }: HeroProps) {
  const words = typeof title === "string" ? title.split(" ") : [];
  const displaySubtitle = subtitle || "";
  const displayCta = ctaText || "Mulai Sekarang";
  const displaySecondaryCta = secondaryCtaText || "Learn More";
  const displayBadge = badge || "Digital Excellence";

  // --- VARIANT: Centered (e.g. 003) ---
  if (variant === '003' || variant === '010') {
    return (
      <section className="relative py-32 px-4 flex flex-col items-center text-center overflow-hidden bg-background text-foreground">
        {/* Dot grid using currentColor so it adapts to theme */}
        <div className="absolute inset-0 opacity-[0.07] -z-10"
          style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl space-y-8"
        >
          <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-bold uppercase tracking-widest text-secondary-foreground">
            {displayBadge}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] uppercase italic text-foreground">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
            {displaySubtitle}
          </p>
          <div className="pt-4">
            <Button size="lg" className="h-16 px-10 rounded-full text-xl font-bold shadow-2xl shadow-primary/20" onClick={onCtaClick}>
              {displayCta}
            </Button>
          </div>
        </motion.div>
      </section>
    )
  }

  // --- VARIANT: Glassmorphism / Dark Accent (e.g. 004, 018) ---
  // Uses bg-foreground/5 and foreground/10 borders so it works with ANY theme
  if (variant === '004' || variant === '018') {
    return (
      <section className="relative py-40 px-4 bg-foreground/5 text-foreground overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent -z-10" />
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-border">
              <Sparkles className="size-3" /> {displayBadge}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase text-foreground">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              {displaySubtitle}
            </p>
            <Button size="lg" className="h-14 px-8 rounded-xl text-lg font-bold shadow-xl shadow-primary/30" onClick={onCtaClick}>
              {displayCta} <ArrowRight className="ml-2" />
            </Button>
          </div>
          <div className="flex-1 w-full max-w-2xl aspect-video bg-muted border border-border rounded-3xl shadow-2xl flex items-center justify-center relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <Layout className="size-20 text-muted-foreground/20" />
          </div>
        </div>
      </section>
    )
  }

  // --- DEFAULT VARIANT: Split Layout (e.g. 001, 002, 011) ---
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-background text-foreground">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-secondary-foreground/10">
            <Sparkles className="h-4 w-4" />
            {displayBadge}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-foreground">
            {typeof title === "string" ? (
              words.map((word, i) => (
                <span key={i} className={i % 2 === 1 ? "text-primary italic" : ""}>
                  {word}{" "}
                </span>
              ))
            ) : (
              title
            )}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            {displaySubtitle}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="h-16 px-10 rounded-xl text-xl font-bold shadow-xl shadow-primary/20 group" onClick={onCtaClick}>
              {displayCta}
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-xl text-xl font-bold border-2">
              {displaySecondaryCta}
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 w-full max-w-xl aspect-square relative"
        >
          <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6 scale-95" />
          <div className="absolute inset-0 bg-secondary/10 rounded-3xl -rotate-3 scale-95" />
          <div className="relative h-full w-full bg-card border shadow-2xl rounded-3xl overflow-hidden p-8 flex flex-col justify-center gap-4">
             <div className="h-4 w-1/3 bg-muted rounded-full" />
             <div className="h-4 w-full bg-muted/40 rounded-full" />
             <div className="h-4 w-2/3 bg-muted/40 rounded-full" />
             <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="h-24 bg-primary/5 rounded-2xl" />
                <div className="h-24 bg-primary/5 rounded-2xl" />
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
