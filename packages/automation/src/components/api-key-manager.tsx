"use client"

import { Key, Copy, Trash2, Eye, EyeOff, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { useState } from "react"

export interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  status?: "Active" | "Inactive"
}

interface ApiKeyManagerProps {
  keys: ApiKey[]
  onCreate?: () => void
  onDelete?: (key: ApiKey) => void
  onCopy?: (key: ApiKey) => void
}

export function ApiKeyManager({ keys, onCreate, onDelete, onCopy }: ApiKeyManagerProps) {
  const [showKey, setShowKey] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH3>API Keys</TypographyH3>
          <TypographyP className="text-muted-foreground">
            Manage your API keys to integrate with external services.
          </TypographyP>
        </div>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Key
        </Button>
      </div>

      <div className="space-y-4">
        {keys.map((k) => (
          <div key={k.id} className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{k.name}</span>
                <Badge variant="outline" className="text-[10px]">{k.status || "Active"}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onCopy?.(k)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete?.(k)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input 
                  readOnly 
                  value={showKey === k.id ? k.key : "••••••••••••••••••••"} 
                  className="font-mono text-xs pr-10"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowKey(showKey === k.id ? null : k.id)}
                >
                  {showKey === k.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <span className="text-[10px] text-muted-foreground">Created {k.created}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
