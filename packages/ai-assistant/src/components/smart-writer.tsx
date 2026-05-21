"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import { ModelProviderForm } from "@workspace/settings"
import { 
  SparklesIcon, CopyIcon, FileTextIcon, CheckCircle2Icon,
  Loader2Icon, EraserIcon, PenToolIcon, BookOpenIcon,
  Share2Icon, VideoIcon, ShoppingBagIcon, MailIcon,
  MegaphoneIcon, LightbulbIcon, Settings2, Key, Link as LinkIcon, Bot,
  EyeIcon, EyeOffIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"
import { Separator } from "@workspace/ui/components/separator"
import { Badge } from "@workspace/ui/components/badge"
import { Label } from "@workspace/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

type ContentType = "article" | "caption" | "short_video" | "long_video" | "product" | "email" | "ads" | "ideas"

export interface SmartWriterProps {
  workspaceId: string
  locale?: string
  initialConfig: {
    aiProvider?: string | null
    aiApiKey?: string | null
    aiBaseUrl?: string | null
    aiModelId?: string | null
  }
  onSaveConfig?: (config: any) => Promise<{ success: boolean; error?: string }>
}

export function SmartWriter({ workspaceId, initialConfig, onSaveConfig, locale = 'en' }: SmartWriterProps) {
  const isEn = locale === 'en'

  const [config, setConfig] = useState(initialConfig)
  const [isEditing, setIsEditing] = useState(!config.aiApiKey)

  const [contentType, setContentType] = useState<ContentType>("article")
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current && generatedContent) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [generatedContent])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(isEn ? "Please enter a prompt" : "Silakan masukkan perintah")
      return
    }

    if (!config.aiApiKey?.trim()) {
      toast.error(isEn ? "API Key is missing. Please save it in settings." : "API Key tidak ditemukan. Silakan simpan di pengaturan.")
      setIsEditing(true)
      return
    }

    setIsLoading(true)
    setGeneratedContent("")

    try {
      // Strip all whitespace and newlines from the API key to prevent header corruption
      const safeApiKey = config.aiApiKey?.replace(/\s+/g, "") || ""
      const safeBaseUrl = config.aiBaseUrl?.trim() || ""
      const safeModelId = config.aiModelId?.trim() || ""

      let endpoint = "https://openrouter.ai/api/v1/chat/completions"
      
      if (safeBaseUrl) {
        const cleanBaseUrl = safeBaseUrl.replace(/\/$/, "")
        endpoint = cleanBaseUrl.endsWith("/chat/completions") 
          ? cleanBaseUrl 
          : `${cleanBaseUrl}/chat/completions`
      } else if (config.aiProvider === "openai") {
        endpoint = "https://api.openai.com/v1/chat/completions"
      }

      const finalModel = safeModelId || (config.aiProvider === "openrouter" ? "openrouter/free" : "gpt-4o")

      const systemPrompts: Record<ContentType, string> = {
        article: `You are an expert article writer. BEST PRACTICE: The Title should be the H1 of the article. Focus on being informative and authoritative. Structure: Title (H1), Intro, H2/H3 Content, Conclusion.`,
        caption: `Social media manager. Hook, Body, CTA, Hashtags.`,
        short_video: `Short video expert. Hook (0-3s), Script Body, Outro.`,
        long_video: `Professional YouTuber. Title, Intro, Segments, Outro.`,
        product: `Conversion copywriter for Landing Pages. STRATEGY: Create a "Marketing H1" for the Hero section that is catchy and benefit-driven. It should be different from a purely descriptive Meta Title. Structure: Hero Headline (H1), Sub-headline, Features, Benefits, CTA.`,
        email: `Professional email marketer. Subject, Greeting, Body, CTA.`,
        ads: `Performance marketer. Headline, Primary Text (PAS/AIDA), CTA.`,
        ideas: `Creative strategist. Summary, 5-10 detailed ideas.`
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${safeApiKey}`,
          "Content-Type": "application/json",
          ...(config.aiProvider === "google" && { "x-goog-api-key": safeApiKey }),
          ...(config.aiProvider === "openrouter" && {
            "HTTP-Referer": window.location.origin,
            "X-Title": "AI Smart Writer"
          })
        },
        body: JSON.stringify({
          model: finalModel,
          messages: [
            { role: "system", content: `${systemPrompts[contentType]} Write in ${isEn ? 'English' : 'Indonesian'}.` },
            { role: "user", content: prompt }
          ],
          stream: false
        })
      })

      if (!response.ok) {
        let errorMsg = `API Error: ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.error?.message) {
            errorMsg = errorData.error.message
          }
        } catch (e) {
          // Ignore json parse error
        }
        throw new Error(`${errorMsg} (Debug: Key length=${safeApiKey.length}, Endpoint=${endpoint})`)
      }
      
      const data = await response.json()
      setGeneratedContent(data.choices[0].message.content)
      toast.success(isEn ? "Generated!" : "Berhasil!")
    } catch (error: any) {
      toast.error(error.message || "Failed to generate")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setIsCopied(true)
    toast.success(isEn ? "Copied" : "Disalin")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleClear = () => {
    setPrompt("")
    setGeneratedContent("")
  }

  const templates: Record<ContentType, { label: string, prompt: string }[]> = {
    article: [
      { label: isEn ? "Guide" : "Panduan", prompt: isEn ? "Write a guide about [Topic]." : "Tulis panduan tentang [Topik]." },
      { label: isEn ? "About" : "Tentang Kami", prompt: isEn ? "Write 'About Us' for [Topic]." : "Tulis 'Tentang Kami' untuk [Topik]." },
    ],
    caption: [
      { label: "Hook", prompt: isEn ? "Write catchy captions for [Topic]." : "Tulis caption menarik untuk [Topik]." },
    ],
    short_video: [
      { label: "TikTok", prompt: isEn ? "Write TikTok script for [Topic]." : "Tulis script TikTok untuk [Topik]." },
    ],
    long_video: [
      { label: "YouTube", prompt: isEn ? "Write YouTube script for [Topic]." : "Tulis script YouTube untuk [Topik]." },
    ],
    product: [
      { label: "Description", prompt: isEn ? "Write description for [Product]." : "Tulis deskripsi untuk [Produk]." },
    ],
    email: [
      { label: "Newsletter", prompt: isEn ? "Write newsletter for [Topic]." : "Tulis newsletter untuk [Topik]." },
    ],
    ads: [
      { label: "Ad Copy", prompt: isEn ? "Write Ad copy for [Topic]." : "Tulis copy iklan untuk [Topik]." },
    ],
    ideas: [
      { label: "Ideas", prompt: isEn ? "Give content ideas for [Topic]." : "Berikan ide konten untuk [Topik]." },
    ]
  }

  const categories = [
    { id: "article", icon: <BookOpenIcon className="size-4" />, label: isEn ? "Article" : "Artikel" },
    { id: "caption", icon: <Share2Icon className="size-4" />, label: "Caption" },
    { id: "short_video", icon: <VideoIcon className="size-4" />, label: isEn ? "Short Video" : "Video Pendek" },
    { id: "long_video", icon: <VideoIcon className="size-4" />, label: isEn ? "Long Video" : "Video Panjang" },
    { id: "product", icon: <ShoppingBagIcon className="size-4" />, label: isEn ? "Product" : "Produk" },
    { id: "email", icon: <MailIcon className="size-4" />, label: "Email" },
    { id: "ads", icon: <MegaphoneIcon className="size-4" />, label: isEn ? "Ads" : "Iklan" },
    { id: "ideas", icon: <LightbulbIcon className="size-4" />, label: isEn ? "Ideas" : "Ide" },
  ]

  const providerOptions = [
    { value: "openrouter", label: "OpenRouter" },
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "google", label: "Google Gemini" },
    { value: "deepseek", label: "DeepSeek" },
    { value: "groq", label: "Groq" },
    { value: "custom", label: "Custom / Local" },
  ]

  const providerDefaults: Record<string, { url: string, model: string }> = {
    openrouter: { url: "https://openrouter.ai/api/v1", model: "openrouter/free" },
    openai: { url: "https://api.openai.com/v1", model: "gpt-4o" },
    anthropic: { url: "https://api.anthropic.com/v1", model: "claude-3-5-sonnet-20241022" },
    google: { url: "https://generativelanguage.googleapis.com/v1beta/openai/", model: "gemini-2.5-flash" },
    deepseek: { url: "https://api.deepseek.com", model: "deepseek-chat" },
    groq: { url: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile" },
    custom: { url: "", model: "" },
  }

  const providerLinks: Record<string, string> = {
    openrouter: "https://openrouter.ai/keys",
    openai: "https://platform.openai.com/api-keys",
    anthropic: "https://console.anthropic.com/settings/keys",
    google: "https://aistudio.google.com/app/apikey",
    deepseek: "https://platform.deepseek.com/api_keys",
    groq: "https://console.groq.com/keys",
  }

  const handleModelProviderSave = (data: any) => {
    setConfig({
      aiProvider: data.aiProvider || "",
      aiApiKey: data.aiApiKey || "",
      aiBaseUrl: data.aiBaseUrl || "",
      aiModelId: data.aiModelId || ""
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="space-y-4 max-w-3xl mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ModelProviderForm 
          workspaceId={workspaceId} 
          showCardHeader={true} 
          onSaveSuccess={handleModelProviderSave}
        />
        {config.aiApiKey && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl">
              {isEn ? "← Cancel & Back to Writer" : "← Batalkan & Kembali"}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
          <Settings2 className="h-4 w-4" />
          Settings
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start mt-4">
        {/* EDITOR COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <PenToolIcon className="size-5 text-primary" />
                {isEn ? "Editor" : "Editor"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={contentType === cat.id ? "default" : "outline"}
                    className="justify-start gap-3 h-11 text-xs font-bold"
                    onClick={() => setContentType(cat.id as ContentType)}
                  >
                    <div className={cn("size-6 flex items-center justify-center rounded", contentType === cat.id ? "bg-background/20" : "bg-muted")}>
                      {cat.icon}
                    </div>
                    {cat.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {isEn ? "Topic Description" : "Deskripsi Topik"}
                </Label>
                <Textarea 
                  placeholder={isEn ? "What should AI write about?" : "AI harus menulis tentang apa?"}
                  className="min-h-[150px] text-sm resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {templates[contentType] && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quick Start</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {templates[contentType].map((t, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/5 hover:border-primary/50 py-1 transition-colors"
                        onClick={() => setPrompt(t.prompt)}
                      >
                        + {t.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                className="w-full font-bold h-11" 
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? <Loader2Icon className="size-4 mr-2 animate-spin" /> : <SparklesIcon className="size-4 mr-2" />}
                {isEn ? "Generate Content" : "Mulai Menulis"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RESULT COLUMN */}
        <div className="lg:col-span-7">
          <Card className="shadow-md min-h-[600px] flex flex-col overflow-hidden">
            <CardHeader className="border-b bg-muted/20 py-4 px-6 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                  <FileTextIcon className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">{isEn ? "Result" : "Hasil"}</CardTitle>
                  {generatedContent && (
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      {generatedContent.trim().split(/\s+/).length} Words
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleClear} disabled={isLoading || (!prompt && !generatedContent)} className="h-8">
                  <EraserIcon className="size-4" />
                </Button>
                {generatedContent && (
                  <Button variant="outline" size="sm" className="h-8" onClick={handleCopy}>
                    {isCopied ? <CheckCircle2Icon className="size-4 mr-2" /> : <CopyIcon className="size-4 mr-2" />}
                    {isEn ? "Copy" : "Salin"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              <div 
                ref={scrollRef}
                className="absolute inset-0 overflow-y-auto p-6 md:p-10"
              >
                {generatedContent ? (
                  <div className="whitespace-pre-wrap leading-relaxed text-sm prose prose-sm max-w-none">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground opacity-50">
                    <PenToolIcon className="size-12" />
                    <p className="text-sm font-medium max-w-xs">
                      {isEn ? "Generated content will appear here." : "Konten yang dihasilkan akan muncul di sini."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
