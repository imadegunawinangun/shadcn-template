"use client"

import * as React from "react"
import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { NotificationList } from "@workspace/notifications"
import { navSections, currentUser } from "@/lib/navigation"
import { mockNotifications } from "@/lib/mock-data"

export default function NotificationsPage() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    document.title = "Notifications | Dashboard"
  }, [])

  if (!mounted) return null

  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Notifications" }]}
    >
      <DashboardShell>
        <DashboardHeader
          heading="Notifications"
          text="View and manage your application alerts."
        />
        <div className="mt-4">
          <NotificationList items={mockNotifications} />
        </div>
      </DashboardShell>
    </DashboardLayout>
  )
}

