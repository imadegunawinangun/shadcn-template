"use client"

import React from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { cn } from "@workspace/ui/lib/utils"

interface Member {
  name: string
  role: string
  avatar?: string
}

interface TeamProps {
  variant?: string
  title?: string
  subtitle?: string
  members?: Member[]
}

const DEFAULT_MEMBERS: Member[] = [
  { name: "Sari Devi", role: "CEO & Founder" },
  { name: "Bagus Putra", role: "CTO" },
  { name: "Wayan Jaya", role: "Head of Product" },
  { name: "Kadek Lestari", role: "Marketing Director" }
]

export function Team({ variant, title = "Tim Kami", subtitle, members = DEFAULT_MEMBERS }: TeamProps) {
  
  // --- VARIANT: Simple Circle (e.g. 077) ---
  if (variant === '077') {
    return (
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl font-black tracking-tighter mb-16 uppercase italic">{title}</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {members.map((member, i) => (
              <div key={i} className="space-y-4">
                <Avatar className="size-32 border-4 border-muted hover:border-primary transition-colors mx-auto">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-2xl font-black">{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-black tracking-tighter text-xl uppercase italic">{member.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // --- DEFAULT VARIANT: Modern Grid (e.g. 076) ---
  return (
    <section className="py-24 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">{title}</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {subtitle || "Tim ahli kami berdedikasi untuk kesuksesan bisnis Anda."}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {members.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-[4/5] rounded-3xl bg-card border-2 border-transparent group-hover:border-primary/20 mb-6 overflow-hidden relative shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                  <Avatar className="size-full rounded-none">
                    <AvatarImage src={member.avatar} className="object-cover" />
                    <AvatarFallback className="text-4xl font-black opacity-10 uppercase italic">{member.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-black text-xl tracking-tighter uppercase italic group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black mt-1 opacity-60">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
