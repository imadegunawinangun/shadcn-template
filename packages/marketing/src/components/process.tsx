"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";

interface ProcessProps {
  variant?: string;
  title?: string;
  subtitle?: string;
  steps?: { title: string; description: string }[];
}

export function Process({ variant, title, subtitle, steps }: ProcessProps) {
  const displaySteps = steps || [
    { title: "Strategi", description: "Kami menganalisis kebutuhan bisnis Anda secara mendalam." },
    { title: "Eksekusi", description: "Tim kami membangun solusi dengan teknologi terbaru." },
    { title: "Optimasi", description: "Penyempurnaan berkelanjutan untuk hasil maksimal." }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase italic">
            {title || "Cara Kerja Kami"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subtitle || "Proses terukur untuk memastikan kesuksesan proyek Anda dari awal hingga akhir."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {displaySteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 bg-muted/30 rounded-3xl border-2 border-transparent hover:border-primary/20 transition-all group"
            >
              <div className="size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black mb-6 rotate-3 group-hover:rotate-0 transition-transform shadow-xl shadow-primary/20">
                0{i + 1}
              </div>
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed italic">{step.description}</p>
              
              {i < displaySteps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-4 w-8 h-0.5 bg-muted-foreground/10 z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
