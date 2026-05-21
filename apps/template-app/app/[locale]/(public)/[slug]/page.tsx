import React from "react";
import { getPageBySlug } from "../../dashboard/website/actions";
import { PuckRenderClient } from "@workspace/landing-page";
import { Data } from "@puckeditor/core";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "dashboard" || slug === "api") return {};
  
  const page = await getPageBySlug(slug);
  if (!page) return {};

  const puckData: Data = (page.content && typeof page.content === 'object' && 'content' in page.content)
    ? page.content as Data
    : { content: [], root: { props: {} }, zones: {} } as any;

  const seo = (puckData?.root?.props as any) || {};

  return {
    title: seo.title || page.title,
    description: seo.metaDescription || null,
    keywords: seo.metaKeywords || null,
    alternates: {
      canonical: seo.canonicalUrl || null,
    },
    robots: {
      index: seo.robotsIndex === "index",
      follow: seo.robotsFollow === "follow",
    },
    openGraph: {
      title: seo.ogTitle || seo.title || page.title,
      description: seo.ogDescription || seo.metaDescription || undefined,
      images: seo.ogImage ? [{ url: seo.ogImage }] : (seo.featuredImage ? [{ url: seo.featuredImage }] : []),
      type: "website",
    }
  };
}

export default async function PublicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (slug === "dashboard" || slug === "api") return notFound();

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  if (page.status !== "published" && page.status !== "draft") {
    notFound();
  }

  const puckData: Data = (page.content && typeof page.content === 'object' && 'content' in page.content)
    ? page.content as Data
    : { content: [], root: { props: { title: page.title } }, zones: {} };

  const resolvedTheme = (page as any).resolvedTheme;
  const brandingStyle: React.CSSProperties & Record<string, string> = {};
  if (resolvedTheme?.color === "Custom" && resolvedTheme.customColor) {
    brandingStyle["--primary" as any] = resolvedTheme.customColor;
    brandingStyle["--ring" as any] = resolvedTheme.customColor;
  }
  if (resolvedTheme?.radius) {
    brandingStyle["--radius" as any] = resolvedTheme.radius.includes("rem") ? resolvedTheme.radius : `${resolvedTheme.radius}rem`;
  }

  const themeAttributes = {
    "data-style": resolvedTheme?.style?.toLowerCase(),
    "data-base-color": resolvedTheme?.baseColor?.toLowerCase(),
    "data-theme": resolvedTheme?.color === "Custom" ? "custom" : resolvedTheme?.color?.toLowerCase(),
    "data-font-heading": resolvedTheme?.fontHeading?.toLowerCase(),
    "data-font-body": resolvedTheme?.fontBody?.toLowerCase(),
    "data-radius": resolvedTheme?.radius,
  };

  return (
    <div style={brandingStyle} {...themeAttributes} className={`min-h-screen font-sans ${resolvedTheme?.mode === "dark" ? "dark bg-background text-foreground" : "bg-background text-foreground"}`}>
      <PuckRenderClient data={puckData} />
    </div>
  );
}
