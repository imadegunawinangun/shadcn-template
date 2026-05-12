"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, RefreshCw } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { TypographyH2, TypographyP, TypographyInlineCode } from "@workspace/ui/components/typography"
import { toast } from "sonner"

const PRESETS = [
  { id: "nova", name: "Nova", description: "Modern, clean, and high-contrast.", code: "nova" },
  { id: "vega", name: "Vega", description: "Soft, organic, and approachable.", code: "vega" },
  { id: "maia", name: "Maia", description: "Geometric, sharp, and technical.", code: "maia" },
  { id: "lyra", name: "Lyra", description: "Elegant, sophisticated, and refined.", code: "lyra" },
  { id: "mira", name: "Mira", description: "Playful, vibrant, and energetic.", code: "mira" },
  { id: "luma", name: "Luma", description: "Minimal, airy, and light-focused.", code: "luma" },
]

export function PresetManager() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    toast.success("Command copied to clipboard!")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <TypographyH2>Preset Manager</TypographyH2>
        <TypographyP className="text-muted-foreground">
          Shadcn presets allow you to quickly change the entire look and feel of your UI. 
          Choose a preset below and run the command in your terminal to apply it.
        </TypographyP>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PRESETS.map((preset) => (
          <Card key={preset.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{preset.name}</CardTitle>
              <CardDescription>{preset.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="rounded-md bg-muted p-3">
                <TypographyInlineCode className="text-xs break-all">
                  pnpm dlx shadcn@latest apply {preset.code}
                </TypographyInlineCode>
              </div>
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => copyToClipboard(`pnpm dlx shadcn@latest apply ${preset.code}`)}
              >
                {copiedCode === `pnpm dlx shadcn@latest apply ${preset.code}` ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Copy Command
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Custom Presets
          </CardTitle>
          <CardDescription>
            You can create your own custom presets using the shadcn visual editor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TypographyP>
            Go to the official shadcn editor to customize colors, radius, and fonts. 
            Once you're happy with the result, copy the generated preset code and apply it here.
          </TypographyP>
          <Button asChild>
            <a href="https://ui.shadcn.com/create" target="_blank" rel="noreferrer">
              Open Shadcn Editor
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
