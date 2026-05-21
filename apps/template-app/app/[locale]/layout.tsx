import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

import { AIAssistant } from "@workspace/ai-assistant";
import { CookieConsent } from "@workspace/cookie-consent";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Toaster } from "@workspace/ui/components/sonner";

export const metadata: Metadata = {
  title: "Landing Template | Premium SaaS Starter",
  description: "A modular landing page template built with Antigravity UI",
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import { ThemeProvider } from "../../components/theme-provider";

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable,
            outfit.variable
          )}
        >
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <TooltipProvider delayDuration={0}>
                {children}
                <AIAssistant />
                <CookieConsent />
                <Toaster position="top-right" richColors />
              </TooltipProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
