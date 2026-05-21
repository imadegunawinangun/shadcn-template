"use client"

import React from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@workspace/ui/components/carousel"
import { cn } from "@workspace/ui/lib/utils"

interface Testimonial {
  name: string
  role?: string
  content?: string // field name from puck.config
  text?: string   // alias used in template-data.ts
  avatar?: string
}

interface TestimonialsProps {
  variant?: string
  title?: string
  subtitle?: string
  testimonials?: Testimonial[]
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: "Andi Saputra", role: "CEO at TechFlow", content: "Platform ini mengubah cara kami mengelola landing page. Sangat cepat dan intuitif!" },
  { name: "Siti Aminah", role: "Marketing Lead", content: "Koleksi komponennya sangat lengkap. Kami bisa meluncurkan kampanye baru dalam hitungan menit." },
  { name: "Budi Utomo", role: "Product Designer", content: "Desain yang dihasilkan sangat modern dan responsif. Sangat direkomendasikan!" },
]

export function Testimonials({ variant, title = "Apa Kata Mereka?", subtitle, testimonials = DEFAULT_TESTIMONIALS }: TestimonialsProps) {
  // Support both content (puck.config) and text (template-data) field names
  const items = testimonials.map(t => ({ ...t, displayText: t.content || t.text || "" }))

  if (variant === '027') {
    return (
      <section className="py-24 bg-muted/30 text-foreground">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-black tracking-tighter text-center mb-4 uppercase italic text-foreground">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-center mb-12">{subtitle}</p>}
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {items.map((t, i) => (
                <CarouselItem key={i}>
                  <div className="p-1">
                    <Card className="border-none shadow-none bg-transparent">
                      <CardContent className="flex flex-col items-center text-center p-6 space-y-6">
                        <QuoteIcon className="size-12 text-primary/20" />
                        <p className="text-2xl font-medium italic leading-relaxed text-foreground">"{t.displayText}"</p>
                        <div className="flex flex-col items-center">
                          <Avatar className="size-16 border-2 border-primary/20 mb-4">
                            <AvatarImage src={t.avatar} />
                            <AvatarFallback>{t.name[0]}</AvatarFallback>
                          </Avatar>
                          <h4 className="font-bold text-lg text-foreground">{t.name}</h4>
                          <p className="text-sm text-muted-foreground">{t.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-background text-foreground">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-black tracking-tighter text-center mb-4 uppercase italic text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-center mb-12 text-lg max-w-2xl mx-auto">{subtitle}</p>}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t, i) => (
            <Card key={i} className="rounded-3xl border-2 border-border hover:border-primary/50 transition-all duration-300 group bg-card">
              <CardContent className="p-8 space-y-6">
                <p className="text-muted-foreground leading-relaxed italic">"{t.displayText}"</p>
                <div className="flex items-center gap-4">
                  <Avatar className="size-12 border-2 border-muted group-hover:border-primary/20 transition-colors">
                    <AvatarImage src={t.avatar} />
                    <AvatarFallback>{t.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold tracking-tight text-foreground">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 2.5 1 4.5 4 5" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 5" />
    </svg>
  )
}
