"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check, Shield, Zap, Globe, Smartphone, Heart, Layout, Sparkles } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface Feature {
  title: string
  description: string
  icon?: React.ReactNode
}

interface FeaturesProps {
  variant?: string
  title?: string
  subtitle?: string
  items?: Feature[]
}

const DEFAULT_FEATURES: Feature[] = [
  { title: "Isolasi Data Tinggi", description: "Satu codebase untuk ribuan organisasi dengan isolasi data tingkat tinggi.", icon: <Shield className="size-6" /> },
  { title: "Real-time Sync", description: "Transaksi yang super cepat dan tersinkronisasi secara otomatis.", icon: <Zap className="size-6" /> },
  { title: "Mobile Ready", description: "Dashboard responsif yang terlihat cantik di semua perangkat.", icon: <Smartphone className="size-6" /> },
  { title: "Global Search", description: "Cari data apa pun di seluruh organisasi dengan satu kali shortcut.", icon: <Globe className="size-6" /> },
  { title: "Dynamic Themes", description: "Ubah branding aplikasi secara real-time dari dashboard.", icon: <Heart className="size-6" /> },
  { title: "Smart UI", description: "Interface yang beradaptasi secara cerdas berdasarkan konteks.", icon: <Check className="size-6" /> },
]

export function Features({ variant, title = "Fitur Unggulan", subtitle, items = DEFAULT_FEATURES }: FeaturesProps) {
  
  // --- VARIANT: Bento Layout (e.g. 058) ---
  if (variant === '058') {
    return (
      <section className="py-24 bg-background text-foreground">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">{subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 bg-primary/5 border-border rounded-3xl border-2 p-10 flex flex-col justify-end gap-4 group hover:border-primary transition-all">
              <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform"><Sparkles /></div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">{items[0]?.title}</h3>
              <p className="text-lg text-muted-foreground font-medium">{items[0]?.description}</p>
            </div>
            <div className="bg-muted/30 rounded-3xl border-2 border-border p-8 flex flex-col justify-center gap-2 hover:border-primary/50 transition-all">
               <h3 className="font-black uppercase tracking-tighter text-foreground">{items[1]?.title}</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">{items[1]?.description}</p>
            </div>
            {/* Third card: uses accent bg so it stands out without forcing dark mode */}
            <div className="bg-foreground/5 border-2 border-border rounded-3xl p-8 flex flex-col justify-center gap-2 hover:scale-[1.02] transition-transform">
               <h3 className="font-black uppercase tracking-tighter text-foreground">{items[2]?.title}</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">{items[2]?.description}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // --- VARIANT: Alternating List (e.g. 057) ---
  if (variant === '057') {
    return (
      <section className="py-24 bg-background text-foreground overflow-hidden">
        <div className="container px-4 mx-auto space-y-32">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground">{title}</h2>
             {subtitle && <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">{subtitle}</p>}
          </div>
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className={cn("flex flex-col md:flex-row items-center gap-16", i % 2 === 1 && "md:flex-row-reverse")}>
              <div className="flex-1 space-y-6">
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-foreground">{item.title}</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
              <div className="flex-1 w-full aspect-video bg-muted rounded-3xl border-4 border-background shadow-2xl relative">
                 <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-3 scale-95" />
                 <div className="relative h-full w-full bg-card rounded-3xl flex items-center justify-center">
                    <Layout className="size-20 text-muted-foreground/20" />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // --- DEFAULT VARIANT: Grid (e.g. 056) ---
  return (
    <section className="py-24 px-4 bg-muted/20 text-foreground">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground">{title}</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {subtitle || "Segala yang Anda butuhkan untuk membangun dan menskalakan bisnis SaaS Anda dengan kecepatan cahaya."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-10 bg-card rounded-3xl border-2 border-transparent hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
            >
              <div className="size-14 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {item.icon || <Check className="size-6" />}
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-4 text-foreground">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
