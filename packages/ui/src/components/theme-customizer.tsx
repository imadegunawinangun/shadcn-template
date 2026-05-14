"use client"

import * as React from "react"
import { Check, Settings2, RotateCcw, Unlock, Lock, Palette, Pipette, Type } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "sonner"
import { updateSiteConfig } from "@workspace/database"
import { Loader2 } from "lucide-react"

const STYLES = ["Vega", "Nova", "Maia", "Lyra", "Mira", "Luma", "Sera"]

const BASE_COLORS = [
  { name: "Neutral", color: "oklch(0.985 0 0)" },
  { name: "Stone", color: "oklch(0.985 0.001 60)" },
  { name: "Zinc", color: "oklch(0.985 0 0)" },
  { name: "Mauve", color: "oklch(0.985 0.002 285.8)" },
  { name: "Olive", color: "oklch(0.985 0.001 120)" },
  { name: "Mist", color: "oklch(0.985 0.001 210)" },
  { name: "Taupe", color: "oklch(0.985 0.001 30)" }
]

const ACCENT_COLORS = [
  { name: "Neutral", color: "oklch(0.205 0 0)" },
  { name: "Amber", color: "oklch(0.769 0.188 70.08)" },
  { name: "Blue", color: "oklch(0.488 0.243 264.376)" },
  { name: "Cyan", color: "oklch(0.6 0.118 184.704)" },
  { name: "Emerald", color: "oklch(0.696 0.17 162.48)" },
  { name: "Fuchsia", color: "oklch(0.627 0.265 303.9)" },
  { name: "Green", color: "oklch(0.527 0.154 150.069)" },
  { name: "Indigo", color: "oklch(0.488 0.243 255.6)" },
  { name: "Lime", color: "oklch(0.768 0.233 130.85)" },
  { name: "Orange", color: "oklch(0.612 0.17 40.231)" },
  { name: "Pink", color: "oklch(0.645 0.246 16.439)" },
  { name: "Purple", color: "oklch(0.488 0.243 285.6)" },
  { name: "Red", color: "oklch(0.577 0.245 27.325)" },
  { name: "Rose", color: "oklch(0.601 0.225 15.601)" },
  { name: "Sky", color: "oklch(0.627 0.194 233.415)" },
  { name: "Slate", color: "oklch(0.447 0.034 240.136)" },
  { name: "Teal", color: "oklch(0.484 0.147 192.616)" },
  { name: "Violet", color: "oklch(0.488 0.243 285.6)" },
  { name: "Yellow", color: "oklch(0.852 0.199 85.615)" }
]

const HEADING_FONTS = [
  "Inter", "Geist", "Roboto", "Outfit", "Space Grotesk", "IBM Plex Sans",
  "Playfair Display", "Montserrat", "Poppins", "Raleway", "Oswald", 
  "Sora", "Syne", "Urbanist", "Lexend"
]

const BODY_FONTS = [
  "Inter", "Geist", "Roboto", "DM Sans", "Outfit", "Montserrat", 
  "Poppins", "Lato", "Open Sans", "Manrope", "Nunito", "Ubuntu", 
  "Work Sans", "Quicksand", "PT Sans", "Cabin", "Noto Sans", 
  "Merriweather", "Source Sans"
]

const RADIUS_OPTIONS = [
  { name: "None", value: "0" },
  { name: "Small", value: "0.3" },
  { name: "Medium", value: "0.5" },
  { name: "Large", value: "0.75" },
  { name: "Full", value: "9999" },
]

export function ThemeCustomizer({ workspaceId = "default-workspace" }: { workspaceId?: string }) {
  const { theme: mode, setTheme: setMode } = useTheme()
  const [config, setConfig] = React.useState({
    style: "Nova",
    baseColor: "Zinc",
    color: "Blue",
    customColor: "#3b82f6",
    chartColor: "Blue",
    customChartColor: "#3b82f6",
    fontHeading: "Inter",
    fontBody: "Roboto",
    radius: "0.5",
    menu: "Default",
    menuAppearance: "Solid",
    menuAccent: "Subtle",
  })
  const [locked, setLocked] = React.useState<Record<string, boolean>>({})

  // Load from localStorage on mount
  React.useEffect(() => {
    const savedConfig = localStorage.getItem("theme-config")
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (e) {
        console.error("Failed to load theme config", e)
      }
    }
  }, [])

  // Apply config to document and save to localStorage
  React.useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute("data-style", config.style.toLowerCase())
    root.setAttribute("data-base-color", config.baseColor.toLowerCase())
    root.setAttribute("data-theme", config.color === "Custom" ? "custom" : config.color.toLowerCase())
    root.setAttribute("data-chart-color", config.chartColor === "Custom" ? "custom" : config.chartColor.toLowerCase())
    root.setAttribute("data-font-heading", config.fontHeading.toLowerCase())
    root.setAttribute("data-font-body", config.fontBody.toLowerCase())
    root.setAttribute("data-radius", config.radius)
    root.setAttribute("data-menu", config.menu.toLowerCase())
    root.setAttribute("data-menu-appearance", config.menuAppearance.toLowerCase())
    root.setAttribute("data-menu-accent", config.menuAccent.toLowerCase())
    
    root.style.setProperty("--radius", config.radius.includes("rem") ? config.radius : `${config.radius}rem`)
    
    if (config.color === "Custom") {
      root.style.setProperty("--primary", config.customColor)
    } else {
      root.style.removeProperty("--primary")
    }

    if (config.chartColor === "Custom") {
      root.style.setProperty("--chart-1", config.customChartColor)
    } else {
      root.style.removeProperty("--chart-1")
    }
    
    localStorage.setItem("theme-config", JSON.stringify(config))
  }, [config])

  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateSiteConfig(workspaceId, { theme: config })
      if (result.success) {
        toast.success("Theme saved to database for this workspace! 🚀")
      } else {
        toast.error("Failed to save theme: " + result.error)
      }
    } catch (error) {
      toast.error("An unexpected error occurred while saving.")
    } finally {
      setIsSaving(false)
    }
  }

  const updateConfig = (key: keyof typeof config, value: string) => {
    if (key === "style") {
      const defaults: Partial<typeof config> = { style: value }
      if (value === "Vega") {
        defaults.radius = "1"
        defaults.fontHeading = "Outfit"
        defaults.fontBody = "DM Sans"
      } else if (value === "Maia") {
        defaults.radius = "0"
        defaults.fontHeading = "Space Grotesk"
        defaults.fontBody = "IBM Plex Sans"
      } else if (value === "Nova") {
        defaults.radius = "0.5"
        defaults.fontHeading = "Geist"
        defaults.fontBody = "Inter"
      } else if (value === "Lyra") {
        defaults.radius = "0.375"
        defaults.fontHeading = "Inter"
        defaults.fontBody = "Inter"
      } else if (value === "Mira") {
        defaults.radius = "1.5"
        defaults.fontHeading = "Outfit"
        defaults.fontBody = "Outfit"
      } else if (value === "Luma") {
        defaults.radius = "0.125"
        defaults.fontHeading = "Geist"
        defaults.fontBody = "Geist"
      } else if (value === "Sera") {
        defaults.radius = "0"
        defaults.fontHeading = "IBM Plex Sans"
        defaults.fontBody = "Inter"
      }
      setConfig((prev) => ({ ...prev, ...defaults }))
    } else {
      setConfig((prev) => ({ ...prev, [key]: value }))
    }
  }

  const toggleLock = (section: string) => {
    setLocked(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const shuffle = () => {
    const newConfig = { ...config }
    
    if (!locked["Style"]) newConfig.style = STYLES[Math.floor(Math.random() * STYLES.length)]!
    if (!locked["Base Color"]) newConfig.baseColor = BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)]!.name
    if (!locked["Color"]) newConfig.color = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]!.name
    if (!locked["Chart Color"]) newConfig.chartColor = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]!.name
    if (!locked["Heading Font"]) newConfig.fontHeading = HEADING_FONTS[Math.floor(Math.random() * HEADING_FONTS.length)]!
    if (!locked["Body Font"]) newConfig.fontBody = BODY_FONTS[Math.floor(Math.random() * BODY_FONTS.length)]!
    if (!locked["Radius"]) newConfig.radius = RADIUS_OPTIONS[Math.floor(Math.random() * RADIUS_OPTIONS.length)]!.value
    if (!locked["Menu"]) newConfig.menu = (["Default", "Inverted"][Math.floor(Math.random() * 2)])!
    if (!locked["Menu Appearance"]) newConfig.menuAppearance = (["Solid", "Translucent"][Math.floor(Math.random() * 2)])!
    if (!locked["Menu Accent"]) newConfig.menuAccent = (["Subtle", "None", "Bold"][Math.floor(Math.random() * 3)])!

    setConfig(newConfig)
    toast.success("Theme shuffled! 🎲")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full h-12 gap-2 border-dashed hover:border-primary hover:text-primary transition-all">
          <Settings2 className="h-4 w-4" />
          <span>Customize Brand Colors & Style</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[350px] p-0 flex flex-col gap-0 border-l shadow-2xl h-screen">
        <div className="p-6 border-b bg-muted/30">
          <SheetHeader className="mb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">Customize</SheetTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.location.reload()}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <SheetDescription>Replicating shadcn/ui create experience.</SheetDescription>
          </SheetHeader>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-9 gap-2" size="sm" onClick={shuffle}>
              <RotateCcw className="h-3.5 w-3.5" /> Shuffle
            </Button>
            <Button variant={mode === "dark" ? "default" : "outline"} size="icon" className="h-9 w-9" onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
               <Palette className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-8 py-6">
            <ConfigSection title="Style" value={config.style} locked={locked["Style"]} onToggleLock={() => toggleLock("Style")}>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => (
                  <ConfigButton 
                    key={s} 
                    label={s} 
                    active={config.style === s} 
                    onClick={() => updateConfig("style", s)} 
                  />
                ))}
              </div>
            </ConfigSection>

            <ConfigSection title="Base Color" value={config.baseColor} locked={locked["Base Color"]} onToggleLock={() => toggleLock("Base Color")}>
              <div className="grid grid-cols-2 gap-2">
                {BASE_COLORS.map((c) => (
                  <ConfigButton 
                    key={c.name} 
                    label={c.name} 
                    active={config.baseColor === c.name} 
                    onClick={() => updateConfig("baseColor", c.name)} 
                  >
                     <span 
                      className="h-3 w-3 rounded-full mr-2 shrink-0 border border-black/10" 
                      style={{ backgroundColor: c.color }} 
                    />
                  </ConfigButton>
                ))}
              </div>
            </ConfigSection>

            <ConfigSection title="Color" value={config.color} locked={locked["Color"]} onToggleLock={() => toggleLock("Color")}>
              <div className="grid grid-cols-3 gap-2">
                {ACCENT_COLORS.map((c) => (
                  <ConfigButton 
                    key={c.name} 
                    label={c.name} 
                    active={config.color === c.name} 
                    onClick={() => updateConfig("color", c.name)} 
                  >
                    <span 
                      className="h-3 w-3 rounded-full mr-2 shrink-0 border border-black/10" 
                      style={{ backgroundColor: c.color }} 
                    />
                  </ConfigButton>
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant={config.color === "Custom" ? "default" : "outline"} 
                      size="sm" 
                      className={cn(
                        "justify-start font-normal text-[10px] h-8 px-2",
                        config.color === "Custom" && "ring-2 ring-primary ring-offset-1"
                      )}
                    >
                      <Pipette className="h-3 w-3 mr-2" />
                      Custom
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-4">
                      <Label>Pick a custom color</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          value={config.customColor} 
                          onChange={(e) => {
                            updateConfig("customColor", e.target.value)
                            updateConfig("color", "Custom")
                          }}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text" 
                          value={config.customColor} 
                          onChange={(e) => {
                            updateConfig("customColor", e.target.value)
                            updateConfig("color", "Custom")
                          }}
                          className="flex-1"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </ConfigSection>

            <ConfigSection title="Chart Color" value={config.chartColor} locked={locked["Chart Color"]} onToggleLock={() => toggleLock("Chart Color")}>
              <div className="grid grid-cols-3 gap-2">
                {ACCENT_COLORS.map((c) => (
                  <ConfigButton 
                    key={c.name} 
                    label={c.name} 
                    active={config.chartColor === c.name} 
                    onClick={() => updateConfig("chartColor", c.name)} 
                  >
                    <span 
                      className="h-3 w-3 rounded-full mr-2 shrink-0 border border-black/10" 
                      style={{ backgroundColor: c.color }} 
                    />
                  </ConfigButton>
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant={config.chartColor === "Custom" ? "default" : "outline"} 
                      size="sm" 
                      className={cn(
                        "justify-start font-normal text-[10px] h-8 px-2",
                        config.chartColor === "Custom" && "ring-2 ring-primary ring-offset-1"
                      )}
                    >
                      <Pipette className="h-3 w-3 mr-2" />
                      Custom
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-4">
                      <Label>Pick a custom chart color</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          value={config.customChartColor} 
                          onChange={(e) => {
                            updateConfig("customChartColor", e.target.value)
                            updateConfig("chartColor", "Custom")
                          }}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text" 
                          value={config.customChartColor} 
                          onChange={(e) => {
                            updateConfig("customChartColor", e.target.value)
                            updateConfig("chartColor", "Custom")
                          }}
                          className="flex-1"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </ConfigSection>

             <ConfigSection title="Heading Font" value={config.fontHeading} locked={locked["Heading Font"]} onToggleLock={() => toggleLock("Heading Font")}>
              <Select value={config.fontHeading} onValueChange={(v) => updateConfig("fontHeading", v)}>
                <SelectTrigger className="w-full h-9 text-xs">
                  <Type className="h-3 w-3 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select heading font" />
                </SelectTrigger>
                <SelectContent>
                  {HEADING_FONTS.map((f) => (
                    <SelectItem key={f} value={f} className="text-xs">
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ConfigSection>

            <ConfigSection title="Body Font" value={config.fontBody} locked={locked["Body Font"]} onToggleLock={() => toggleLock("Body Font")}>
              <Select value={config.fontBody} onValueChange={(v) => updateConfig("fontBody", v)}>
                <SelectTrigger className="w-full h-9 text-xs">
                  <Type className="h-3 w-3 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select body font" />
                </SelectTrigger>
                <SelectContent>
                  {BODY_FONTS.map((f) => (
                    <SelectItem key={f} value={f} className="text-xs">
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ConfigSection>

            <ConfigSection title="Radius" value={config.radius} locked={locked["Radius"]} onToggleLock={() => toggleLock("Radius")}>
              <div className="grid grid-cols-3 gap-2">
                {RADIUS_OPTIONS.map((r) => (
                  <ConfigButton 
                    key={r.name} 
                    label={r.name} 
                    active={config.radius === r.value} 
                    onClick={() => updateConfig("radius", r.value)} 
                  />
                ))}
              </div>
            </ConfigSection>

            <ConfigSection title="Menu" value={config.menu} locked={locked["Menu"]} onToggleLock={() => toggleLock("Menu")}>
              <div className="grid grid-cols-2 gap-2">
                {["Default", "Inverted"].map((m) => (
                  <ConfigButton 
                    key={m} 
                    label={m} 
                    active={config.menu === m} 
                    onClick={() => updateConfig("menu", m)} 
                  />
                ))}
              </div>
            </ConfigSection>

            <ConfigSection title="Appearance" value={config.menuAppearance} locked={locked["Menu Appearance"]} onToggleLock={() => toggleLock("Menu Appearance")}>
              <div className="grid grid-cols-2 gap-2">
                {["Solid", "Translucent"].map((a) => (
                  <ConfigButton 
                    key={a} 
                    label={a} 
                    active={config.menuAppearance === a} 
                    onClick={() => updateConfig("menuAppearance", a)} 
                  />
                ))}
              </div>
            </ConfigSection>

            <ConfigSection title="Menu Accent" value={config.menuAccent} locked={locked["Menu Accent"]} onToggleLock={() => toggleLock("Menu Accent")}>
              <div className="grid grid-cols-3 gap-2">
                {["Subtle", "None", "Bold"].map((a) => (
                  <ConfigButton 
                    key={a} 
                    label={a} 
                    active={config.menuAccent === a} 
                    onClick={() => updateConfig("menuAccent", a)} 
                  />
                ))}
              </div>
            </ConfigSection>
          </div>
        </div>
        
        <div className="p-6 border-t bg-muted/30">
          <Button 
            className="w-full h-10 font-semibold shadow-lg" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save & Apply Theme"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ConfigSection({ title, value, locked, onToggleLock, children }: { title: string; value: string; locked?: boolean; onToggleLock?: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</Label>
          <button onClick={onToggleLock} className="focus:outline-none">
            {locked ? (
              <Lock className="h-3 w-3 text-primary animate-in zoom-in duration-300" />
            ) : (
              <Unlock className="h-3 w-3 text-muted-foreground/50 cursor-pointer hover:text-muted-foreground" />
            )}
          </button>
        </div>
        <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded-full">{value}</span>
      </div>
      {children}
    </div>
  )
}

function ConfigButton({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children?: React.ReactNode }) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      className={cn(
        "justify-start font-normal text-[10px] h-8 px-2 overflow-hidden",
        active && "ring-2 ring-primary ring-offset-1"
      )}
      onClick={onClick}
    >
      {children}
      <span className="truncate">{label}</span>
      {active && <Check className="ml-auto h-3 w-3 shrink-0" />}
    </Button>
  )
}
