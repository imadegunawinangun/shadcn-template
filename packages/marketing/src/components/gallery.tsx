"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "../types";

interface GalleryProps {
  variant?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  items?: any[];
}

export function GallerySection({ variant, title, subtitle, ctaText, items = [1, 2, 3, 4, 5, 6] }: GalleryProps) {
  const displayCta = ctaText || "View Work";
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            {title || "Our Gallery"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {subtitle || "A visual journey through our work and achievements."}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="aspect-square rounded-3xl bg-muted overflow-hidden relative group border shadow-sm"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                 <span className="text-primary-foreground font-black uppercase tracking-widest text-sm">{displayCta}</span>
              </div>
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                 <span className="text-primary/10 font-black text-4xl">0{i + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
