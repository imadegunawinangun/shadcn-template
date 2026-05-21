"use client"

import React from "react"
import { Button } from "@workspace/ui/components/button"
import { Rocket, ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface CTAProps {
  variant?: string
  title?: string
  subtitle?: string
  ctaText?: string
  onAction?: () => void
}

export function CTA({ 
  variant, 
  title, 
  subtitle,
  ctaText,
  onAction 
}: CTAProps) {
  const displayTitle = title || "Siap untuk Memulai?";
  const displaySubtitle = subtitle || "Bergabunglah dengan ribuan tim yang sudah menggunakan platform kami hari ini.";
  const displayCta = ctaText || "Mulai Sekarang Gratis";
  if (variant === '091') {
    return (
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="bg-primary rounded-3xl p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-foreground/10 to-transparent opacity-50" />
             <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase">{displayTitle}</h2>
               <p className="text-xl opacity-90 font-medium leading-relaxed">{displaySubtitle}</p>
               <Button size="lg" variant="secondary" className="h-16 px-10 rounded-xl text-xl font-bold shadow-2xl hover:scale-105 transition-transform" onClick={onAction}>
                 {displayCta}
                 <Rocket className="ml-2 size-6" />
               </Button>
             </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="bg-card border rounded-3xl p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-sm">
           <div className="space-y-4 max-w-2xl text-center md:text-left relative z-10">
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-foreground">{displayTitle}</h2>
             <p className="text-lg text-muted-foreground font-medium">{displaySubtitle}</p>
           </div>
           <Button size="lg" className="h-16 px-10 rounded-xl text-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform shrink-0 relative z-10" onClick={onAction}>
              {displayCta}
              <ArrowRight className="ml-2 size-6" />
           </Button>
        </div>
      </div>
    </section>
  )
}
