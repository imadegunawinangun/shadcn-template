"use client";

import React, { useState, useMemo } from "react";
import { Puck, Data, useGetPuck } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import { config, BrandingContext } from "../puck.config";
import { toast } from "sonner";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export interface PuckEditorProps {
  initialData: Data;
  onSave: (data: Data) => Promise<void>;
  title?: string;
  backUrl?: string;
  
  // Theme customizer properties
  workspaceId: string;
  appId: string;
  fallbackConfigs?: {
    global?: any;
    workspace?: any;
    app?: any;
  };
  initialTheme?: any;
  resolvedTheme?: any;
  onSaveTheme: (themeConfig: any) => Promise<{ success: boolean; error?: string }>;
}

interface CustomPuckHeaderProps {
  backUrl: string;
  title?: string;
  onSave: (data: Data) => Promise<void>;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
}

function CustomPuckHeader({
  backUrl,
  title,
  onSave,
  isSaving,
  setIsSaving
}: CustomPuckHeaderProps) {
  const getPuck = useGetPuck();

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const { appState } = getPuck();
      await onSave(appState.data);
      toast.success("Halaman berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan halaman");
    } finally {
      setIsSaving(false);
    }
  };

  // Ctrl+S / Cmd+S Keyboard Shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSaving, onSave]);

  return (
    <div className="h-16 border-b bg-background flex items-center px-4 justify-between shrink-0 w-full select-none">
      <div className="flex items-center gap-4">
        <a href={backUrl}>
          <Button variant="ghost" size="icon" className="size-8 rounded-lg">
            <ChevronLeft className="size-4" />
          </Button>
        </a>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground leading-none mb-1">Visual Editor</span>
          <span className="font-semibold text-sm leading-none">{title || "Puck Visual Editor"}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-2 bg-muted/50 px-2.5 py-1 rounded-md border border-border">
           <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
           Sesi Edit Aktif
        </div>
        <div className="text-xs text-muted-foreground hidden md:block bg-muted/30 px-2.5 py-1 rounded-md border border-border font-mono">
           Tekan <kbd className="bg-background px-1 py-0.5 rounded border shadow-sm text-[10px]">Ctrl + S</kbd> untuk menyimpan
        </div>
        <Button 
          disabled={isSaving}
          onClick={handleSave}
          className="rounded-lg px-4 py-2 font-bold text-xs flex items-center gap-2 h-9"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}

export function PuckEditor({ 
  initialData, 
  onSave, 
  title, 
  backUrl = "/dashboard/website",
  workspaceId,
  appId,
  fallbackConfigs,
  initialTheme,
  resolvedTheme: initialResolvedTheme,
  onSaveTheme
}: PuckEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTheme, setActiveTheme] = useState(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState(initialResolvedTheme);

  // Still support Puck's onPublish callback if invoked elsewhere
  const handlePublish = async (data: Data) => {
    setIsSaving(true);
    try {
      await onSave(data);
      toast.success("Halaman berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan halaman");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate CSS variables style mapping
  const brandingStyle = useMemo(() => {
    if (!resolvedTheme) return {};
    const style: any = {};
    if (resolvedTheme.color === "Custom" && resolvedTheme.customColor) {
      style["--primary" as any] = resolvedTheme.customColor;
      style["--ring" as any] = resolvedTheme.customColor;
    }
    if (resolvedTheme.radius) {
      style["--radius" as any] = resolvedTheme.radius.includes("rem") ? resolvedTheme.radius : `${resolvedTheme.radius}rem`;
    }
    return style;
  }, [resolvedTheme]);

  // Generate data styling attributes
  const themeAttributes = useMemo(() => {
    if (!resolvedTheme) return {};
    return {
      "data-style": resolvedTheme.style?.toLowerCase(),
      "data-base-color": resolvedTheme.baseColor?.toLowerCase(),
      "data-theme": resolvedTheme.color === "Custom" ? "custom" : resolvedTheme.color?.toLowerCase(),
      "data-font-heading": resolvedTheme.fontHeading?.toLowerCase(),
      "data-font-body": resolvedTheme.fontBody?.toLowerCase(),
      "data-radius": resolvedTheme.radius,
    };
  }, [resolvedTheme]);

  return (
    <BrandingContext.Provider 
      value={{
        workspaceId,
        appId,
        fallbackConfigs,
        activeTheme,
        setActiveTheme,
        resolvedTheme,
        setResolvedTheme,
        onSaveTheme
      }}
    >
      <div 
        className="fixed inset-0 z-50 bg-background flex flex-col"
        style={brandingStyle}
        {...themeAttributes}
      >
        {/* Puck Fullscreen Canvas */}
        <div className="flex-1 w-full relative h-screen overflow-hidden">
          <Puck 
            config={config} 
            data={initialData} 
            onPublish={handlePublish}
            iframe={{ enabled: false }}
            overrides={{
              header: () => (
                <CustomPuckHeader 
                  backUrl={backUrl}
                  title={title}
                  onSave={onSave}
                  isSaving={isSaving}
                  setIsSaving={setIsSaving}
                />
              )
            }}
          />
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          /* Overriding Puck's internal styles to match our shadcn theme */
          :root {
            --puck-color-bg: var(--background);
            --puck-color-white: var(--background);
            --puck-color-black: var(--foreground);
            --puck-color-grey-12: var(--background);
            --puck-color-grey-11: var(--muted);
            --puck-color-grey-10: var(--muted);
            --puck-color-grey-09: var(--border);
            --puck-color-grey-08: var(--border);
            --puck-color-grey-07: var(--muted-foreground);
            --puck-color-grey-06: var(--muted-foreground);
            --puck-color-grey-05: var(--muted-foreground);
            --puck-color-grey-04: var(--muted-foreground);
            --puck-color-grey-03: var(--foreground);
            --puck-color-grey-02: var(--foreground);
            --puck-color-grey-01: var(--foreground);
          }
          
          /* Force Puck editor container to fit strictly within the parent viewport */
          .puck-editor {
            background-color: hsl(var(--muted) / 0.3);
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
          }

          /* Force Puck's left/right sidebars to strictly fit the container and enable scrolling */
          [class*="_Sidebar_"], [class*="_Sidebar--"], .puck-Sidebar {
            max-height: 100% !important;
            height: 100% !important;
            overflow-y: auto !important;
            padding-bottom: 120px !important; /* Adds a generous bottom spacer so the last fields are never cut off */
          }

          /* Ensure the scrollable field list inside the sidebar also has scrolling and padding */
          [class*="_Sidebar-"], [class*="_Fields-"] {
            padding-bottom: 100px !important;
          }

          /* Ensure theme variables propagate properly to components inside Puck's frame */
          .puck-render, .puck-canvas {
            font-family: inherit;
          }

          /* Style custom branding section inside Puck's right sidebar */
          .puck-field-type-custom {
            margin-top: 1rem;
            padding-top: 1rem;
          }
        ` }} />
      </div>
    </BrandingContext.Provider>
  );
}
