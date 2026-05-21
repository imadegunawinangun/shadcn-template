export type SectionType = 
  | "hero" 
  | "features" 
  | "pricing" 
  | "team" 
  | "gallery" 
  | "cta" 
  | "faq" 
  | "testimonials";

export interface Section {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  content?: string;
  items?: any[];
  config?: Record<string, any>;
  anchor?: string;
}

export interface LandingPageData {
  id: string;
  title: string;
  sections: Section[];
  metadata?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}
