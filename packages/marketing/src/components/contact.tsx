"use client";

import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";

interface ContactProps {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  emailLabel?: string;
  phoneLabel?: string;
  addressLabel?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  ctaLabel?: string;
}

export function Contact({ 
  title, 
  subtitle, 
  email, 
  phone, 
  address,
  emailLabel = "Email",
  phoneLabel = "Telepon",
  addressLabel = "Lokasi",
  namePlaceholder = "Nama Lengkap",
  emailPlaceholder = "Email Anda",
  messagePlaceholder = "Pesan Anda...",
  ctaLabel = "Kirim Pesan"
}: ContactProps) {
  return (
    <section className="py-24 px-4 bg-background border-t">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">
                {title || "Hubungi Kami"}
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                {subtitle || "Punya pertanyaan atau ingin memulai proyek? Tim kami siap membantu Anda mewujudkan ide menjadi kenyataan."}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mail className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground">{emailLabel}</p>
                  <p className="font-bold text-lg">{email || "hello@workspace.com"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Phone className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground">{phoneLabel}</p>
                  <p className="font-bold text-lg">{phone || "+62 812 3456 7890"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground">{addressLabel}</p>
                  <p className="font-bold text-lg">{address || "Jakarta, Indonesia"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-10 rounded-3xl border-2 border-dashed border-primary/20 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input placeholder={namePlaceholder} className="h-14 rounded-2xl bg-background border-none shadow-sm" />
              </div>
              <div className="space-y-2">
                <Input placeholder={emailPlaceholder} className="h-14 rounded-2xl bg-background border-none shadow-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Textarea placeholder={messagePlaceholder} className="min-h-[150px] rounded-2xl bg-background border-none shadow-sm p-6" />
            </div>
            <Button className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20">
              <Send className="size-5 mr-2" /> {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
