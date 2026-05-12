"use client"

import { ToggleLeft, ToggleRight, Sparkles, ShieldCheck } from "lucide-react"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Switch } from "@workspace/ui/components/switch"
import { Badge } from "@workspace/ui/components/badge"

export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  beta?: boolean
}

interface FeatureFlagsProps {
  flags: FeatureFlag[]
  onToggle?: (flag: FeatureFlag, enabled: boolean) => void
}

export function FeatureFlags({ flags, onToggle }: FeatureFlagsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH3>Feature Flags</TypographyH3>
          <TypographyP className="text-muted-foreground">
            Control the rollout of new features globally.
          </TypographyP>
        </div>
        <ShieldCheck className="h-8 w-8 text-primary opacity-20" />
      </div>

      <div className="space-y-4">
        {flags.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{f.name}</span>
                {f.beta && <Badge variant="secondary" className="text-[10px]">BETA</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{f.description}</p>
            </div>
            <Switch 
              checked={f.enabled} 
              onCheckedChange={(checked) => onToggle?.(f, checked)}
            />

          </div>
        ))}
      </div>
    </div>
  )
}
