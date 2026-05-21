"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface ComparisonProps {
  title?: string;
  subtitle?: string;
  featureLabel?: string;
  usLabel?: string;
  othersLabel?: string;
  features?: { name: string; us: boolean; others: boolean }[];
}

export function Comparison({ 
  title, 
  subtitle, 
  featureLabel = "Fitur Utama",
  usLabel = "Platform Kami",
  othersLabel = "Lainnya",
  features 
}: ComparisonProps) {
  const displayFeatures = features || [
    { name: "Kecepatan Akses", us: true, others: false },
    { name: "Custom Branding", us: true, others: true },
    { name: "Support 24/7", us: true, others: false },
    { name: "Tanpa Biaya Admin", us: true, others: false },
    { name: "Keamanan Enterprise", us: true, others: true }
  ];

  return (
    <section className="py-24 px-4 bg-muted/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase">
            {title || "Mengapa Kami Berbeda?"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {subtitle || "Bandingkan fitur kami dengan solusi konvensional lainnya."}
          </p>
        </div>

        <div className="bg-background rounded-3xl border-2 shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-8 text-sm font-black uppercase tracking-widest text-muted-foreground">{featureLabel}</th>
                <th className="p-8 text-center text-sm font-black uppercase tracking-widest text-primary bg-primary/5">{usLabel}</th>
                <th className="p-8 text-center text-sm font-black uppercase tracking-widest text-muted-foreground">{othersLabel}</th>
              </tr>
            </thead>
            <tbody>
              {displayFeatures.map((feature, i) => (
                <motion.tr 
                  key={i} 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b last:border-0 hover:bg-muted/10 transition-colors"
                >
                  <td className="p-8 font-bold text-foreground/80">{feature.name}</td>
                  <td className="p-8 text-center bg-primary/5">
                    {feature.us ? (
                      <Check className="mx-auto size-6 text-primary stroke-[3]" />
                    ) : (
                      <X className="mx-auto size-6 text-muted/30" />
                    )}
                  </td>
                  <td className="p-8 text-center">
                    {feature.others ? (
                      <Check className="mx-auto size-6 text-muted/40" />
                    ) : (
                      <X className="mx-auto size-6 text-red-400/50" />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
