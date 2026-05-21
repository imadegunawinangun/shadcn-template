import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";

// --- SECTION CONTAINER ---
export interface SectionContainerProps {
  paddingTop: "none" | "small" | "medium" | "large";
  paddingBottom: "none" | "small" | "medium" | "large";
  bgType: "default" | "muted" | "primary-subtle" | "dark";
  containerWidth: "fixed" | "full";
  content: React.ComponentType;
}

export function SectionContainer({
  paddingTop = "medium",
  paddingBottom = "medium",
  bgType = "default",
  containerWidth = "fixed",
  content: Content,
}: SectionContainerProps) {
  const ptClass = {
    none: "pt-0",
    small: "pt-8 sm:pt-12",
    medium: "pt-16 sm:pt-24",
    large: "pt-24 sm:pt-36",
  }[paddingTop];

  const pbClass = {
    none: "pb-0",
    small: "pb-8 sm:pb-12",
    medium: "pb-16 sm:pb-24",
    large: "pb-24 sm:pb-36",
  }[paddingBottom];

  const bgClass = {
    default: "bg-background text-foreground",
    muted: "bg-muted/30 text-foreground",
    "primary-subtle": "bg-primary/5 text-foreground",
    dark: "bg-foreground/5 text-foreground",
  }[bgType];

  return (
    <section className={cn("w-full transition-colors duration-200", ptClass, pbClass, bgClass)}>
      <div
        className={cn(
          containerWidth === "fixed" ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" : "w-full px-4"
        )}
      >
        {Content ? <Content /> : <div className="py-8 border border-dashed border-muted-foreground/20 rounded-xl text-center text-xs text-muted-foreground">Seret elemen ke sini</div>}
      </div>
    </section>
  );
}

// --- GRID COLUMNS ---
export interface GridColumnsProps {
  layout: "1/1" | "1/2 + 1/2" | "1/3 + 2/3" | "2/3 + 1/3" | "1/3 + 1/3 + 1/3" | "1/4 + 1/4 + 1/4 + 1/4";
  gap: "small" | "medium" | "large";
  alignItems: "start" | "center" | "stretch";
  column1?: React.ComponentType;
  column2?: React.ComponentType;
  column3?: React.ComponentType;
  column4?: React.ComponentType;
}

export function GridColumns({
  layout = "1/2 + 1/2",
  gap = "medium",
  alignItems = "stretch",
  column1: Column1,
  column2: Column2,
  column3: Column3,
  column4: Column4,
}: GridColumnsProps) {
  const gapClass = {
    small: "gap-4",
    medium: "gap-8",
    large: "gap-12",
  }[gap];

  const alignClass = {
    start: "items-start",
    center: "items-center",
    stretch: "items-stretch",
  }[alignItems];

  const renderCol = (Col: React.ComponentType | undefined, name: string) => {
    return (
      <div className="w-full min-h-[40px]">
        {Col ? (
          <Col />
        ) : (
          <div className="py-8 px-4 border border-dashed border-muted-foreground/15 rounded-xl text-center text-[10px] text-muted-foreground/60">
            Kolom {name} Kosong
          </div>
        )}
      </div>
    );
  };

  if (layout === "1/1") {
    return <div className="w-full">{renderCol(Column1, "1")}</div>;
  }

  if (layout === "1/2 + 1/2") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2", gapClass, alignClass)}>
        {renderCol(Column1, "1")}
        {renderCol(Column2, "2")}
      </div>
    );
  }

  if (layout === "1/3 + 2/3") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3", gapClass, alignClass)}>
        <div className="md:col-span-1">{renderCol(Column1, "1")}</div>
        <div className="md:col-span-2">{renderCol(Column2, "2")}</div>
      </div>
    );
  }

  if (layout === "2/3 + 1/3") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3", gapClass, alignClass)}>
        <div className="md:col-span-2">{renderCol(Column1, "1")}</div>
        <div className="md:col-span-1">{renderCol(Column2, "2")}</div>
      </div>
    );
  }

  if (layout === "1/3 + 1/3 + 1/3") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3", gapClass, alignClass)}>
        {renderCol(Column1, "1")}
        {renderCol(Column2, "2")}
        {renderCol(Column3, "3")}
      </div>
    );
  }

  if (layout === "1/4 + 1/4 + 1/4 + 1/4") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", gapClass, alignClass)}>
        {renderCol(Column1, "1")}
        {renderCol(Column2, "2")}
        {renderCol(Column3, "3")}
        {renderCol(Column4, "4")}
      </div>
    );
  }

  return null;
}

// --- CARD WRAPPER ---
export interface CardWrapperProps {
  padding: "small" | "medium" | "large";
  borderStyle: "solid" | "dashed" | "none";
  shadow: "none" | "sm" | "md" | "lg";
  bgType: "card" | "muted" | "accent-subtle";
  content: React.ComponentType;
}

export function CardWrapper({
  padding = "medium",
  borderStyle = "solid",
  shadow = "sm",
  bgType = "card",
  content: Content,
}: CardWrapperProps) {
  const pClass = {
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  }[padding];

  const borderClass = {
    solid: "border border-border",
    dashed: "border border-dashed border-border/60",
    none: "border-none",
  }[borderStyle];

  const shadowClass = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  }[shadow];

  const bgClass = {
    card: "bg-card text-card-foreground",
    muted: "bg-muted/50 text-foreground",
    "accent-subtle": "bg-primary/5 text-foreground",
  }[bgType];

  return (
    <div className={cn("rounded-xl transition-all duration-200 overflow-hidden", pClass, borderClass, shadowClass, bgClass)}>
      {Content ? (
        <Content />
      ) : (
        <div className="py-6 border border-dashed border-muted-foreground/15 text-center text-xs text-muted-foreground">
          Kolom Kartu Kosong
        </div>
      )}
    </div>
  );
}

// --- BASE HEADING ---
export interface BaseHeadingProps {
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  alignment: "left" | "center" | "right";
  size: "default" | "sm" | "lg" | "xl" | "2xl" | "3xl";
  fontUppercase: boolean;
  fontItalic: boolean;
}

export function BaseHeading({
  text = "Masukkan Judul",
  level = "h2",
  alignment = "left",
  size = "default",
  fontUppercase = false,
  fontItalic = false,
}: BaseHeadingProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];
  const defaultSizes: Record<string, string> = {
    h1: "text-4xl sm:text-5xl font-extrabold tracking-tight font-heading",
    h2: "text-3xl sm:text-4xl font-bold tracking-tight font-heading",
    h3: "text-2xl sm:text-3xl font-semibold tracking-tight font-heading",
    h4: "text-xl sm:text-2xl font-semibold font-heading",
    h5: "text-lg font-semibold",
    h6: "text-base font-semibold",
  };

  const sizeClass = {
    default: defaultSizes[level] || defaultSizes.h2,
    sm: "text-base sm:text-lg font-semibold",
    lg: "text-xl sm:text-2xl font-bold font-heading",
    xl: "text-2xl sm:text-3xl font-bold font-heading",
    "2xl": "text-3xl sm:text-4xl font-extrabold font-heading",
    "3xl": "text-4xl sm:text-5xl font-extrabold tracking-tight font-heading",
  }[size];

  const HeadingTag = level;

  return (
    <HeadingTag
      className={cn(
        "leading-tight font-sans text-foreground",
        alignClass,
        sizeClass,
        fontUppercase && "uppercase tracking-wider",
        fontItalic && "italic"
      )}
    >
      {text}
    </HeadingTag>
  );
}

// --- BASE PARAGRAPH ---
export interface BaseParagraphProps {
  text: string;
  alignment: "left" | "center" | "right";
  size: "sm" | "base" | "lg";
  opacity: "high" | "medium" | "low";
}

export function BaseParagraph({
  text = "Ini adalah contoh deskripsi paragraf. Klik di sini untuk mengedit isinya secara visual.",
  alignment = "left",
  size = "base",
  opacity = "medium",
}: BaseParagraphProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];

  const sizeClass = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  }[size];

  const opacityClass = {
    high: "text-foreground",
    medium: "text-muted-foreground",
    low: "text-muted-foreground/60",
  }[opacity];

  return (
    <p className={cn("leading-relaxed font-sans whitespace-pre-line", alignClass, sizeClass, opacityClass)}>
      {text}
    </p>
  );
}

// --- BASE BUTTON ---
export interface BaseButtonProps {
  text: string;
  variant: "default" | "secondary" | "outline" | "ghost";
  size: "sm" | "default" | "lg";
  alignment: "left" | "center" | "right";
  url: string;
}

export function BaseButton({
  text = "Tombol Aksi",
  variant = "default",
  size = "default",
  alignment = "left",
  url = "#",
}: BaseButtonProps) {
  const alignWrapper = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[alignment];

  return (
    <div className={cn("flex w-full mt-4", alignWrapper)}>
      <a href={url} className="inline-block">
        <Button variant={variant} size={size} className="rounded-lg font-bold">
          {text}
        </Button>
      </a>
    </div>
  );
}

// --- BASE IMAGE ---
export interface BaseImageProps {
  src: string;
  alt: string;
  aspectRatio: "auto" | "square" | "video" | "wide";
  radius: "none" | "md" | "lg" | "full";
}

export function BaseImage({
  src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
  alt = "Gambar",
  aspectRatio = "video",
  radius = "lg",
}: BaseImageProps) {
  const aspectClass = {
    auto: "aspect-auto",
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  }[aspectRatio];

  const radiusClass = {
    none: "rounded-none",
    md: "rounded-md",
    lg: "rounded-xl",
    full: "rounded-full",
  }[radius];

  return (
    <div className={cn("w-full relative overflow-hidden mt-4", aspectClass, radiusClass)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}
