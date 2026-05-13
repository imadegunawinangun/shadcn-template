"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { UserButton } from "@clerk/nextjs"
import { NavSection, UserInfo } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { cn } from "@workspace/ui/lib/utils"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sections: NavSection[]
  user?: UserInfo
  brand?: {
    name: string
    logo: React.ReactNode
  }
}

export function AppSidebar({ sections, user, brand, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = React.useState<number | null>(null)

  React.useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail && typeof customEvent.detail.unreadCount === 'number') {
        setUnreadCount(customEvent.detail.unreadCount)
      }
    }
    window.addEventListener('notifications:updated', handleUpdate)
    return () => window.removeEventListener('notifications:updated', handleUpdate)
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 border-b flex items-center justify-center">
        <div className="flex items-center gap-2 font-black px-4 w-full">
          {brand?.logo || <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground">A</div>}
          <span className="group-data-[collapsible=icon]:hidden truncate font-bold">
            {brand?.name || "ANTIGRAVITY"}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  const displayLabel = (item.title === "Notifications" && unreadCount !== null)
                    ? (unreadCount > 0 ? unreadCount.toString() : null)
                    : item.label

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          {Icon && <Icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                          {displayLabel && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1 text-[10px] font-medium text-primary animate-in zoom-in duration-300">
                              {displayLabel}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 px-2">
          <UserButton 
            showName={true} 
            appearance={{
              elements: {
                userButtonBox: "flex-row-reverse gap-3",
                userButtonOuterIdentifier: "text-sm font-medium p-0",
              }
            }}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
