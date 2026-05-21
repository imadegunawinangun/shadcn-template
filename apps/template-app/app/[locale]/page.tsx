import React from "react";
import { getHomePage } from "./dashboard/website/actions";
import { PuckRenderClient } from "@workspace/landing-page";
import { Button } from "@workspace/ui/components/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  if (!page) return {};

  const puckData: any = (page.content && typeof page.content === 'object' && 'content' in page.content)
    ? page.content as any
    : { content: [], root: { props: {} }, zones: {} };

  const seo = puckData?.root?.props || {};

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

export default async function Home() {
  const page = await getHomePage();

  if (!page) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between mx-auto px-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-xl">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-black tracking-tight">Template App</span>
            </div>
            <Link href="/dashboard">
              <Button size="sm">Go to Dashboard</Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <h1 className="text-5xl font-black tracking-tighter">Welcome to your Website Builder</h1>
            <p className="text-muted-foreground text-lg">
              You haven't set a home page yet. Go to your dashboard to create one and set it as your home page.
            </p>
            <Link href="/dashboard/website">
              <Button size="lg" className="rounded-full px-8">Setup Home Page</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const puckData: any = (page.content && typeof page.content === 'object' && 'content' in page.content)
    ? page.content as any
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
