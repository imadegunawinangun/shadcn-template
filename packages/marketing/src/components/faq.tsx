"use client"

import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  variant?: string
  title?: string
  subtitle?: string
  items?: FAQItem[]
  faqs?: FAQItem[] // alias used by puck.config
}

const DEFAULT_FAQ: FAQItem[] = [
  { question: "Apakah saya bisa membatalkan langganan kapan saja?", answer: "Ya, Anda dapat membatalkan langganan Anda kapan saja melalui pengaturan akun tanpa biaya tambahan." },
  { question: "Bagaimana cara kerja custom domain?", answer: "Anda dapat menghubungkan domain Anda sendiri dengan mengikuti panduan DNS kami yang sederhana. Kami juga menyediakan sertifikat SSL gratis." },
  { question: "Apakah ada dukungan teknis 24/7?", answer: "Tentu! Tim dukungan kami siap membantu Anda kapan saja melalui live chat dan email." },
]

export function FAQ({ variant, title = "Pertanyaan Umum", subtitle, items, faqs }: FAQProps) {
  // Support both prop names: faqs (from puck.config) and items (direct usage)
  const displayItems = (faqs?.length ? faqs : items?.length ? items : DEFAULT_FAQ)

  return (
    <section className="py-24 bg-background text-foreground">
      <div className="container px-4 mx-auto max-w-3xl">
        <h2 className="text-4xl font-black tracking-tighter text-center mb-4 uppercase italic text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-center mb-12 text-lg">{subtitle}</p>}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {displayItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-2 border-border rounded-2xl px-8 py-2 overflow-hidden hover:border-primary/50 transition-colors bg-card">
              <AccordionTrigger className="text-left font-bold text-lg py-6 hover:no-underline tracking-tight text-foreground">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-8">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
