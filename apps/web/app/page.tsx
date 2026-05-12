"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  BarChart3, 
  Layers, 
  Palette, 
  MousePointer2, 
  Type as TypeIcon,
  CircleCheck,
  Info,
  TrendingUp,
  CreditCard
} from "lucide-react"

import { 
  Show, 
  SignInButton, 
  UserButton 
} from "@clerk/nextjs"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { 
  DashboardLayout,
  DashboardHeader,
  DashboardShell,
  Overview, 
  RecentSales,
  NavSection
} from "@workspace/dashboard"

const navSections: NavSection[] = [
  {
    title: "Application",
    items: [
      {
        title: "Overview",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/dashboard",
        icon: BarChart3,
        label: "New",
      },
      {
        title: "Users",
        href: "/users",
        icon: Users,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
      {
        title: "Layouts",
        href: "/layouts",
        icon: Layers,
      },
    ],
  },
]

const currentUser = {
  name: "Rumah Shadcn",
  email: "rumah@example.com",
  image: "https://github.com/shadcn.png",
}

export default function Page() {
  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Design System Showcase" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      }
    >
      <div className="space-y-12">
        {/* Welcome Section */}
        <section className="space-y-4">
          <h2 className="text-4xl font-black tracking-tighter">Welcome to Antigravity UI</h2>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            This is a unified Dashboard System. You are currently viewing the **Design System Showcase** 
            inside the shared `DashboardLayout`.
          </p>
        </section>

        <Tabs defaultValue="ui" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="ui">UI Elements</TabsTrigger>
            <TabsTrigger value="charts">Charts & Data</TabsTrigger>
            <TabsTrigger value="forms">Forms & Cards</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard Feature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ui" className="mt-8 space-y-12">
            {/* Button Showcase */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <h3 className="text-2xl font-bold">Accent Colors & Radius</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Primary Action</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full">Click Me</Button>
                    <Button variant="outline" className="w-full">Outline</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">States</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Badge>New</Badge>
                    <Badge variant="secondary">In Progress</Badge>
                    <Badge variant="outline">Draft</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Typography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6">
                      The quick brown fox jumps over the lazy dog.
                    </p>
                  </CardContent>
                </Card>
                  <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Interactive</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                      <Button size="icon" variant="ghost"><MousePointer2 className="h-4 w-4" /></Button>
                      <Button size="icon" variant="secondary"><CircleCheck className="h-4 w-4" /></Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Typography Showcase */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <TypeIcon className="h-5 w-5 text-primary" />
                <h3 className="text-2xl font-bold">Typography Scaling</h3>
              </div>
              <div className="space-y-4 border-l-4 border-primary pl-6 py-2">
                <h1 className="text-5xl font-black italic">Display Heading</h1>
                <h2 className="text-3xl font-bold">Standard Section Header</h2>
                <h3 className="text-xl font-semibold text-muted-foreground">Subheading or descriptive text</h3>
                <p className="max-w-2xl leading-relaxed">
                  Our typography system automatically scales based on your choice of style. 
                  Vega offers a more spacious and elegant feel, while Maia is compact and technical.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Chart Color Demo</CardTitle>
                  <CardDescription>Variables: --chart-1 to --chart-5</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-end gap-2 px-6">
                  <div className="bg-chart-1 w-full rounded-t-lg transition-all duration-500" style={{ height: "80%" }}></div>
                  <div className="bg-chart-2 w-full rounded-t-lg transition-all duration-500" style={{ height: "60%" }}></div>
                  <div className="bg-chart-1 opacity-80 w-full rounded-t-lg transition-all duration-500" style={{ height: "95%" }}></div>
                  <div className="bg-chart-2 opacity-80 w-full rounded-t-lg transition-all duration-500" style={{ height: "40%" }}></div>
                  <div className="bg-chart-1 opacity-60 w-full rounded-t-lg transition-all duration-500" style={{ height: "70%" }}></div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-chart-1 rounded-full"></div> Data A</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-chart-2 rounded-full"></div> Data B</div>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Design Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm">
                      Notice how the <span className="font-bold">Radius</span> affects the corners of these cards. 
                      Selecting "Full" will make everything very rounded.
                    </p>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <CircleCheck className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm text-primary font-medium">
                      Accent colors are also used for backgrounds with low opacity (like this one) to create focus.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Quick Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Username</label>
                          <div className="h-10 px-3 rounded-md border flex items-center text-sm text-muted-foreground bg-muted/30">
                            @rumah_shadcn
                          </div>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                          <div className="space-y-0.5">
                            <div className="text-sm font-bold">Email Notifications</div>
                            <div className="text-xs text-muted-foreground">Receive daily digest of your activity.</div>
                          </div>
                          <div className="h-6 w-11 bg-primary rounded-full"></div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">Save Changes</Button>
                    </CardFooter>
                </Card>
                
                <div className="space-y-6">
                  <Card className="bg-primary text-primary-foreground">
                      <CardHeader>
                        <CardTitle className="text-lg">Premium Plan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-black">$29/mo</div>
                        <p className="text-xs opacity-80 mt-2">Billed annually.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="secondary" className="w-full">Upgrade Now</Button>
                      </CardFooter>
                  </Card>
                </div>
              </div>
          </TabsContent>
          
          <TabsContent value="dashboard" className="mt-8">
            <DashboardShell>
              <DashboardHeader
                heading="Component Preview"
                text="These components are imported from @workspace/dashboard package."
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">+180.1% since yesterday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Growth</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">57.3%</div>
                      <p className="text-xs text-muted-foreground">+4.3% from last week</p>
                    </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </DashboardShell>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
