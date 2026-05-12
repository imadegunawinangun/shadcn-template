"use client"

import { Bell, Check, Info, AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { cn } from "@workspace/ui/lib/utils"

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  time: string
  read: boolean
}

interface NotificationListProps {
  items: NotificationItem[]
  onMarkAllRead?: () => void
}

export function NotificationList({ items, onMarkAllRead }: NotificationListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH3>Notifications</TypographyH3>
          <TypographyP className="text-muted-foreground">
            Stay updated with the latest activities.
          </TypographyP>
        </div>
        <Button variant="outline" size="sm" onClick={onMarkAllRead}>Mark all as read</Button>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4">
          {items.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-4 p-3 rounded-lg transition-colors",
                n.read ? "bg-background" : "bg-primary/5 border border-primary/10"
              )}
            >

              <div className={cn(
                "mt-1 p-2 rounded-full",
                n.type === "info" && "bg-blue-100 text-blue-600",
                n.type === "success" && "bg-green-100 text-green-600",
                n.type === "warning" && "bg-yellow-100 text-yellow-600",
                n.type === "error" && "bg-red-100 text-red-600",
              )}>
                {n.type === "info" && <Info className="h-4 w-4" />}
                {n.type === "success" && <Check className="h-4 w-4" />}
                {n.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                {n.type === "error" && <XCircle className="h-4 w-4" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
