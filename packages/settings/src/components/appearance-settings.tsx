"use client"

import { useTheme } from "next-themes"
import { Button } from "@workspace/ui/components/button"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Moon, Sun, Laptop, Palette, Globe, Layout } from "lucide-react"
import { ThemeCustomizer } from "@workspace/ui/components/theme-customizer"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { useState } from "react"

export function AppearanceSettings({ workspaceId }: { workspaceId?: string }) {
  const { theme, setTheme } = useTheme()
  const [editMode, setEditMode] = useState<"workspace" | "global">("workspace")
  
  const activeId = editMode === "global" ? "platform" : workspaceId

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <TypographyH3 className="text-lg">Advanced Configuration</TypographyH3>
            <TypographyP className="text-sm text-muted-foreground">
              {editMode === "global" 
                ? "Editing the public landing page and global theme." 
                : "Editing the theme for your current workspace."}
            </TypographyP>
          </div>
          <Tabs value={editMode} onValueChange={(v: any) => setEditMode(v)}>
            <TabsList className="grid w-[300px] grid-cols-2 h-9">
              <TabsTrigger value="workspace" className="text-xs gap-2">
                <Layout className="h-3.5 w-3.5" />
                Workspace
              </TabsTrigger>
              <TabsTrigger value="global" className="text-xs gap-2">
                <Globe className="h-3.5 w-3.5" />
                Global (Landing)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ThemeCustomizer workspaceId={activeId} />
      </div>
    </div>
  )
}
