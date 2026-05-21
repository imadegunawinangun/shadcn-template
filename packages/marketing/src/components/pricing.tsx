"use client"

import React from "react"
import { Button } from "@workspace/ui/components/button"
import { Check, Sparkles } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface Tier {
  name: string
  price: string
  description?: string
  features: string[]
  featured?: boolean
  badge?: string
}

interface PricingProps {
  variant?: string
  title?: string
  subtitle?: string
  currency?: string
  period?: string
  ctaLabel?: string
  tiers?: Tier[]
}

const DEFAULT_TIERS: Tier[] = [
  {
    name: "Starter",
    price: "0",
    description: "Ideal untuk bisnis baru yang ingin mulai digitalisasi.",
    features: ["1 Unit Bisnis / Toko", "3 Anggota Tim", "Laporan Dasar", "Global Search (⌘K)"],
  },
  {
    name: "Pro",
    price: "299k",
    description: "Paling populer untuk bisnis yang sedang berkembang.",
    features: ["Hingga 5 Unit Bisnis", "Tim Tidak Terbatas", "Manajemen Stok Lanjutan", "Kustomisasi Tema"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "999k",
    description: "Untuk perusahaan besar dengan kebutuhan khusus.",
    features: ["Unit Bisnis Tidak Terbatas", "Admin Console Lanjutan", "Security Audit Logs", "Support Prioritas"],
  },
]

export function Pricing({ 
  variant, 
  title = "Investasi Bisnis", 
  subtitle, 
  currency = "IDR",
  period = "/ bln",
  ctaLabel = "Pilih Paket",
  tiers = DEFAULT_TIERS 
}: PricingProps) {
  
  // --- VARIANT: Single Action (e.g. 087) ---
  // Uses bg-foreground/5 + border-border so it works on light AND dark themes
  if (variant === '087') {
    return (
      <section className="py-24 bg-foreground/5 text-foreground">
        <div className="container px-4 mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic text-foreground">{title}</h2>
          <div className="bg-background border border-border rounded-3xl p-12 md:p-24 max-w-4xl mx-auto space-y-8 shadow-xl">
             <div className="text-6xl md:text-8xl font-black tracking-tighter text-primary">{tiers[0]?.name}</div>
             <p className="text-xl text-muted-foreground font-medium">{tiers[0]?.description}</p>
             <div className="text-4xl font-black italic text-foreground">HANYA {currency} {tiers[0]?.price} <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{period}</span></div>
             <Button size="lg" className="h-20 px-12 rounded-xl text-2xl font-black shadow-2xl shadow-primary/40">
               {ctaLabel} <Sparkles className="ml-2" />
             </Button>
          </div>
        </div>
      </section>
    )
  }

  // --- DEFAULT VARIANT: Modern Tiers (e.g. 086) ---
  return (
    <section className="py-24 px-4 bg-background text-foreground">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground">{title}</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
            {subtitle || "Skalakan bisnis Anda sesuai kebutuhan tanpa biaya tersembunyi."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div 
              key={index}
              className={cn(
                "p-12 rounded-3xl border-2 transition-all flex flex-col group",
                tier.featured 
                  ? "bg-primary text-primary-foreground shadow-3xl shadow-primary/30 scale-105 z-10 border-primary" 
                  : "bg-card border-border hover:border-primary/30 hover:scale-[1.02]"
              )}
            >
              <div className="mb-10">
                {tier.badge && (
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground mb-4">
                    {tier.badge}
                  </div>
                )}
                <h3 className={cn("text-xs font-black uppercase tracking-[0.2em] mb-4", tier.featured ? "text-primary-foreground/70" : "text-primary")}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter italic">{currency} {tier.price}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{period}</span>
                </div>
                {tier.description && <p className={cn("mt-6 text-sm leading-relaxed font-medium", tier.featured ? "text-primary-foreground/70" : "text-muted-foreground")}>{tier.description}</p>}
              </div>

              <div className="h-px bg-current opacity-10 mb-10" />

              <ul className="space-y-5 mb-12 flex-1">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-4 font-bold text-sm">
                    <div className={cn("mt-1 size-5 rounded-full flex items-center justify-center shrink-0", tier.featured ? "bg-primary-foreground/20" : "bg-primary/10")}>
                      <Check className={cn("size-3", tier.featured ? "text-primary-foreground" : "text-primary")} />
                    </div>
                    <span className="opacity-90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.featured ? "secondary" : "default"} 
                className={cn(
                  "w-full h-16 rounded-xl font-black text-lg uppercase tracking-tight shadow-xl transition-all active:scale-95",
                  tier.featured ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""
                )}
              >
                {ctaLabel} {tier.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
