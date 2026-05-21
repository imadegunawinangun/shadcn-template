"use client"

import React from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

interface Stat {
  label: string
  value: string
  description?: string
}

interface StatsProps {
  variant?: string
  title?: string
  stats?: Stat[]
}

const DEFAULT_STATS: Stat[] = [
  { label: "Pengguna Aktif", value: "10K+", description: "Bergabung setiap bulan" },
  { label: "Kecepatan Launch", value: "2 Menit", description: "Dari konsep ke live" },
  { label: "Kepuasan Klien", value: "99%", description: "Rating bintang 5" },
]

export function Stats({ variant, title, stats = DEFAULT_STATS }: StatsProps) {
  // Variant 025: high-contrast accent row — uses primary/muted accent but stays theme-aware
  if (variant === '025') {
    return (
      <section className="py-24 bg-foreground/5 text-foreground">
        <div className="container px-4 mx-auto">
          {title && <h2 className="text-3xl font-black tracking-tighter mb-16 uppercase italic text-center text-foreground">{title}</h2>}
          <div className="grid md:grid-cols-3 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="border-l-4 border-primary pl-8 space-y-2">
                <div className="text-5xl font-black tracking-tighter text-foreground">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                {stat.description && <p className="text-sm text-muted-foreground">{stat.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-background text-foreground">
      <div className="container px-4 mx-auto">
        {title && <h2 className="text-3xl font-black tracking-tighter mb-16 uppercase italic text-center text-foreground">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-none bg-muted/30 rounded-3xl">
              <CardContent className="p-10 text-center space-y-2">
                <div className="text-6xl font-black tracking-tighter text-primary">{stat.value}</div>
                <div className="text-sm font-black uppercase tracking-widest text-foreground">{stat.label}</div>
                {stat.description && <p className="text-xs text-muted-foreground">{stat.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
