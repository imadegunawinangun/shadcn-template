"use client"

import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { NotificationList } from "@workspace/notifications"
import { navSections, currentUser } from "@/lib/navigation"
import { mockNotifications } from "@/lib/mock-data"


export default function NotificationsPage() {
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
        <NotificationList items={mockNotifications} />

      </DashboardShell>
    </DashboardLayout>
  )
}
