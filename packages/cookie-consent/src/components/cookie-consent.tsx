"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Cookie, X, ShieldCheck, PieChart, Megaphone, Info } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { cn } from "@workspace/ui/lib/utils";

const COOKIE_CONSENT_KEY = "workspace_cookie_consent";

export type ConsentSettings = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

export interface CookieConsentProps {
  title?: string;
  description?: string;
  cookieKey?: string;
  expires?: number;
  onAcceptAll?: (settings: ConsentSettings) => void;
  onRejectAll?: (settings: ConsentSettings) => void;
  onSaveSettings?: (settings: ConsentSettings) => void;
}

export function CookieConsent({
  title = "Kami menggunakan cookies",
  description = "Kami menggunakan cookies untuk meningkatkan pengalaman Anda, menganalisis lalu lintas situs, dan membantu upaya pemasaran kami. Anda dapat memilih untuk menerima semua cookies atau mengelola preferensi Anda.",
  cookieKey = "workspace_cookie_consent",
  expires = 365,
  onAcceptAll,
  onRejectAll,
  onSaveSettings,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = Cookies.get(cookieKey);
    if (!consent) {
      setIsVisible(true);
    } else {
      try {
        setSettings(JSON.parse(consent));
      } catch (e) {
        setIsVisible(true);
      }
    }
  }, [cookieKey]);

  const handleAcceptAll = () => {
    const allAccepted: ConsentSettings = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allAccepted);
    onAcceptAll?.(allAccepted);
  };

  const handleRejectAll = () => {
    const essentialOnly: ConsentSettings = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(essentialOnly);
    onRejectAll?.(essentialOnly);
  };

  const handleSaveSettings = () => {
    saveConsent(settings);
    onSaveSettings?.(settings);
  };

  const saveConsent = (data: ConsentSettings) => {
    Cookies.set(cookieKey, JSON.stringify(data), { expires });
    setSettings(data);
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-full max-w-4xl px-4 md:bottom-8">
      <Card className="overflow-hidden border-2 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-10">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row">
            <CardHeader className="flex-1 space-y-1 p-6">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Cookie className="h-6 w-6" />
                <CardTitle className="text-xl">{title}</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap items-center gap-2 p-6 pt-0 md:pt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)} className="text-xs">
                Pengaturan
              </Button>
              <Button variant="outline" size="sm" onClick={handleRejectAll}>
                Tolak Semua
              </Button>
              <Button size="sm" onClick={handleAcceptAll} className="bg-primary text-primary-foreground shadow-lg hover:opacity-90">
                Terima Semua
              </Button>
            </CardFooter>
          </div>
        ) : (
          <div className="flex flex-col">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-primary" />
                  <CardTitle>Pengaturan Cookies</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Sesuaikan preferensi cookies Anda di bawah ini. Cookies esensial selalu diaktifkan untuk fungsi dasar situs.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="essential" className="border-b-0">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Esensial</Label>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Selalu Aktif</p>
                      </div>
                    </div>
                    <Switch checked={true} disabled />
                  </div>
                  <AccordionTrigger className="py-0 pb-2 text-[10px] text-muted-foreground hover:no-underline">
                    Pelajari lebih lanjut
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground">
                    Cookies ini diperlukan agar situs web berfungsi dan tidak dapat dimatikan di sistem kami.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="analytics" className="border-b-0">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                        <PieChart className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Analitik</Label>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Opsional</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.analytics} 
                      onCheckedChange={(checked) => setSettings({...settings, analytics: checked})} 
                    />
                  </div>
                  <AccordionTrigger className="py-0 pb-2 text-[10px] text-muted-foreground hover:no-underline">
                    Pelajari lebih lanjut
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground">
                    Membantu kami memahami bagaimana pengunjung berinteraksi dengan situs web dengan mengumpulkan dan melaporkan informasi secara anonim.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="marketing" className="border-b-0">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Pemasaran</Label>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Opsional</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.marketing} 
                      onCheckedChange={(checked) => setSettings({...settings, marketing: checked})} 
                    />
                  </div>
                  <AccordionTrigger className="py-0 pb-2 text-[10px] text-muted-foreground hover:no-underline">
                    Pelajari lebih lanjut
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground">
                    Digunakan untuk melacak pengunjung di seluruh situs web. Tujuannya adalah untuk menampilkan iklan yang relevan dan menarik bagi pengguna.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 bg-muted/30 p-4">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                Kembali
              </Button>
              <Button size="sm" onClick={handleSaveSettings}>
                Simpan Pilihan
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  );
}
