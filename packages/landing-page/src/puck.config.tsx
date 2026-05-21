"use client";

import React, { createContext, useContext } from "react";
import type { Config } from "@puckeditor/core";
import { 
  Hero, 
  Features, 
  Pricing, 
  Team, 
  GallerySection,
  TrustBar,
  Testimonials,
  Stats,
  FAQ,
  CTA,
  Process,
  Comparison,
  Contact
} from "@workspace/marketing";
import { ThemeCustomizer } from "@workspace/ui/components/theme-customizer";
import { ImagePicker } from "./components/image-picker";
import { SEOKeywordsInput } from "./components/seo-keywords-input";
import {
  SectionContainer,
  GridColumns,

  CardWrapper,
  BaseHeading,
  BaseParagraph,
  BaseButton,
  BaseImage
} from "./components/layout-atoms";

// Define context to share branding info down to Puck custom field renders and preview canvas
export const BrandingContext = createContext<{
  workspaceId: string;
  appId: string;
  fallbackConfigs?: any;
  activeTheme?: any;
  setActiveTheme: (theme: any) => void;
  resolvedTheme?: any;
  setResolvedTheme: (theme: any) => void;
  onSaveTheme: (config: any) => Promise<any>;
} | null>(null);

// Define the shape of our Puck blocks with multiple variants for 20+ section types
export type PuckProps = {
  // Tata Letak & Struktur
  SectionContainer: {
    paddingTop: "none" | "small" | "medium" | "large";
    paddingBottom: "none" | "small" | "medium" | "large";
    bgType: "default" | "muted" | "primary-subtle" | "dark";
    containerWidth: "fixed" | "full";
    content?: React.ReactNode;
  };
  GridColumns: {
    layout: "1/1" | "1/2 + 1/2" | "1/3 + 2/3" | "2/3 + 1/3" | "1/3 + 1/3 + 1/3" | "1/4 + 1/4 + 1/4 + 1/4";
    gap: "small" | "medium" | "large";
    alignItems: "start" | "center" | "stretch";
    column1?: React.ReactNode;
    column2?: React.ReactNode;
    column3?: React.ReactNode;
    column4?: React.ReactNode;
  };
  CardWrapper: {
    padding: "small" | "medium" | "large";
    borderStyle: "solid" | "dashed" | "none";
    shadow: "none" | "sm" | "md" | "lg";
    bgType: "card" | "muted" | "accent-subtle";
    content?: React.ReactNode;
  };

  // Elemen Dasar / Atoms
  BaseHeading: {
    text: string;
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    alignment: "left" | "center" | "right";
    size: "default" | "sm" | "lg" | "xl" | "2xl" | "3xl";
    fontUppercase: boolean;
    fontItalic: boolean;
  };
  BaseParagraph: {
    text: string;
    alignment: "left" | "center" | "right";
    size: "sm" | "base" | "lg";
    opacity: "high" | "medium" | "low";
  };
  BaseButton: {
    text: string;
    variant: "default" | "secondary" | "outline" | "ghost";
    size: "sm" | "default" | "lg";
    alignment: "left" | "center" | "right";
    url: string;
  };
  BaseImage: {
    src: string;
    alt: string;
    aspectRatio: "auto" | "square" | "video" | "wide";
    radius: "none" | "md" | "lg" | "full";
  };

  Hero: { title: string; subtitle: string; ctaText: string };
  
  // Fitur & Masalah
  Features: { title: string; subtitle: string; features: any[] };
  Services: { title: string; subtitle: string; features: any[] };
  Problems: { title: string; subtitle: string; features: any[] };
  Solution: { title: string; subtitle: string; features: any[] };
  Logic: { title: string; subtitle: string; features: any[] };
  Scarcity: { title: string; subtitle: string; features: any[] };
  Authority: { title: string; subtitle: string; features: any[] };
  Psych: { title: string; subtitle: string; features: any[] };
  Objections: { title: string; subtitle: string; features: any[] };
  Curiosity: { title: string; subtitle: string; features: any[] };
  
  // Konten & Informasi
  Content: { title: string; subtitle: string; features: any[] };
  Process: { title: string; subtitle: string; steps: any[] };
  Comparison: { title: string; subtitle: string; columns: any[] };
  Gallery: { title: string; subtitle: string; images: any[] };
  Stats: { title: string; stats: any[] };
  FAQ: { title: string; subtitle: string; faqs: any[] };
  Team: { title: string; subtitle: string; members: any[] };
  
  // Kredibilitas & Testimoni
  TrustBar: { title: string; companies: any[] };
  Press: { title: string; companies: any[] };
  Trust: { title: string; companies: any[] };
  Proof: { title: string; companies: any[] };
  Ratings: { title: string; companies: any[] };
  Social: { title: string; companies: any[] };
  Testimonials: { title: string; subtitle: string; testimonials: any[] };
  
  // Penawaran & Konversi
  Pricing: { title: string; subtitle: string; tiers: any[] };
  CTA: { title: string; subtitle: string; ctaText: string };
  Newsletter: { title: string; subtitle: string; ctaText: string };
  Countdown: { title: string; subtitle: string; ctaText: string };
  Conversion: { title: string; subtitle: string; ctaText: string };
  
  // Hubungi Kami
  Contact: { title: string; subtitle: string; email: string };
  SocialLinks: { title: string; subtitle: string; email: string };
  Legal: { title: string; subtitle: string; email: string };
};

// Define Root Props (Page-level settings like SEO, Branding, WordPress-style features)
export type RootProps = {
  title: string;
  status: string;
  metaDescription: string;
  metaKeywords: string;
  featuredImage: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robotsIndex: string;
  robotsFollow: string;
  theme: any;
};

const featuresFields = {
  title: { type: "text" },
  subtitle: { type: "textarea" },
  features: {
     type: "array",
     arrayFields: {
       title: { type: "text" },
       description: { type: "textarea" },
       icon: { type: "text" }
     }
  }
} as const;

const trustBarFields = {
  title: { type: "text" },
  companies: {
    type: "array",
    arrayFields: {
      name: { type: "text" }
    }
  }
} as const;

export const config: Config<PuckProps, RootProps> = {
  root: {
    fields: {
      theme: {
        type: "custom",
        label: "Branding & Theme Customizer",
        render: () => {
          const context = useContext(BrandingContext);
          if (!context) return <div className="text-xs p-2 text-muted-foreground">Loading theme customizer...</div>;
          
          const handleSave = async (themeConfig: any) => {
            const res = await context.onSaveTheme(themeConfig);
            if (res.success) {
              context.setActiveTheme(themeConfig);
              const newResolved = (themeConfig && Object.keys(themeConfig).length > 0)
                ? themeConfig
                : (context.fallbackConfigs?.app || context.fallbackConfigs?.workspace || null);
              context.setResolvedTheme(newResolved);
            }
            return res;
          };

          return (
            <div className="py-2 border-b pb-4 mb-4">
              <ThemeCustomizer 
                workspaceId={context.workspaceId} 
                appId={context.appId}
                fallbackConfig={context.fallbackConfigs?.app || context.fallbackConfigs?.workspace}
                initialConfig={context.activeTheme}
                onSave={handleSave}
                onChange={(tempConfig) => {
                  // Temporarily update preview canvas styles in real-time without saving to DB yet
                  context.setResolvedTheme(tempConfig);
                }}
              />
            </div>
          );
        }
      },
      title: { 
        type: "text", 
        label: "SEO Meta Title (Judul SEO)",
      },
      status: {
        type: "select",
        label: "Status Halaman",
        options: [
          { label: "Draft (Konsep)", value: "draft" },
          { label: "Published (Terbit)", value: "published" }
        ]
      },
      metaDescription: { 
        type: "textarea", 
        label: "SEO Meta Description (Deskripsi)",
      },
      metaKeywords: { 
        type: "custom", 
        label: "SEO Keywords (Kata Kunci)",
        render: ({ value, onChange }) => (
          <div className="py-1">
            <SEOKeywordsInput value={value || ""} onChange={onChange} />
          </div>
        )
      },

      featuredImage: { 
        type: "custom", 
        label: "Featured Image (Gambar Unggulan)",
        render: ({ value, onChange }) => (
          <div className="py-1">
            <ImagePicker value={value} onChange={onChange} label="Pilih Gambar Unggulan" />
          </div>
        )
      },
      ogTitle: { 
        type: "text", 
        label: "Open Graph / Social Title (Facebook/Twitter)",
      },
      ogDescription: { 
        type: "textarea", 
        label: "Open Graph / Social Description",
      },
      ogImage: { 
        type: "custom", 
        label: "Open Graph Image (Default: Featured Image)",
        render: ({ value, onChange }) => (
          <div className="py-1">
            <ImagePicker value={value} onChange={onChange} label="Pilih Gambar Social" />
          </div>
        )
      },
      canonicalUrl: { 
        type: "text", 
        label: "Canonical URL",
      },
      robotsIndex: { 
        type: "select", 
        label: "Robots Indexing",
        options: [
          { label: "Index (Izinkan mesin pencari merayapi)", value: "index" },
          { label: "Noindex (Sembunyikan dari hasil pencarian)", value: "noindex" }
        ]
      },
      robotsFollow: { 
        type: "select", 
        label: "Robots Follow Links",
        options: [
          { label: "Follow (Ikuti tautan di halaman)", value: "follow" },
          { label: "Nofollow (Jangan ikuti tautan)", value: "nofollow" }
        ]
      }
    },
    defaultProps: {
      title: "",
      status: "draft",
      metaDescription: "",
      metaKeywords: "",
      featuredImage: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      robotsIndex: "index",
      robotsFollow: "follow",
      theme: {}
    },
    render: ({ children }) => {
      // Connect visual editor preview canvas directly to the theme customizer's real-time state
      const context = useContext(BrandingContext);
      const theme = context?.resolvedTheme;
      
      const brandingStyle: any = {};
      if (theme?.color === "Custom" && theme.customColor) {
        brandingStyle["--primary" as any] = theme.customColor;
        brandingStyle["--ring" as any] = theme.customColor;
      }
      if (theme?.radius) {
        brandingStyle["--radius" as any] = theme.radius.includes("rem") ? theme.radius : `${theme.radius}rem`;
      }

      const themeAttributes = theme ? {
        "data-style": theme.style?.toLowerCase(),
        "data-base-color": theme.baseColor?.toLowerCase(),
        "data-theme": theme.color === "Custom" ? "custom" : theme.color?.toLowerCase(),
        "data-font-heading": theme.fontHeading?.toLowerCase(),
        "data-font-body": theme.fontBody?.toLowerCase(),
        "data-radius": theme.radius,
      } : {};

      // Dynamic Google Fonts Loader & CSS override for real-time editor preview
      const fontHeadingName = theme?.fontHeading || "Inter";
      const fontBodyName = theme?.fontBody || "Inter";

      const googleFontUrl = React.useMemo(() => {
        const fontsToLoad = new Set<string>();
        if (fontHeadingName) fontsToLoad.add(fontHeadingName);
        if (fontBodyName) fontsToLoad.add(fontBodyName);
        
        const fontQueries = Array.from(fontsToLoad)
          .map(f => `family=${f.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800&display=swap`)
          .join("&");
          
        return fontQueries ? `https://fonts.googleapis.com/css2?${fontQueries}` : "";
      }, [fontHeadingName, fontBodyName]);

      return (
        <div className="min-h-screen bg-background w-full transition-colors duration-300" style={brandingStyle} {...themeAttributes}>
          {googleFontUrl && (
            <link rel="stylesheet" href={googleFontUrl} />
          )}
          <style>{`
            /* Dynamically override font variables and force rendering inside the preview wrapper */
            .transition-colors {
              --font-heading: '${fontHeadingName}', sans-serif !important;
              --font-sans: '${fontBodyName}', sans-serif !important;
            }
            .transition-colors h1, .transition-colors h2, .transition-colors h3, .transition-colors h4, .transition-colors h5, .transition-colors h6,
            .puck-render h1, .puck-render h2, .puck-render h3, .puck-render h4, .puck-render h5, .puck-render h6 {
              font-family: '${fontHeadingName}', sans-serif !important;
            }
            .transition-colors p, .transition-colors span, .transition-colors button, .transition-colors a, .transition-colors li,
            .puck-render p, .puck-render span, .puck-render button, .puck-render a, .puck-render li {
              font-family: '${fontBodyName}', sans-serif !important;
            }
          `}</style>
          {children}
        </div>
      );
    }
  },
  categories: {
    layout: {
      title: "Tata Letak & Struktur",
      components: ["SectionContainer", "GridColumns", "CardWrapper"]
    },
    atoms: {
      title: "Elemen Dasar (Atoms)",
      components: ["BaseHeading", "BaseParagraph", "BaseButton", "BaseImage"]
    },
    hero: {
      title: "Hero & Header",
      components: ["Hero"]
    },
    features: {
      title: "Fitur & Masalah",
      components: ["Features", "Services", "Problems", "Solution", "Logic", "Scarcity", "Authority", "Psych", "Objections", "Curiosity"]
    },
    content: {
      title: "Konten & Informasi",
      components: ["Content", "Process", "Comparison", "Gallery", "Stats", "FAQ", "Team"]
    },
    social_proof: {
      title: "Kredibilitas & Testimoni",
      components: ["TrustBar", "Press", "Trust", "Proof", "Ratings", "Social", "Testimonials"]
    },
    conversion: {
      title: "Penawaran & Konversi",
      components: ["Pricing", "CTA", "Newsletter", "Countdown", "Conversion"]
    },
    contact: {
      title: "Hubungi Kami",
      components: ["Contact", "SocialLinks", "Legal"]
    }
  },
  components: {
    SectionContainer: {
      label: "Bungkus Section",
      fields: {
        paddingTop: {
          type: "select",
          label: "Padding Atas",
          options: [
            { label: "Tanpa Spasi", value: "none" },
            { label: "Kecil", value: "small" },
            { label: "Sedang", value: "medium" },
            { label: "Besar", value: "large" }
          ]
        },
        paddingBottom: {
          type: "select",
          label: "Padding Bawah",
          options: [
            { label: "Tanpa Spasi", value: "none" },
            { label: "Kecil", value: "small" },
            { label: "Sedang", value: "medium" },
            { label: "Besar", value: "large" }
          ]
        },
        bgType: {
          type: "select",
          label: "Warna Latar",
          options: [
            { label: "Default (Putih/Gelap)", value: "default" },
            { label: "Muted (Abu-abu)", value: "muted" },
            { label: "Primary Subtle (Tema)", value: "primary-subtle" },
            { label: "Foreground Subtle", value: "dark" }
          ]
        },
        containerWidth: {
          type: "select",
          label: "Lebar Konten",
          options: [
            { label: "Fixed (Terpusat)", value: "fixed" },
            { label: "Full Width (Penuh)", value: "full" }
          ]
        },
        content: { type: "slot" }
      },
      defaultProps: {
        paddingTop: "medium",
        paddingBottom: "medium",
        bgType: "default",
        containerWidth: "fixed"
      },
      render: (props) => <SectionContainer {...(props as any)} />
    },

    GridColumns: {
      label: "Grid Kolom",
      fields: {
        layout: {
          type: "select",
          label: "Pembagian Kolom",
          options: [
            { label: "1 Kolom Penuh", value: "1/1" },
            { label: "2 Kolom (50% - 50%)", value: "1/2 + 1/2" },
            { label: "2 Kolom (33% - 67%)", value: "1/3 + 2/3" },
            { label: "2 Kolom (67% - 33%)", value: "2/3 + 1/3" },
            { label: "3 Kolom (Sama Lebar)", value: "1/3 + 1/3 + 1/3" },
            { label: "4 Kolom (Sama Lebar)", value: "1/4 + 1/4 + 1/4 + 1/4" }
          ]
        },
        gap: {
          type: "select",
          label: "Jarak Kolom",
          options: [
            { label: "Kecil", value: "small" },
            { label: "Sedang", value: "medium" },
            { label: "Besar", value: "large" }
          ]
        },
        alignItems: {
          type: "select",
          label: "Penyelarasan Vertikal",
          options: [
            { label: "Atas", value: "start" },
            { label: "Tengah", value: "center" },
            { label: "Penuh (Stretch)", value: "stretch" }
          ]
        },
        column1: { type: "slot" },
        column2: { type: "slot" },
        column3: { type: "slot" },
        column4: { type: "slot" }
      },
      defaultProps: {
        layout: "1/2 + 1/2",
        gap: "medium",
        alignItems: "stretch"
      },
      render: (props) => <GridColumns {...(props as any)} />
    },

    CardWrapper: {
      label: "Kartu Pembungkus",
      fields: {
        padding: {
          type: "select",
          label: "Padding Dalam",
          options: [
            { label: "Kecil", value: "small" },
            { label: "Sedang", value: "medium" },
            { label: "Besar", value: "large" }
          ]
        },
        borderStyle: {
          type: "select",
          label: "Gaya Garis Tepi",
          options: [
            { label: "Garis Solid", value: "solid" },
            { label: "Garis Putus-putus", value: "dashed" },
            { label: "Tanpa Garis", value: "none" }
          ]
        },
        shadow: {
          type: "select",
          label: "Efek Bayangan",
          options: [
            { label: "Tanpa Bayangan", value: "none" },
            { label: "Tipis", value: "sm" },
            { label: "Sedang", value: "md" },
            { label: "Tebal", value: "lg" }
          ]
        },
        bgType: {
          type: "select",
          label: "Warna Latar",
          options: [
            { label: "Background Kartu", value: "card" },
            { label: "Abu-abu Muted", value: "muted" },
            { label: "Warna Aksen", value: "accent-subtle" }
          ]
        },
        content: { type: "slot" }
      },
      defaultProps: {
        padding: "medium",
        borderStyle: "solid",
        shadow: "sm",
        bgType: "card"
      },
      render: (props) => <CardWrapper {...(props as any)} />
    },

    BaseHeading: {
      label: "Teks: Judul (Heading)",
      fields: {
        text: { type: "text", label: "Isi Judul" },
        level: {
          type: "select",
          label: "Level Tag (SEO)",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" }
          ]
        },
        alignment: {
          type: "radio",
          label: "Rataan",
          options: [
            { label: "Kiri", value: "left" },
            { label: "Tengah", value: "center" },
            { label: "Kanan", value: "right" }
          ]
        },
        size: {
          type: "select",
          label: "Ukuran Kustom",
          options: [
            { label: "Ikuti Tag SEO", value: "default" },
            { label: "Kecil", value: "sm" },
            { label: "Sedang", value: "lg" },
            { label: "Besar", value: "xl" },
            { label: "Ekstra Besar", value: "2xl" },
            { label: "Raksasa", value: "3xl" }
          ]
        },
        fontUppercase: { type: "radio", label: "Huruf Kapital Semua", options: [{ label: "Ya", value: true }, { label: "Tidak", value: false }] },
        fontItalic: { type: "radio", label: "Huruf Miring", options: [{ label: "Ya", value: true }, { label: "Tidak", value: false }] }
      },
      defaultProps: {
        text: "Masukkan Judul",
        level: "h2",
        alignment: "left",
        size: "default",
        fontUppercase: false,
        fontItalic: false
      },
      render: (props) => <BaseHeading {...(props as any)} />
    },

    BaseParagraph: {
      label: "Teks: Paragraf / Deskripsi",
      fields: {
        text: { type: "textarea", label: "Isi Deskripsi" },
        alignment: {
          type: "radio",
          label: "Rataan",
          options: [
            { label: "Kiri", value: "left" },
            { label: "Tengah", value: "center" },
            { label: "Kanan", value: "right" }
          ]
        },
        size: {
          type: "select",
          label: "Ukuran Teks",
          options: [
            { label: "Kecil", value: "sm" },
            { label: "Normal", value: "base" },
            { label: "Besar", value: "lg" }
          ]
        },
        opacity: {
          type: "select",
          label: "Ketebalan Warna Teks",
          options: [
            { label: "Paling Jelas (Utama)", value: "high" },
            { label: "Muted (Sedang)", value: "medium" },
            { label: "Faded (Tipis)", value: "low" }
          ]
        }
      },
      defaultProps: {
        text: "Ini adalah contoh deskripsi paragraf. Klik di sini untuk mengedit isinya secara visual.",
        alignment: "left",
        size: "base",
        opacity: "medium"
      },
      render: (props) => <BaseParagraph {...(props as any)} />
    },

    BaseButton: {
      label: "Tombol Aksi Dinamis",
      fields: {
        text: { type: "text", label: "Label Tombol" },
        variant: {
          type: "select",
          label: "Gaya Tombol",
          options: [
            { label: "Utama (Primary)", value: "default" },
            { label: "Sekunder (Secondary)", value: "secondary" },
            { label: "Garis Tepi (Outline)", value: "outline" },
            { label: "Hantu (Ghost)", value: "ghost" }
          ]
        },
        size: {
          type: "select",
          label: "Ukuran",
          options: [
            { label: "Kecil", value: "sm" },
            { label: "Normal", value: "default" },
            { label: "Besar", value: "lg" }
          ]
        },
        alignment: {
          type: "radio",
          label: "Rataan Tombol",
          options: [
            { label: "Kiri", value: "left" },
            { label: "Tengah", value: "center" },
            { label: "Kanan", value: "right" }
          ]
        },
        url: { type: "text", label: "Tautan URL" }
      },
      defaultProps: {
        text: "Tombol Aksi",
        variant: "default",
        size: "default",
        alignment: "left",
        url: "#"
      },
      render: (props) => <BaseButton {...(props as any)} />
    },

    BaseImage: {
      label: "Gambar Responsif",
      fields: {
        src: { type: "text", label: "URL Gambar (Unsplash/Tautan)" },
        alt: { type: "text", label: "Deskripsi Alternatif (SEO Alt)" },
        aspectRatio: {
          type: "select",
          label: "Rasio Dimensi",
          options: [
            { label: "Asli (Auto)", value: "auto" },
            { label: "Kotak (1:1)", value: "square" },
            { label: "Video (16:9)", value: "video" },
            { label: "Lebar (21:9)", value: "wide" }
          ]
        },
        radius: {
          type: "select",
          label: "Kelengkungan Sudut",
          options: [
            { label: "Tanpa Kelengkungan", value: "none" },
            { label: "Sedang", value: "md" },
            { label: "Besar (rounded-xl)", value: "lg" },
            { label: "Bulat Sempurna (Full)", value: "full" }
          ]
        }
      },
      defaultProps: {
        src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
        alt: "Gambar",
        aspectRatio: "video",
        radius: "lg"
      },
      render: (props) => <BaseImage {...(props as any)} />
    },

    Hero: {
      label: "Hero Header",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        ctaText: { type: "text" }
      },
      defaultProps: {
        title: "Build better software faster",
        subtitle: "The ultimate tool for ambitious teams to scale their products.",
        ctaText: "Get Started"
      },
      render: (props) => <Hero variant="hero" {...(props as any)} />
    },

    // --- FITUR & MASALAH ---
    Features: {
      label: "Fitur Utama",
      fields: featuresFields,
      defaultProps: { title: "Platform Features", subtitle: "Everything you need to succeed.", features: [] },
      render: (props) => <Features variant="features" {...(props as any)} />
    },
    Services: {
      label: "Layanan Kami",
      fields: featuresFields,
      defaultProps: { title: "Our Services", subtitle: "What we offer to help you grow.", features: [] },
      render: (props) => <Features variant="services" {...(props as any)} />
    },
    Problems: {
      label: "Masalah Target",
      fields: featuresFields,
      defaultProps: { title: "The Problem", subtitle: "Why traditional systems fail.", features: [] },
      render: (props) => <Features variant="problems" {...(props as any)} />
    },
    Solution: {
      label: "Solusi Cerdas",
      fields: featuresFields,
      defaultProps: { title: "Our Solution", subtitle: "How we solve these challenges.", features: [] },
      render: (props) => <Features variant="solution" {...(props as any)} />
    },
    Logic: {
      label: "Logika & Analisis",
      fields: featuresFields,
      defaultProps: { title: "Why it works", subtitle: "Logical breakdown of the system.", features: [] },
      render: (props) => <Features variant="logic" {...(props as any)} />
    },
    Scarcity: {
      label: "Urgency / Kelangkaan",
      fields: featuresFields,
      defaultProps: { title: "Limited Offer", subtitle: "Don't miss this opportunity.", features: [] },
      render: (props) => <Features variant="scarcity" {...(props as any)} />
    },
    Authority: {
      label: "Kredibilitas / Authority",
      fields: featuresFields,
      defaultProps: { title: "Proven Track Record", subtitle: "Why industry leaders trust us.", features: [] },
      render: (props) => <Features variant="authority" {...(props as any)} />
    },
    Psych: {
      label: "Psikologi Buyer",
      fields: featuresFields,
      defaultProps: { title: "The Buyer Mindset", subtitle: "Understanding the decision factors.", features: [] },
      render: (props) => <Features variant="psych" {...(props as any)} />
    },
    Objections: {
      label: "Menjawab Objeksi",
      fields: featuresFields,
      defaultProps: { title: "Answering Objections", subtitle: "Addressing common questions.", features: [] },
      render: (props) => <Features variant="objections" {...(props as any)} />
    },
    Curiosity: {
      label: "Rasa Penasaran",
      fields: featuresFields,
      defaultProps: { title: "Curiosity Factor", subtitle: "Inside look at our framework.", features: [] },
      render: (props) => <Features variant="curiosity" {...(props as any)} />
    },

    // --- KONTEN & INFORMASI ---
    Content: {
      label: "Konten Teks & Gambar",
      fields: featuresFields,
      defaultProps: { title: "Inside our ecosystem", subtitle: "Deep dive details.", features: [] },
      render: (props) => <Features variant="content" {...(props as any)} />
    },
    Process: {
      label: "Alur Proses Kerja",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        steps: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" }
          }
        }
      },
      defaultProps: { title: "How it works", subtitle: "Simple 3-step process", steps: [] },
      render: (props) => <Process variant="process" {...(props as any)} />
    },
    Comparison: {
      label: "Tabel Perbandingan",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        columns: {
          type: "array",
          arrayFields: {
            title: { type: "text" }
          }
        }
      },
      defaultProps: { title: "Compare Plans", subtitle: "", columns: [] },
      render: (props) => <Comparison variant="comparison" {...(props as any)} />
    },
    Gallery: {
      label: "Galeri Gambar",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        images: {
          type: "array",
          arrayFields: {
            src: { 
              type: "custom", 
              label: "Gambar",
              render: ({ value, onChange }) => (
                <div className="py-1">
                  <ImagePicker value={value} onChange={onChange} label="Pilih Gambar Gallery" />
                </div>
              )
            },
            alt: { type: "text" }
          }
        }
      },
      defaultProps: { title: "Gallery", subtitle: "See it in action", images: [] },
      render: (props) => <GallerySection variant="gallery" {...(props as any)} />
    },
    Stats: {
      label: "Statistik & Angka",
      fields: {
        title: { type: "text" },
        stats: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            label: { type: "text" }
          }
        }
      },
      defaultProps: { title: "By the numbers", stats: [] },
      render: (props) => <Stats variant="stats" {...(props as any)} />
    },
    FAQ: {
      label: "Pertanyaan FAQ",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        faqs: {
          type: "array",
          arrayFields: {
            question: { type: "text" },
            answer: { type: "textarea" }
          }
        }
      },
      defaultProps: { title: "Frequently Asked Questions", subtitle: "", faqs: [] },
      render: (props) => <FAQ variant="faq" {...(props as any)} />
    },
    Team: {
      label: "Tim & Anggota",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        members: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            role: { type: "text" }
          }
        }
      },
      defaultProps: { title: "Our Team", subtitle: "Meet the experts", members: [] },
      render: (props) => <Team variant="team" {...(props as any)} />
    },

    // --- KREDIBILITAS & TESTIMONI ---
    TrustBar: {
      label: "Logo Client (Trust Bar)",
      fields: trustBarFields,
      defaultProps: { title: "Trusted by innovative companies", companies: [] },
      render: (props) => <TrustBar variant="trust-bar" {...(props as any)} />
    },
    Press: {
      label: "Liputan Media (Press)",
      fields: trustBarFields,
      defaultProps: { title: "As featured in", companies: [] },
      render: (props) => <TrustBar variant="press" {...(props as any)} />
    },
    Trust: {
      label: "Indikator Kepercayaan",
      fields: trustBarFields,
      defaultProps: { title: "Why companies trust us", companies: [] },
      render: (props) => <TrustBar variant="trust" {...(props as any)} />
    },
    Proof: {
      label: "Bukti Sosial (Proof)",
      fields: trustBarFields,
      defaultProps: { title: "Real social proof indicators", companies: [] },
      render: (props) => <TrustBar variant="proof" {...(props as any)} />
    },
    Ratings: {
      label: "Rating Bintang (Ratings)",
      fields: trustBarFields,
      defaultProps: { title: "5-star rating averages", companies: [] },
      render: (props) => <TrustBar variant="ratings" {...(props as any)} />
    },
    Social: {
      label: "Social Feed (Social)",
      fields: trustBarFields,
      defaultProps: { title: "Shared by our community", companies: [] },
      render: (props) => <TrustBar variant="social" {...(props as any)} />
    },
    Testimonials: {
      label: "Testimoni Pelanggan",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        testimonials: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            role: { type: "text" },
            content: { type: "textarea" }
          }
        }
      },
      defaultProps: { title: "What our customers say", subtitle: "", testimonials: [] },
      render: (props) => <Testimonials variant="testimonials" {...(props as any)} />
    },

    // --- PENAWARAN & KONVERSI ---
    Pricing: {
      label: "Paket Harga (Pricing)",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        tiers: {
           type: "array",
           arrayFields: {
             name: { type: "text" },
             price: { type: "text" },
             features: { type: "array", arrayFields: { name: { type: "text" } } }
           }
        }
      },
      defaultProps: {
        title: "Simple Pricing",
        subtitle: "Choose the plan that's right for you.",
        tiers: []
      },
      render: (props) => <Pricing variant="pricing" {...(props as any)} />
    },
    CTA: {
      label: "Ajakan Bertindak (CTA)",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        ctaText: { type: "text" }
      },
      defaultProps: { title: "Ready to get started?", subtitle: "Join thousands of satisfied users.", ctaText: "Start for free" },
      render: (props) => <CTA variant="cta" {...(props as any)} />
    },
    Newsletter: {
      label: "Subskripsi Buletin",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        ctaText: { type: "text" }
      },
      defaultProps: { title: "Subscribe to our Newsletter", subtitle: "Stay updated with latest news.", ctaText: "Subscribe" },
      render: (props) => <CTA variant="newsletter" {...(props as any)} />
    },
    Countdown: {
      label: "Penghitung Mundur",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        ctaText: { type: "text" }
      },
      defaultProps: { title: "Limited Time Left!", subtitle: "Special offer ends soon.", ctaText: "Claim Now" },
      render: (props) => <CTA variant="countdown" {...(props as any)} />
    },
    Conversion: {
      label: "Blok Konversi Tinggi",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        ctaText: { type: "text" }
      },
      defaultProps: { title: "Boost your conversion", subtitle: "High impact visual block.", ctaText: "Get Started Now" },
      render: (props) => <CTA variant="conversion" {...(props as any)} />
    },

    // --- HUBUNGI KAMI ---
    Contact: {
      label: "Formulir Kontak",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        email: { type: "text" }
      },
      defaultProps: { title: "Get in touch", subtitle: "We'd love to hear from you.", email: "hello@example.com" },
      render: (props) => <Contact variant="contact" {...(props as any)} />
    },
    SocialLinks: {
      label: "Tautan Sosial Media",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        email: { type: "text" }
      },
      defaultProps: { title: "Follow us", subtitle: "Connect on our social media platforms.", email: "social@example.com" },
      render: (props) => <Contact variant="social-links" {...(props as any)} />
    },
    Legal: {
      label: "Klausul Hukum / Footer",
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        email: { type: "text" }
      },
      defaultProps: { title: "Terms & Conditions", subtitle: "All rights reserved.", email: "legal@example.com" },
      render: (props) => <Contact variant="legal" {...(props as any)} />
    }
  }
};
