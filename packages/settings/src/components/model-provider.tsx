"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@workspace/ui/components/command"
import { getSiteConfig, updateSiteConfig } from "@workspace/database"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"
import { Loader2, Cpu, Key, HelpCircle, Check, ChevronsUpDown, Bot, Sparkles } from "lucide-react"

export const modelProviderSchema = z.object({
  aiProvider: z.string().optional(),
  aiApiKey: z.string().optional(),
  aiBaseUrl: z.string().optional(),
  aiModelId: z.string().optional(),
})

export type ModelProviderValues = z.infer<typeof modelProviderSchema>

interface ModelProviderFormProps {
  workspaceId?: string
  className?: string
  showCardHeader?: boolean
  onSaveSuccess?: (data: ModelProviderValues) => void
}

// Predefined AI Providers list
const PROVIDERS = [
  { value: "openrouter", label: "OpenRouter (Recommended)" },
  { value: "openai", label: "OpenAI" },
  { value: "google", label: "Google Gemini" },
  { value: "anthropic", label: "Anthropic Claude" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "custom", label: "Custom / Local" },
]

// Fallback lists of recommended models per provider
const MODELS_BY_PROVIDER: Record<string, { value: string; label: string }[]> = {
  openrouter: [
    { value: "openrouter/auto", label: "openrouter/auto (Smartest & Cheapest)" },
    { value: "deepseek/deepseek-r1:free", label: "DeepSeek R1 Reasoning (Free)" },
    { value: "meta-llama/llama-3-8b-instruct:free", label: "Llama 3 8B Instruct (Free)" },
    { value: "google/gemma-2-9b-it:free", label: "Gemma 2 9B (Free)" },
    { value: "qwen/qwen-2.5-7b-instruct:free", label: "Qwen 2.5 7B (Free)" },
    { value: "mistralai/mistral-7b-instruct:free", label: "Mistral 7B Instruct (Free)" },
  ],
  openai: [
    { value: "gpt-4o", label: "gpt-4o (Flagship Multimodal Model)" },
    { value: "gpt-4o-mini", label: "gpt-4o-mini (High Speed & Efficient)" },
    { value: "o3-mini", label: "o3-mini (High-Speed Reasoning)" },
    { value: "o1", label: "o1 (Advanced Reasoning)" },
  ],
  google: [
    { value: "gemini-2.5-flash", label: "gemini-2.5-flash (Latest Fast Model)" },
    { value: "gemini-2.5-pro", label: "gemini-2.5-pro (Latest Intelligence Model)" },
    { value: "gemini-2.0-flash", label: "gemini-2.0-flash (Fast Reasoning)" },
    { value: "gemini-1.5-flash", label: "gemini-1.5-flash (Balanced)" },
  ],
  anthropic: [
    { value: "claude-3-7-sonnet-latest", label: "claude-3.7-sonnet (Latest Flagship)" },
    { value: "claude-3-5-sonnet-latest", label: "claude-3.5-sonnet (High Intelligence)" },
    { value: "claude-3-5-haiku-latest", label: "claude-3.5-haiku (Extremely Fast)" },
  ],
  deepseek: [
    { value: "deepseek-chat", label: "deepseek-chat (General Text & Chat)" },
    { value: "deepseek-reasoner", label: "deepseek-reasoner (R1 Reasoning Engine)" },
  ],
  custom: [
    { value: "custom-model", label: "Use Custom Model ID..." },
  ],
}

// Recommended API base URLs by provider
const BASE_URL_PLACEHOLDERS: Record<string, string> = {
  openrouter: "https://openrouter.ai/api/v1",
  openai: "https://api.openai.com/v1",
  google: "https://generativelanguage.googleapis.com",
  anthropic: "https://api.anthropic.com/v1",
  deepseek: "https://api.deepseek.com",
  custom: "http://localhost:11434/v1",
}

// Quick links to obtain API keys by provider
const PROVIDER_KEY_LINKS: Record<string, string> = {
  openrouter: "https://openrouter.ai/keys",
  openai: "https://platform.openai.com/api-keys",
  google: "https://aistudio.google.com/app/apikey",
  anthropic: "https://console.anthropic.com/settings/keys",
  deepseek: "https://platform.deepseek.com/api_keys",
}

export function ModelProviderForm({ workspaceId = "default-workspace", className, showCardHeader = true, onSaveSuccess }: ModelProviderFormProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [providerOpen, setProviderOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  
  // Real-time fetched models catalog
  const [liveModels, setLiveModels] = useState<{ id: string; name: string; info?: string; isFree?: boolean }[]>([])
  const [fetchingModels, setFetchingModels] = useState(false)

  const form = useForm<ModelProviderValues>({
    resolver: zodResolver(modelProviderSchema),
    defaultValues: {
      aiProvider: "",
      aiApiKey: "",
      aiBaseUrl: "",
      aiModelId: "",
    },
  })

  // Watch fields for dynamic dropdown rendering
  const watchedProvider = form.watch("aiProvider") || ""
  const watchedModel = form.watch("aiModelId") || ""
  const watchedApiKey = form.watch("aiApiKey") || ""

  useEffect(() => {
    async function loadConfig() {
      const config = await getSiteConfig(workspaceId)
      if (config) {
        form.reset({
          aiProvider: config.aiProvider || "",
          aiApiKey: config.aiApiKey || "",
          aiBaseUrl: config.aiBaseUrl || "",
          aiModelId: config.aiModelId || "",
        })
      }
      setLoading(false)
    }
    loadConfig()
  }, [form, workspaceId])

  // Dynamic real-time fetching of all available models by provider
  useEffect(() => {
    const controller = new AbortController()
    setLiveModels([])
    
    async function fetchCatalog() {
      if (!watchedProvider || watchedProvider === "custom") {
        return
      }

      setFetchingModels(true)
      try {
        if (watchedProvider === "openrouter") {
          const res = await fetch("https://openrouter.ai/api/v1/models", { signal: controller.signal })
          const data = await res.json()
          if (data && Array.isArray(data.data)) {
            const list = data.data.map((m: any) => {
              const isFree = Number(m.pricing?.prompt || 0) === 0 && Number(m.pricing?.completion || 0) === 0
              const priceStr = isFree ? "Free" : `$${(Number(m.pricing?.prompt || 0) * 1000000).toFixed(2)}/M tokens`
              return {
                id: m.id,
                name: m.name || m.id.split("/").pop() || m.id,
                info: priceStr,
                isFree: isFree
              }
            })
            setLiveModels(list)
          }
        } else if (watchedProvider === "openai" && watchedApiKey) {
          const res = await fetch("https://api.openai.com/v1/models", {
            headers: { "Authorization": `Bearer ${watchedApiKey}` },
            signal: controller.signal
          })
          const data = await res.json()
          if (data && Array.isArray(data.data)) {
            const list = data.data
              .filter((m: any) => m.id.startsWith("gpt") || m.id.startsWith("o1") || m.id.startsWith("o3"))
              .map((m: any) => ({
                id: m.id,
                name: m.id,
                info: "OpenAI Model"
              }))
            setLiveModels(list)
          }
        } else if (watchedProvider === "deepseek" && watchedApiKey) {
          const res = await fetch("https://api.deepseek.com/models", {
            headers: { "Authorization": `Bearer ${watchedApiKey}` },
            signal: controller.signal
          })
          const data = await res.json()
          if (data && Array.isArray(data.data)) {
            const list = data.data.map((m: any) => ({
              id: m.id,
              name: m.id,
              info: "DeepSeek Model"
            }))
            setLiveModels(list)
          }
        } else if (watchedProvider === "google" && watchedApiKey) {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${watchedApiKey}`, {
            signal: controller.signal
          })
          const data = await res.json()
          if (data && Array.isArray(data.models)) {
            const list = data.models.map((m: any) => {
              const cleanId = m.name.replace(/^models\//, "")
              return {
                id: cleanId,
                name: m.displayName || cleanId,
                info: "Google Gemini Model"
              }
            })
            setLiveModels(list)
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn(`Could not load live ${watchedProvider} model catalog:`, err.message)
        }
      } finally {
        setFetchingModels(false)
      }
    }

    fetchCatalog()
    return () => controller.abort()
  }, [watchedProvider, watchedApiKey])

  // Utility to check if a model value is in our predefined list for the current provider
  const isPredefinedModel = (provider: string, model: string) => {
    const list = MODELS_BY_PROVIDER[provider] || []
    return list.some(item => item.value === model)
  }

  async function onSubmit(data: ModelProviderValues) {
    setSaving(true)
    try {
      const result = await updateSiteConfig(workspaceId, {
        aiProvider: data.aiProvider,
        aiApiKey: data.aiApiKey,
        aiBaseUrl: data.aiBaseUrl,
        aiModelId: data.aiModelId,
      })

      if (result.success) {
        toast.success("AI Settings updated successfully")
        if (onSaveSuccess) {
          onSaveSuccess(data)
        }
      } else {
        toast.error(result.error || "Failed to update AI settings")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Card className={cn("border border-border/50 bg-card/30 backdrop-blur-md transition-all duration-200 hover:shadow-md", className)}>
      {showCardHeader && (
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Engine Integration</CardTitle>
            <CardDescription>
              Enable workspace-specific AI assistant, content generation, and LLM features.
            </CardDescription>
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4 pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Controller
              name="aiProvider"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>AI Provider</FieldLabel>
                  <Popover open={providerOpen} onOpenChange={setProviderOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={providerOpen}
                        className="w-full justify-between h-10 px-3 font-normal bg-background/50 hover:bg-background/80 text-left border border-input rounded-md"
                      >
                        <div className="flex items-center gap-2 overflow-hidden truncate">
                          <Bot className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate">
                            {field.value
                              ? PROVIDERS.find((opt) => opt.value === field.value)?.label
                              : "Select Provider..."}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search provider..." />
                        <CommandList>
                          <CommandEmpty>No provider found.</CommandEmpty>
                          <CommandGroup>
                            {PROVIDERS.map((opt) => (
                              <CommandItem
                                key={opt.value}
                                value={opt.value}
                                onSelect={(currentValue) => {
                                  field.onChange(currentValue)
                                  const models = MODELS_BY_PROVIDER[currentValue] || []
                                  if (models.length > 0 && models[0]) {
                                    form.setValue("aiModelId", models[0].value)
                                  } else {
                                    form.setValue("aiModelId", "")
                                  }
                                  setProviderOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === opt.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {opt.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="aiModelId"
              control={form.control}
              render={({ field, fieldState }) => {
                const showModelDropdown = watchedProvider && watchedProvider !== "custom"

                if (!showModelDropdown) {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Custom Model ID</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="e.g. llama3.1, deepseek-r1..."
                        className="bg-background/50"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }

                const hasPredefined = isPredefinedModel(watchedProvider, field.value || "")
                const freeOpenRouterModels = liveModels.filter(m => m.isFree)
                const paidOpenRouterModels = liveModels.filter(m => !m.isFree)

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="aiModelCombobox">Model Version</FieldLabel>
                      {fetchingModels ? (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 animate-pulse">
                          <Loader2 className="h-3 w-3 animate-spin text-primary" />
                          updating live catalog...
                        </span>
                      ) : (!watchedApiKey && watchedProvider !== "openrouter" && watchedProvider !== "custom") ? (
                        <span className="text-[9px] text-muted-foreground">
                          Showing recommended list (Add key for live catalog)
                        </span>
                      ) : null}
                    </div>
                    <Popover open={modelOpen} onOpenChange={setModelOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={modelOpen}
                          className="w-full justify-between h-10 px-3 font-normal bg-background/50 hover:bg-background/80 text-left border border-input rounded-md"
                        >
                          <div className="flex items-center gap-2 overflow-hidden truncate">
                            <Sparkles className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate">
                              {field.value || "Select Model ID..."}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput placeholder={`Search ${watchedProvider} models...`} />
                          <CommandList className="max-h-[300px]">
                            <CommandEmpty>No models found.</CommandEmpty>
                            
                            {watchedProvider === "openrouter" && liveModels.length > 0 ? (
                              <>
                                {freeOpenRouterModels.length > 0 && (
                                  <CommandGroup heading="Live Free Models (Real-time)">
                                    {freeOpenRouterModels.map((m) => (
                                      <CommandItem
                                        key={m.id}
                                        value={m.id}
                                        onSelect={(currentValue) => {
                                          field.onChange(currentValue)
                                          setModelOpen(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4 shrink-0",
                                            field.value === m.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span className="font-semibold text-xs text-foreground">{m.name}</span>
                                          <span className="text-[9px] text-muted-foreground">{m.id}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}

                                {paidOpenRouterModels.length > 0 && (
                                  <CommandGroup heading="Live Paid Models">
                                    {paidOpenRouterModels.map((m) => (
                                      <CommandItem
                                        key={m.id}
                                        value={m.id}
                                        onSelect={(currentValue) => {
                                          field.onChange(currentValue)
                                          setModelOpen(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4 shrink-0",
                                            field.value === m.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col overflow-hidden">
                                          <span className="font-medium text-xs truncate text-foreground/95">{m.name}</span>
                                          <span className="text-[9px] text-muted-foreground truncate">{m.id} • {m.info}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </>
                            ) : null}

                            {watchedProvider !== "openrouter" && liveModels.length > 0 ? (
                              <CommandGroup heading={`Live ${watchedProvider.toUpperCase()} Models`}>
                                {liveModels.map((m) => (
                                  <CommandItem
                                    key={m.id}
                                    value={m.id}
                                    onSelect={(currentValue) => {
                                      field.onChange(currentValue)
                                      setModelOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4 shrink-0",
                                        field.value === m.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="font-semibold text-xs text-foreground truncate">{m.name}</span>
                                      <span className="text-[9px] text-muted-foreground truncate">{m.id}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ) : null}

                            {liveModels.length === 0 && (
                              <CommandGroup heading="Recommended Models">
                                {(MODELS_BY_PROVIDER[watchedProvider] || []).map((opt) => (
                                  <CommandItem
                                    key={opt.value}
                                    value={opt.value}
                                    onSelect={(currentValue) => {
                                      field.onChange(currentValue)
                                      setModelOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4 shrink-0",
                                        field.value === opt.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-xs text-foreground">{opt.label}</span>
                                      <span className="text-[9px] text-muted-foreground">{opt.value}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}

                            <CommandGroup heading="Custom Option">
                              <CommandItem
                                value="custom-model-id-option"
                                onSelect={() => {
                                  field.onChange("")
                                  setModelOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    !hasPredefined && !liveModels.some(m => m.id === field.value) && field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium text-xs text-primary">Use Custom Model ID...</span>
                                </div>
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {(!hasPredefined && !liveModels.some(m => m.id === field.value) && field.value !== undefined) && (
                      <div className="mt-3">
                        <FieldLabel htmlFor="customModelInput">Enter Custom Model ID</FieldLabel>
                        <Input
                          id="customModelInput"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="e.g. gpt-4-32k, my-fine-tuned-model..."
                          className="bg-background/50 animate-in slide-in-from-top-2 duration-300"
                        />
                      </div>
                    )}

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )
              }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Controller
              name="aiApiKey"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex justify-between items-center">
                    <FieldLabel htmlFor={field.name}>API Key</FieldLabel>
                    {PROVIDER_KEY_LINKS[watchedProvider] && (
                      <a
                        href={PROVIDER_KEY_LINKS[watchedProvider]}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-primary hover:underline font-medium transition-all"
                      >
                        Get API Key ↗
                      </a>
                    )}
                  </div>
                  <Input {...field} id={field.name} type="password" placeholder="sk-proj-..." className="bg-background/50" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="aiBaseUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Custom Base URL</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder={BASE_URL_PLACEHOLDERS[watchedProvider] || "https://api.openai.com/v1"}
                    className="bg-background/50"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/75 shrink-0" />
                    Leave blank to use default endpoint for the selected provider.
                  </p>
                </Field>
              )}
            />
          </div>

          <Button type="submit" size="lg" disabled={saving} className="shadow-md rounded-xl transition-all duration-200">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Settings...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Save AI Settings
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
