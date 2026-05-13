"use client"

import { useTheme } from "next-themes"
import { Button } from "@workspace/ui/components/button"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Moon, Sun, Laptop, Palette } from "lucide-react"
import { ThemeCustomizer } from "@workspace/ui/components/theme-customizer"

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <div>
        <TypographyH3>Appearance</TypographyH3>
        <TypographyP className="text-muted-foreground">
          Customize the look and feel of the dashboard.
        </TypographyP>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          className="h-24 flex-col gap-2"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-6 w-6" />
          <span>Light</span>
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          className="h-24 flex-col gap-2"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-6 w-6" />
          <span>Dark</span>
        </Button>
        <Button
          variant={theme === "system" ? "default" : "outline"}
          className="h-24 flex-col gap-2"
          onClick={() => setTheme("system")}
        >
          <Laptop className="h-6 w-6" />
          <span>System</span>
        </Button>
      </div>

      <div className="pt-6 border-t">
        <div className="mb-4">
          <TypographyH3 className="text-lg">Advanced Configuration</TypographyH3>
          <TypographyP className="text-sm text-muted-foreground">
            Fine-tune your brand colors, typography, and UI component styles.
          </TypographyP>
        </div>
        <ThemeCustomizer />
      </div>
    </div>
  )
}
