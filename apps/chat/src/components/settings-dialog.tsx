"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@workspace/ui/components/command";
import { cn } from "@workspace/ui/lib/utils";
import { getUserAiConfigAction, updateUserAiConfigAction, fetchAvailableModelsAction } from "../app/actions/user-ai-actions";
import { Loader2, Settings, Key, Cpu, Globe, HelpCircle, Sparkles, ChevronsUpDown, Check } from "lucide-react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDERS = [
  { value: "openai", label: "OpenAI" },
  { value: "openrouter", label: "OpenRouter" },
  { value: "google", label: "Google Gemini" },
  { value: "anthropic", label: "Anthropic Claude" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "custom", label: "Custom / Local" },
];

const BASE_URL_PLACEHOLDERS: Record<string, string> = {
  openai: "https://api.openai.com/v1",
  openrouter: "https://openrouter.ai/api/v1",
  google: "https://generativelanguage.googleapis.com/v1beta/openai/",
  anthropic: "https://api.anthropic.com/v1",
  deepseek: "https://api.deepseek.com",
  custom: "http://localhost:11434/v1",
};

const RECOMMENDED_MODELS: Record<string, string[]> = {
  openai: ["gpt-4o", "gpt-4o-mini", "o3-mini", "o1-mini"],
  openrouter: ["google/gemini-2.5-flash", "deepseek/deepseek-r1:free", "meta-llama/llama-3-8b-instruct:free", "google/gemma-2-9b-it:free"],
  google: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash"],
  anthropic: ["claude-3-7-sonnet-latest", "claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"],
  deepseek: ["deepseek-chat", "deepseek-reasoner"],
  custom: ["llama3.1", "deepseek-r1", "phi3"],
};

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [modelId, setModelId] = useState("");
  
  const [liveModels, setLiveModels] = useState<string[]>([]);
  const [fetchingModels, setFetchingModels] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [openProviderCombobox, setOpenProviderCombobox] = useState(false);

  // Load configuration from database on open
  useEffect(() => {
    if (!isOpen) return;

    async function loadConfig() {
      setLoading(true);
      setStatusMessage(null);
      try {
        const config = await getUserAiConfigAction();
        if (config) {
          setProvider(config.aiProvider || "openai");
          setApiKey(config.aiApiKey || "");
          setBaseUrl(config.aiBaseUrl || "");
          setModelId(config.aiModelId || "");
        } else {
          setStatusMessage({
            type: "info",
            text: "Anda belum login atau konfigurasi database kosong. Menggunakan konfigurasi default dari file .env."
          });
        }
      } catch (err) {
        console.error("Failed to load AI config:", err);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [isOpen]);

  // Fetch live models from API dynamically using Server Action to avoid CORS
  useEffect(() => {
    if (!isOpen || loading) return;

    // If the provider is not openrouter, and we don't have an API key or placeholder, don't fetch.
    if (provider !== "openrouter" && (!apiKey || apiKey.trim() === "")) {
      setLiveModels([]);
      return;
    }

    const controller = new AbortController();
    setFetchingModels(true);

    async function loadModels() {
      try {
        const result = await fetchAvailableModelsAction({
          provider,
          apiKey,
          baseUrl: baseUrl || undefined,
        });

        if (controller.signal.aborted) return;

        if (result.success && result.models) {
          setLiveModels(result.models);
        } else {
          console.warn("Failed to fetch live models:", result.error);
          setLiveModels([]);
        }
      } catch (err) {
        console.warn("Error calling fetchAvailableModelsAction:", err);
        setLiveModels([]);
      } finally {
        if (!controller.signal.aborted) {
          setFetchingModels(false);
        }
      }
    }

    // Debounce model fetching to avoid spamming calls on keystrokes
    const timer = setTimeout(() => {
      loadModels();
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [provider, apiKey, baseUrl, isOpen, loading]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const result = await updateUserAiConfigAction({
        aiProvider: provider,
        aiApiKey: apiKey,
        aiBaseUrl: baseUrl,
        aiModelId: modelId,
      });

      if (result.success) {
        setStatusMessage({ type: "success", text: "Pengaturan AI berhasil disimpan ke database!" });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMessage({ type: "error", text: result.error || "Gagal menyimpan konfigurasi." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Terjadi kesalahan sistem." });
    } finally {
      setSaving(false);
    }
  }

  // Model list: prioritizes live models, falls back to recommended ones
  const availableModels = liveModels.length > 0 ? liveModels : (RECOMMENDED_MODELS[provider] || []);
  const isCustomModel = modelId && !availableModels.includes(modelId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card border border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Settings className="w-5 h-5 text-primary" /> Pengaturan AI (BYOK)
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Konfigurasikan API key dan model AI Anda sendiri. Data disimpan terenkripsi di database.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Memuat konfigurasi...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 py-2">
            {statusMessage && (
              <div
                className={`p-3 rounded-lg text-xs font-medium border ${
                  statusMessage.type === "success"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : statusMessage.type === "error"
                    ? "bg-destructive/10 border-destructive/30 text-destructive"
                    : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            {/* Provider */}
            <div className="space-y-1.5 flex flex-col">
              <Label htmlFor="providerSelect" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Cpu className="w-3.5 h-3.5 text-muted-foreground" /> AI Provider
              </Label>
              <Popover open={openProviderCombobox} onOpenChange={setOpenProviderCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    id="providerSelect"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProviderCombobox}
                    className="w-full justify-between bg-background border-input text-foreground font-normal hover:bg-muted text-left h-10 px-3"
                  >
                    <span className="truncate">
                      {PROVIDERS.find((p) => p.value === provider)?.label || "Pilih provider..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-card border border-border" align="start">
                  <Command className="bg-card w-full">
                    <CommandInput placeholder="Cari provider..." className="text-foreground w-full" />
                    <CommandEmpty className="text-muted-foreground text-xs py-4 px-2 text-center">Provider tidak ditemukan.</CommandEmpty>
                    <CommandList className="max-h-60 overflow-y-auto w-full p-1">
                      <CommandGroup>
                        {PROVIDERS.map((p) => (
                          <CommandItem
                            key={p.value}
                            value={p.label}
                            onSelect={() => {
                              setProvider(p.value);
                              setLiveModels([]);
                              setModelId(""); // Reset model when provider changes
                              setOpenProviderCombobox(false);
                            }}
                            className="flex items-center justify-between text-foreground hover:bg-muted cursor-pointer px-2.5 py-2 rounded-sm"
                          >
                            <span className="truncate">{p.label}</span>
                            <Check
                              className={cn(
                                "h-4 w-4 text-primary",
                                provider === p.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* API Key */}
            <div className="space-y-1.5">
              <Label htmlFor="apiKey" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Key className="w-3.5 h-3.5 text-muted-foreground" /> API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={apiKey === "********" ? "********" : "Masukkan API Key Anda..."}
                className="h-10 bg-background border-input text-foreground focus-visible:ring-ring"
              />
            </div>

            {/* Base URL */}
            <div className="space-y-1.5">
              <Label htmlFor="baseUrl" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Custom Base URL (Opsional)
              </Label>
              <Input
                id="baseUrl"
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder={BASE_URL_PLACEHOLDERS[provider] || "https://api.openai.com/v1"}
                className="h-10 bg-background border-input text-foreground focus-visible:ring-ring"
              />
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
                Default: {BASE_URL_PLACEHOLDERS[provider] || "None"}
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-1.5 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="modelSelect" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground" /> Pilih Model
                </Label>
                {fetchingModels && (
                  <span className="text-[10px] text-primary flex items-center gap-1 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> memuat catalog API...
                  </span>
                )}
              </div>
              
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    id="modelSelect"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between bg-background border-input text-foreground font-normal hover:bg-muted text-left h-10 px-3"
                  >
                    <span className="truncate">
                      {isCustomModel 
                        ? `Custom: ${modelId}` 
                        : modelId 
                          ? modelId 
                          : "Pilih model..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-card border border-border" align="start">
                  <Command className="bg-card w-full">
                    <CommandInput placeholder="Cari model..." className="text-foreground w-full" />
                    <CommandEmpty className="text-muted-foreground text-xs py-4 px-2 text-center">Model tidak ditemukan.</CommandEmpty>
                    <CommandList className="max-h-60 overflow-y-auto w-full p-1">
                      <CommandGroup>
                        {availableModels.map((m) => (
                          <CommandItem
                            key={m}
                            value={m}
                            onSelect={() => {
                              setModelId(m);
                              setOpenCombobox(false);
                            }}
                            className="flex items-center justify-between text-foreground hover:bg-muted cursor-pointer px-2.5 py-2 rounded-sm"
                          >
                            <span className="truncate">{m}</span>
                            <Check
                              className={cn(
                                "h-4 w-4 text-primary",
                                modelId === m ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                        <CommandItem
                          value="custom-model-option"
                          onSelect={() => {
                            setModelId("");
                            setOpenCombobox(false);
                          }}
                          className="flex items-center justify-between text-foreground hover:bg-muted font-medium cursor-pointer px-2.5 py-2 rounded-sm"
                        >
                          <span>-- Custom Model ID (Ketik Sendiri) --</span>
                          <Check
                            className={cn(
                              "h-4 w-4 text-primary",
                              isCustomModel || modelId === "" ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {(isCustomModel || modelId === "" || !availableModels.includes(modelId)) && (
                <Input
                  id="modelId"
                  type="text"
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  placeholder="Ketik Model ID kustom (misal: deepseek-chat)..."
                  className="h-10 bg-background border-input text-foreground focus-visible:ring-ring mt-2"
                />
              )}
            </div>


            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="border-border hover:bg-muted text-foreground">
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/95">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan Pengaturan"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
