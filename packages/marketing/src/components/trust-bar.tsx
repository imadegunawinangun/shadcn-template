"use client"

import React from "react"
import { cn } from "@workspace/ui/lib/utils"

interface TrustBarProps {
  variant?: string
  logos?: string[]
  title?: string
}

export function TrustBar({ variant, logos = [], title = "Dipercaya oleh tim di seluruh dunia" }: TrustBarProps) {
  const displayLogos = logos.length > 0 ? logos : ["Acme", "Globex", "Soylent", "Initech", "Umbrella"]

  // Variant 022: inverted accent row — uses theme foreground as contrast background
  if (variant === '022') {
    return (
      <section className="py-12 bg-foreground text-background overflow-hidden">
        <div className="container px-4 mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-8">{title}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40">
             {displayLogos.map((logo, i) => (
               <span key={i} className="text-2xl font-black italic tracking-tighter">{logo}</span>
             ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-background border-y border-border overflow-hidden">
      <div className="container px-4 mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">{title}</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40">
           {displayLogos.map((logo, i) => (
             <span key={i} className="text-2xl font-black italic tracking-tighter text-foreground">{logo}</span>
           ))}
        </div>
      </div>
    </section>
  )
}
