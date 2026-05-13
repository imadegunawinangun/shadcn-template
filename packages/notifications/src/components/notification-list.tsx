"use client"

import * as React from "react"
import { Bell, Check, Info, AlertTriangle, XCircle, Trash2, CheckCircle2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
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

export function NotificationList({ items: initialItems, onMarkAllRead }: NotificationListProps) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(initialItems)

  // Notify other components (like sidebar) about unread count
  React.useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length
    window.dispatchEvent(new CustomEvent('notifications:updated', { detail: { unreadCount } }))
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    if (onMarkAllRead) onMarkAllRead()
  }

  const addSimulatedNotification = () => {
    const types: NotificationItem["type"][] = ["info", "success", "warning", "error"]
    const titles = ["System Update", "New Comment", "Security Alert", "Resource Limit", "Meeting Invitation"]
    const messages = [
      "A new version of the platform is available.",
      "Someone commented on your recent post.",
      "A login attempt was detected from a new device.",
      "You have reached 80% of your storage capacity.",
      "You have been invited to a new team project."
    ]
    
    const randomIndex = Math.floor(Math.random() * titles.length)
    const newNotif: NotificationItem = {
      id: Math.random().toString(36).substring(7),
      title: titles[randomIndex],
      message: messages[randomIndex],
      type: types[Math.floor(Math.random() * types.length)],
      time: "Just now",
      read: false
    }
    
    setNotifications(prev => [newNotif, ...prev])
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addSimulatedNotification}
          className="text-xs h-8 border-dashed hover:bg-primary/5"
        >
          <Bell className="mr-2 h-3.5 w-3.5" />
          Simulate New
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleMarkAllRead}
          className="text-xs h-8 hover:bg-primary/5 hover:text-primary transition-all"
          disabled={notifications.length === 0 || notifications.every(n => n.read)}
        >
          <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
          Mark all as read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl bg-muted/10 animate-in fade-in zoom-in duration-300">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No notifications</h3>
          <p className="text-sm text-muted-foreground max-w-[250px] mt-1">
            You're all caught up! We'll notify you when something important happens.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)] min-h-[400px] rounded-2xl border bg-card shadow-sm">
          <div className="divide-y">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "group flex items-start gap-4 p-4 transition-all hover:bg-muted/30",
                  !n.read && "bg-primary/[0.02]"
                )}
              >
                <div className={cn(
                  "mt-1 p-2 rounded-xl transition-transform group-hover:scale-105",
                  n.type === "info" && "bg-blue-100/50 text-blue-600 dark:bg-blue-900/20",
                  n.type === "success" && "bg-green-100/50 text-green-600 dark:bg-green-900/20",
                  n.type === "warning" && "bg-yellow-100/50 text-yellow-600 dark:bg-yellow-900/20",
                  n.type === "error" && "bg-red-100/50 text-red-600 dark:bg-red-900/20",
                )}>
                  {n.type === "info" && <Info className="h-4 w-4" />}
                  {n.type === "success" && <Check className="h-4 w-4" />}
                  {n.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                  {n.type === "error" && <XCircle className="h-4 w-4" />}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <p className={cn(
                        "text-sm font-semibold transition-colors", 
                        !n.read ? "text-primary" : "text-foreground"
                      )}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        {n.time}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!n.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                          onClick={() => markAsRead(n.id)}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => deleteNotification(n.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}



