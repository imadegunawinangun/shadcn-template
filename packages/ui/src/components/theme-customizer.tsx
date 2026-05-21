"use client"

import * as React from "react"
import { Check, Settings2, RotateCcw, Unlock, Lock, Palette, Pipette, Type, Copy, Download, Upload, ClipboardCheck, Terminal } from "lucide-react"
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
import { Badge } from "@workspace/ui/components/badge"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "sonner"
import { updateSiteConfig, getSiteConfig } from "@workspace/database"
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

export interface ThemeCustomizerProps {
  workspaceId: string
  appId?: string | null
  fallbackConfig?: any
  initialConfig?: any
  onSave?: (config: any) => Promise<{ success: boolean; error?: string }>
  onChange?: (config: any) => void
  trigger?: React.ReactNode
  previewOnly?: boolean
}

export function ThemeCustomizer({ workspaceId, appId = null, fallbackConfig, initialConfig, onSave, onChange, trigger, previewOnly = false }: ThemeCustomizerProps) {
  const { theme: mode, setTheme: setMode } = useTheme()
  const [config, setConfig] = useLocalStorage<any>(`theme-config-${workspaceId}${appId ? `-${appId}` : ""}`, {
    style: "Nova",
    baseColor: "Zinc",
    color: "Slate",
    customColor: "#64748b",
    chartColor: "Auto",
    customChartColor: "#64748b",
    fontHeading: "Inter",
    fontBody: "Roboto",
    radius: "0.5",
    secondaryColor: "Slate",
    customSecondaryColor: "#64748b",
    menu: "Default",
    menuAppearance: "Solid",
    menuAccent: "Subtle",
  })
  const [locked, setLocked] = React.useState<Record<string, boolean>>({})
  const [mounted, setMounted] = React.useState(false)
  const [isResetting, setIsResetting] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const originalConfigRef = React.useRef<any>(null)

  const SYSTEM_DEFAULT = {
    style: "Nova",
    baseColor: "Zinc",
    color: "Slate",
    customColor: "#64748b",
    chartColor: "Auto",
    customChartColor: "#64748b",
    fontHeading: "Inter",
    fontBody: "Roboto",
    radius: "0.5",
    secondaryColor: "Slate",
    customSecondaryColor: "#64748b",
    menu: "Default",
    menuAppearance: "Solid",
    menuAccent: "Subtle",
  }

  // Load from database and localStorage on mount
  React.useEffect(() => {
    const init = async () => {
      try {
        // If initialConfig is provided, use it and skip DB fetch
        if (initialConfig) {
          setConfig(initialConfig)
          setMounted(true)
          return
        }

        // 1. Try to fetch from database for this specific workspace/app
        const dbConfig = await getSiteConfig(workspaceId, appId)
        if (dbConfig?.theme) {
          setConfig(dbConfig.theme as any)
          setMounted(true)
          return
        }

        // 2. If no DB config, check fallbackConfig (Inherited)
        if (fallbackConfig) {
          setConfig(fallbackConfig)
          setMounted(true)
          return
        }

        // 3. Fallback to localStorage if available (for unsaved tweaks)
        const storageKey = `theme-config-${workspaceId}${appId ? `-${appId}` : ""}`
        const savedConfig = localStorage.getItem(storageKey)
        if (savedConfig) {
          setConfig(JSON.parse(savedConfig))
        }
      } catch (e) {
        console.error("Failed to load initial theme config", e)
      } finally {
        setMounted(true)
      }
    }

    init()
  }, [workspaceId, appId, fallbackConfig])

  // Apply config to document and save to localStorage
  React.useEffect(() => {
    if (previewOnly) {
      return
    }
    const root = window.document.documentElement
    root.setAttribute("data-style", (config.style || "Nova").toLowerCase())
    root.setAttribute("data-base-color", (config.baseColor || "Zinc").toLowerCase())
    root.setAttribute("data-theme", (config.color || "Slate") === "Custom" ? "custom" : (config.color || "Slate").toLowerCase())
    root.setAttribute("data-secondary-theme", (config.secondaryColor || "Slate") === "Custom" ? "custom" : (config.secondaryColor || "Slate").toLowerCase())
    root.setAttribute("data-chart-color", (config.chartColor || "Auto") === "Custom" ? "custom" : (config.chartColor || "Auto").toLowerCase())
    root.setAttribute("data-font-heading", (config.fontHeading || "Inter").toLowerCase())
    root.setAttribute("data-font-body", (config.fontBody || "Roboto").toLowerCase())
    root.setAttribute("data-radius", config.radius || "0.5")
    root.setAttribute("data-menu", (config.menu || "Default").toLowerCase())
    root.setAttribute("data-menu-appearance", (config.menuAppearance || "Solid").toLowerCase())
    root.setAttribute("data-menu-accent", (config.menuAccent || "Subtle").toLowerCase())
    
    root.style.setProperty("--radius", (config.radius || "0.5").includes("rem") ? config.radius : `${config.radius || "0.5"}rem`)
    
    if (config.color === "Custom") {
      root.style.setProperty("--primary", config.customColor)
    } else {
      root.style.removeProperty("--primary")
    }

    if (config.secondaryColor === "Custom") {
      root.style.setProperty("--secondary", config.customSecondaryColor)
      // For foreground, we can use a simple black/white check or just force a contrast
      // For now let's use primary-foreground if secondary is close to primary, 
      // or just stay with default. Actually, let's just set the variable.
    } else {
      root.style.removeProperty("--secondary")
    }

    if (config.chartColor === "Custom") {
      root.style.setProperty("--chart-1", config.customChartColor)
    } else {
      root.style.removeProperty("--chart-1")
    }
    
    localStorage.setItem(`theme-config-${workspaceId}`, JSON.stringify(config))
  }, [config, workspaceId])

  // Trigger onChange callback to keep visual editor preview in sync
  React.useEffect(() => {
    if (onChange && mounted) {
      onChange(config)
    }
  }, [config, onChange, mounted])

  // Track original theme snapshot to revert if the sheet is closed without saving
  React.useEffect(() => {
    if (isOpen) {
      originalConfigRef.current = { ...config }
    } else if (!isOpen && originalConfigRef.current) {
      // Revert to original settings when closing the sheet without clicking "Save"
      setConfig(originalConfigRef.current)
      originalConfigRef.current = null
    }
  }, [isOpen])

  const [isSaving, setIsSaving] = React.useState(false)
  const [jsonValue, setJsonValue] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  // Update jsonValue whenever config changes
  React.useEffect(() => {
    setJsonValue(JSON.stringify(config, null, 2))
  }, [config])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (previewOnly) {
        originalConfigRef.current = { ...config }
        setIsOpen(false)
        toast.success("Theme applied to the page preview! Fill in the fields and click 'Buat Laman' to finish.")
        return
      }
      if (onSave) {
        const result = await onSave(config)
        if (result.success) {
          originalConfigRef.current = { ...config }
          toast.success("Theme saved successfully!")
        } else {
          toast.error("Failed to save theme: " + result.error)
        }
        return
      }

      const result = await updateSiteConfig(workspaceId, { theme: config }, appId)
      if (result.success) {
        originalConfigRef.current = { ...config }
        toast.success(`Theme saved for this ${appId ? "application" : "workspace"}! 🚀`)
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
      setConfig((prev: any) => ({ ...prev, ...defaults }))
    } else {
      setConfig((prev: any) => ({ ...prev, [key]: value }))
    }
  }

  const toggleLock = (section: string) => {
    setLocked(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleReset = async () => {
    if (previewOnly) {
      if (fallbackConfig) {
        setConfig(fallbackConfig)
        toast.success("Tema direset ke setelan Workspace (Level 2).")
      } else if (initialConfig) {
        setConfig(initialConfig)
        toast.success("Tema direset ke preset bawaan template.")
      } else {
        setConfig(SYSTEM_DEFAULT)
        toast.success("Tema direset ke Default Sistem.")
      }
      return
    }
    if (!confirm("Reset editor ke setelan prioritas di bawahnya? (Tidak langsung menyimpan ke database)")) return
    
    setIsResetting(true)
    try {
      if (fallbackConfig) {
        setConfig(fallbackConfig)
        toast.success(appId ? "Editor direset ke setelan Workspace/Organisasi (Level 1)." : "Editor direset ke setelan prioritas di bawahnya.")
      } else if (appId) {
        // If appId is provided but fallbackConfig is empty, it means Level 1 is empty
        setConfig(SYSTEM_DEFAULT)
        toast.success("Editor direset ke setelan Workspace/Organisasi (Level 1) yang masih bawaan sistem.")
      } else if (workspaceId === "platform") {
        setConfig(SYSTEM_DEFAULT)
        toast.success("Editor direset ke setelan Default Sistem.")
      } else {
        // Fallback fetch jika prop tidak tersedia
        const globalConfig = await getSiteConfig("platform")
        if (globalConfig?.theme) {
          setConfig(globalConfig.theme as any)
          toast.success("Editor memuat setelan dari Global Site.")
        } else {
          setConfig(SYSTEM_DEFAULT)
          toast.success("Editor direset ke Default Sistem.")
        }
      }
    } catch (error) {
      toast.error("Gagal melakukan reset.")
    } finally {
      setIsResetting(false)
    }
  }

  const shuffle = () => {
    const newConfig = { ...config }
    
    if (!locked["Style"]) newConfig.style = STYLES[Math.floor(Math.random() * STYLES.length)]!
    if (!locked["Base Color"]) newConfig.baseColor = BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)]!.name
    if (!locked["Color"]) newConfig.color = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]!.name
    if (!locked["Chart Color"]) newConfig.chartColor = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]!.name
    if (!locked["Heading Font"]) newConfig.fontHeading = HEADING_FONTS[Math.floor(Math.random() * HEADING_FONTS.length)]!
    if (!locked["Body Font"]) newConfig.fontBody = BODY_FONTS[Math.floor(Math.random() * BODY_FONTS.length)]!
    if (!locked["Secondary Color"]) newConfig.secondaryColor = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]!.name
    if (!locked["Radius"]) newConfig.radius = RADIUS_OPTIONS[Math.floor(Math.random() * RADIUS_OPTIONS.length)]!.value
    if (!locked["Menu"]) newConfig.menu = (["Default", "Inverted"][Math.floor(Math.random() * 2)])!
    if (!locked["Menu Appearance"]) newConfig.menuAppearance = (["Solid", "Translucent"][Math.floor(Math.random() * 2)])!
    if (!locked["Menu Accent"]) newConfig.menuAccent = (["Subtle", "None", "Bold"][Math.floor(Math.random() * 3)])!

    setConfig(newConfig)
    toast.success("Theme shuffled! 🎲")
  }

  if (!mounted) {
    return trigger ? (
      <div className="opacity-50 pointer-events-none">{trigger}</div>
    ) : (
      <Button variant="outline" className="w-full h-12 gap-2 border-dashed opacity-50 cursor-not-allowed">
        <Settings2 className="h-4 w-4" />
        <span>Loading Customizer...</span>
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full h-12 gap-2 border-dashed hover:border-primary hover:text-primary transition-all">
            <Settings2 className="h-4 w-4" />
            <span>Customize Brand Colors & Style</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[350px] p-0 flex flex-col gap-0 border-l shadow-2xl h-screen" hideOverlay={true}>
        <div className="p-6 border-b bg-muted/30">
          <SheetHeader className="mb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">Customize</SheetTitle>
              <div className="flex items-center gap-2">
                {fallbackConfig && JSON.stringify(config) === JSON.stringify(fallbackConfig) && (
                  <Badge variant="outline" className="bg-primary/5 text-[9px] h-5 border-dashed">Inherited</Badge>
                )}
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleReset}
                    disabled={isResetting}
                  >
                    {isResetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <SheetDescription className="text-[11px]">
              {fallbackConfig && JSON.stringify(config) === JSON.stringify(fallbackConfig) 
                ? "Showing inherited styles from a lower priority level." 
                : "Customizing unique branding for this level."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-9 gap-2 text-xs" size="sm" onClick={shuffle}>
              <RotateCcw className="h-3.5 w-3.5" /> Shuffle
            </Button>
            {!previewOnly && (
              <Button variant={mode === "dark" ? "default" : "outline"} size="icon" className="h-9 w-9" onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                 {mode === "dark" ? <Palette className="h-4 w-4" /> : <Palette className="h-4 w-4 text-muted-foreground" />}
              </Button>
            )}
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

            <ConfigSection title="Secondary Color" value={config.secondaryColor} locked={locked["Secondary Color"]} onToggleLock={() => toggleLock("Secondary Color")}>
              <div className="grid grid-cols-3 gap-2">
                {ACCENT_COLORS.map((c) => (
                  <ConfigButton 
                    key={c.name} 
                    label={c.name} 
                    active={config.secondaryColor === c.name} 
                    onClick={() => updateConfig("secondaryColor", c.name)} 
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
                      variant={config.secondaryColor === "Custom" ? "default" : "outline"} 
                      size="sm" 
                      className={cn(
                        "justify-start font-normal text-[10px] h-8 px-2",
                        config.secondaryColor === "Custom" && "ring-2 ring-primary ring-offset-1"
                      )}
                    >
                      <Pipette className="h-3 w-3 mr-2" />
                      Custom
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-4">
                      <Label>Pick a custom secondary color</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          value={config.customSecondaryColor} 
                          onChange={(e) => {
                            updateConfig("customSecondaryColor", e.target.value)
                            updateConfig("secondaryColor", "Custom")
                          }}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text" 
                          value={config.customSecondaryColor} 
                          onChange={(e) => {
                            updateConfig("customSecondaryColor", e.target.value)
                            updateConfig("secondaryColor", "Custom")
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
                <ConfigButton 
                  label="Auto" 
                  active={config.chartColor === "Auto"} 
                  onClick={() => updateConfig("chartColor", "Auto")} 
                >
                  <RotateCcw className="h-3 w-3 mr-2" />
                </ConfigButton>
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

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Developer Tools (JSONB)</Label>
              </div>
              
              <div className="relative group">
                <textarea
                  value={jsonValue}
                  onChange={(e) => setJsonValue(e.target.value)}
                  className="w-full h-32 p-3 text-[10px] font-mono bg-muted/50 border rounded-md focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  spellCheck={false}
                />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      navigator.clipboard.writeText(jsonValue)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    title="Copy to clipboard"
                  >
                    {copied ? <ClipboardCheck className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-[10px] gap-2"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonValue)
                    setConfig(parsed)
                  } catch (e) {
                    alert("Invalid JSON format")
                  }
                }}
              >
                <Upload className="h-3 w-3" />
                Apply JSON Config
              </Button>
            </div>
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

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue] as const
}
