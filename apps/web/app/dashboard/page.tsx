"use client"

import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  BarChart3, 
  Layers 
} from "lucide-react"
import { 
  DashboardLayout, 
  DashboardHeader, 
  DashboardShell, 
  Overview, 
  RecentSales,
  NavSection
} from "@workspace/dashboard"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"

import { navSections, currentUser } from "@/lib/navigation"


export default function DashboardPage() {
  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Overview" }]}
      headerActions={<Button size="sm">Download Report</Button>}
    >
      <DashboardShell>
        <DashboardHeader
          heading="System Overview"
          text="Monitor your application performance and revenue metrics."
        />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          {/* ... other cards ... */}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>You have 265 new events today.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </DashboardLayout>
  )
}
