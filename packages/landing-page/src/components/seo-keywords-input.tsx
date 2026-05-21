"use client";

import React, { useState, useRef } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { X, Search, Sparkles, Plus, Check } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface SEOKeywordsInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const PRESET_TOPICS = [
  {
    id: "saas",
    label: "🚀 SaaS",
    suggestions: ["software as a service", "aplikasi cloud", "platform saas", "otomatisasi bisnis", "productivity tool", "startup indonesia", "premium software", "solusi digital"]
  },
  {
    id: "agency",
    label: "💼 Jasa / Agensi",
    suggestions: ["digital agency", "jasa branding", "marketing agency", "konsultasi bisnis", "jasa pembuatan website", "desain grafis", "solusi bisnis", "creative agency"]
  },
  {
    id: "ecommerce",
    label: "🛒 E-Commerce",
    suggestions: ["toko online", "belanja online", "produk original", "gratis ongkir", "promo diskon", "belanja hemat", "fashion indonesia", "best seller"]
  },
  {
    id: "creative",
    label: "🎨 Portfolio",
    suggestions: ["portofolio desain", "fotografi profesional", "videografer", "desain kreatif", "studio seni", "galeri karya", "freelance desainer", "karya seni"]
  },
  {
    id: "education",
    label: "🎓 Edukasi",
    suggestions: ["kursus online", "belajar coding", "bimbingan belajar", "kelas online", "pelatihan bisnis", "sertifikasi profesional", "edutech indonesia", "materi belajar"]
  },
  {
    id: "health",
    label: "🏥 Kesehatan",
    suggestions: ["klinik kesehatan", "dokter spesialis", "gaya hidup sehat", "konsultasi dokter", "tips kesehatan", "suplemen herbal", "layanan medis", "kesehatan keluarga"]
  }
];

export function SEOKeywordsInput({
  value,
  onChange,
  placeholder = "Ketik kata kunci + Tekan Enter..."
}: SEOKeywordsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse keywords from comma-separated string
  const keywords = value
    ? value
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
    : [];

  const addKeyword = (word: string) => {
    const trimmed = word.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      const newKeywords = [...keywords, trimmed];
      onChange(newKeywords.join(", "));
    }
    setInputValue("");
  };

  const removeKeyword = (indexToRemove: number) => {
    const newKeywords = keywords.filter((_, idx) => idx !== indexToRemove);
    onChange(newKeywords.join(", "));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(inputValue);
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      removeKeyword(keywords.length - 1);
    }
  };

  // Generate dynamic keywords based on custom topic
  const generateDynamicSuggestions = (topic: string) => {
    const t = topic.trim().toLowerCase();
    if (!t) return [];
    return [
      `${t} terbaik`,
      `jasa ${t}`,
      `aplikasi ${t}`,
      `platform ${t}`,
      `${t} indonesia`,
      `solusi ${t}`,
      `promo ${t}`,
      `belanja ${t}`
    ];
  };

  // Resolve active suggestions list
  const activeSuggestions = (() => {
    if (customTopic) {
      return generateDynamicSuggestions(customTopic);
    }
    if (selectedPreset) {
      return PRESET_TOPICS.find((p) => p.id === selectedPreset)?.suggestions || [];
    }
    return [];
  })();

  // Filter out suggestions that are already in active keywords list
  const filteredSuggestions = activeSuggestions.filter(
    (sug) => !keywords.map((k) => k.toLowerCase()).includes(sug.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Help text */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-muted-foreground leading-relaxed">
          Masukkan kata kunci pencarian. Tekan <kbd className="bg-muted px-1 py-0.5 rounded border border-border shadow-sm text-[9px] font-mono">Enter</kbd> atau <kbd className="bg-muted px-1 py-0.5 rounded border border-border shadow-sm text-[9px] font-mono">,</kbd> untuk memisahkan.
        </span>
      </div>

      {/* Main input wrapper and tags */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "min-h-12 w-full rounded-xl border border-input bg-background/50 p-2 flex flex-wrap gap-1.5 cursor-text transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50"
        )}
      >
        {keywords.map((word, idx) => (
          <Badge 
            key={`${word}-${idx}`} 
            variant="secondary" 
            className="rounded-full pl-2.5 pr-1 py-0.5 text-xs font-medium bg-secondary/80 hover:bg-secondary flex items-center gap-1 group border border-border/45 animate-in fade-in-50 zoom-in-95 duration-150"
          >
            <span className="text-foreground/90">{word}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeKeyword(idx);
              }}
              className="size-4 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
            >
              <X className="size-2.5" />
            </button>
          </Badge>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addKeyword(inputValue)}
          placeholder={keywords.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent border-0 p-0 text-xs focus:ring-0 outline-none min-w-[120px] h-6 placeholder:text-muted-foreground"
        />
      </div>

      {/* Topic Recommendations Widget */}
      <div className="p-3 bg-muted/30 rounded-xl border border-border/60 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" />
          <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider">Rekomendasi Topik</span>
        </div>

        {/* Preset selections */}
        <div className="flex flex-wrap gap-1 max-h-[72px] overflow-y-auto pr-1">
          {PRESET_TOPICS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setSelectedPreset(selectedPreset === preset.id ? null : preset.id);
                setCustomTopic(""); // Clear custom topic if preset is clicked
              }}
              className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-semibold border transition-all cursor-pointer",
                selectedPreset === preset.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground/75 border-border hover:bg-muted"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom topic input */}
        <div className="relative">
          <Input
            placeholder="Atau tulis topik kustom (contoh: kuliner, fintech)..."
            value={customTopic}
            onChange={(e) => {
              setCustomTopic(e.target.value);
              setSelectedPreset(null); // Clear preset if typing custom topic
            }}
            className="h-7 text-[9px] rounded-lg pr-6 placeholder:text-muted-foreground/60 bg-background/50 border-muted"
          />
          {customTopic && (
            <button
              type="button"
              onClick={() => setCustomTopic("")}
              className="absolute right-2 top-1.5 text-muted-foreground hover:text-foreground size-4 flex items-center justify-center cursor-pointer"
            >
              <X className="size-2.5" />
            </button>
          )}
        </div>

        {/* Suggested keywords list */}
        {activeSuggestions.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-border/50 animate-in slide-in-from-top-1 duration-150">
            <span className="text-[9px] text-muted-foreground font-medium">
              Saran Kata Kunci {customTopic ? `"${customTopic}"` : ""}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {filteredSuggestions.length === 0 ? (
                <span className="text-[9px] text-muted-foreground/70 italic flex items-center gap-1">
                  <Check className="size-3 text-emerald-500" /> Semua saran topik ini sudah ditambahkan!
                </span>
              ) : (
                filteredSuggestions.map((sug, index) => (
                  <button
                    key={`${sug}-${index}`}
                    type="button"
                    onClick={() => addKeyword(sug)}
                    className="group px-2 py-0.5 rounded-full text-[9px] font-medium bg-background border border-border/70 hover:border-primary/60 hover:bg-primary/5 transition-all text-foreground/80 hover:text-primary flex items-center gap-1 cursor-pointer"
                  >
                    <span>{sug}</span>
                    <Plus className="size-2 text-muted-foreground group-hover:text-primary shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer controls */}
      {keywords.length > 0 && (
        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1 font-medium tracking-wide">
          <span className="flex items-center gap-1.5">
            <Search className="size-3 text-primary/60" />
            <span>{keywords.length} kata kunci terdaftar</span>
          </span>
          <button 
            type="button"
            onClick={() => onChange("")}
            className="hover:text-destructive transition-colors cursor-pointer"
          >
            Bersihkan semua
          </button>
        </div>
      )}
    </div>
  );
}
