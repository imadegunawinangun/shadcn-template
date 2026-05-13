"use client"

import { Key, Copy, Trash2, Eye, EyeOff, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { useState } from "react"
import { toast } from "sonner"

interface ApiKeyManagerProps {
  keys: any[]
  onCreate?: (name: string) => void
  onDelete?: (id: string) => void
}

export function ApiKeyManager({ keys, onCreate, onDelete }: ApiKeyManagerProps) {
  const [showKey, setShowKey] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")

  const handleCreate = () => {
    if (newKeyName.trim()) {
      onCreate?.(newKeyName)
      setNewKeyName("")
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH3>API Keys</TypographyH3>
          <TypographyP className="text-muted-foreground">Manage programmatic access to your workspace.</TypographyP>
        </div>
        {!isCreating ? (
          <Button onClick={() => setIsCreating(true)}><Plus className="mr-2 h-4 w-4" /> New Key</Button>
        ) : (
          <div className="flex gap-2">
            <Input placeholder="Key Name" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} className="w-48 h-9" autoFocus />
            <Button size="sm" onClick={handleCreate}>Create</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>X</Button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {keys.map(k => (
          <div key={k.id} className="p-4 border rounded-xl bg-card group transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                 <div className="p-2 rounded-lg bg-primary/10 text-primary"><Key className="h-4 w-4" /></div>
                 <span className="font-semibold text-sm">{k.name}</span>
                 <Badge variant="outline" className="text-[10px] uppercase">{k.status}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100" onClick={() => onDelete?.(k.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input readOnly value={showKey === k.id ? k.key : "••••••••••••••••••••"} className="font-mono text-xs pr-10" />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowKey(showKey === k.id ? null : k.id)}>
                   {showKey === k.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => { navigator.clipboard.writeText(k.key); toast.success("Copied!"); }}><Copy className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
