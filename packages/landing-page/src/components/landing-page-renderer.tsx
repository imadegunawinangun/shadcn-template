"use client"

import React from "react";
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

export interface Section {
  id: string;
  type: string;
  title: string;
  enabled: boolean;
  content?: any;
}

export interface LandingPageRendererProps {
  sections: Section[];
  onUpdateSection?: (id: string, data: Partial<Section>) => void;
  theme?: any; 
}

export function LandingPageRenderer({ sections, onUpdateSection, theme }: LandingPageRendererProps) {
  // Apply theme variables to the container
  const brandingStyle = React.useMemo(() => {
    if (!theme) return {};
    
    const style: any = {};
    
    // Primary color handling
    if (theme.color === "Custom" && theme.customColor) {
      style["--primary" as any] = theme.customColor;
      style["--ring" as any] = theme.customColor;
    }
    
    // Radius handling
    if (theme.radius) {
      style["--radius" as any] = theme.radius.includes("rem") ? theme.radius : `${theme.radius}rem`;
    }

    return style;
  }, [theme]);

  // Apply theme attributes to the container
  const themeAttributes = React.useMemo(() => {
    if (!theme) return {};
    return {
      "data-style": theme.style?.toLowerCase(),
      "data-base-color": theme.baseColor?.toLowerCase(),
      "data-theme": theme.color === "Custom" ? "custom" : theme.color?.toLowerCase(),
      "data-font-heading": theme.fontHeading?.toLowerCase(),
      "data-font-body": theme.fontBody?.toLowerCase(),
      "data-radius": theme.radius,
    };
  }, [theme]);

  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20" style={brandingStyle} {...themeAttributes}>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Laman Kosong</h1>
          <p className="text-muted-foreground">Silakan tambahkan section melalui dashboard builder.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background" style={brandingStyle} {...themeAttributes}>
      <div className="flex flex-col">
        {sections.map((section) => {
          if (!section.enabled) return null;

          const componentProps = {
            variant: section.id,
            title: section.title,
            subtitle: section.content?.subtitle || (section as any).subtitle,
            ctaText: section.content?.ctaText || (section as any).ctaText,
            ...section.content
          };

          const key = section.id;

          switch (section.type) {
            case "hero":
              return <Hero key={key} {...componentProps} />;
            
            case "features":
            case "services":
            case "content":
            case "problems":
            case "solution":
            case "logic":
            case "scarcity":
            case "authority":
            case "psych":
            case "objections":
            case "curiosity":
              return <Features key={key} {...componentProps} />;

            case "process":
              return <Process key={key} {...componentProps} />;

            case "comparison":
              return <Comparison key={key} {...componentProps} />;

            case "pricing":
              return <Pricing key={key} {...componentProps} />;

            case "team":
              return <Team key={key} {...componentProps} />;

            case "gallery":
              return <GallerySection key={key} {...componentProps} />;

            case "trust-bar":
            case "press":
            case "trust":
            case "proof":
            case "ratings":
            case "social":
              return <TrustBar key={key} {...componentProps} />;

            case "testimonials":
              return <Testimonials key={key} {...componentProps} />;

            case "stats":
              return <Stats key={key} {...componentProps} />;

            case "faq":
              return <FAQ key={key} {...componentProps} />;

            case "cta":
            case "newsletter":
            case "countdown":
            case "conversion":
              return <CTA key={key} {...componentProps} />;

            case "contact":
            case "social-links":
            case "legal":
              return <Contact key={key} {...componentProps} />;

            default:
              return <Features key={key} {...componentProps} />;
          }
        })}
      </div>
    </div>
  );
}
