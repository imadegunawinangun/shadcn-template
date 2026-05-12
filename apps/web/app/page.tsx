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
  Info
} from "lucide-react"

import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton 
} from "@clerk/nextjs"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
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
  SidebarProvider,
  SidebarInset
} from "@workspace/ui/components/sidebar"
import { ThemeCustomizer } from "@workspace/ui/components/theme-customizer"
import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        {/* Background Decorations to show off Translucent effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-chart-1/10 blur-[100px]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-chart-2/5 blur-[150px]" />
        </div>

        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 flex-1">
            <h1 className="text-lg font-bold tracking-tight">Design System Showcase</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <ThemeCustomizer />
            <div className="ml-2 border-l pl-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="sm">Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-12 max-w-6xl mx-auto w-full">
          {/* Welcome Section */}
          <section className="space-y-4">
            <h2 className="text-4xl font-black tracking-tighter">Welcome to Antigravity UI</h2>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              This page demonstrates how your theme customizations affect different components. 
              Try changing the <span className="font-bold text-primary">Style</span>, <span className="font-bold text-primary">Accent Color</span>, and <span className="font-bold text-primary">Typography</span> in the sidebar.
            </p>
          </section>

          <Tabs defaultValue="ui" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="ui">UI Elements</TabsTrigger>
              <TabsTrigger value="charts">Charts & Data</TabsTrigger>
              <TabsTrigger value="forms">Forms & Cards</TabsTrigger>
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
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b flex items-center justify-center">
        <div className="flex items-center gap-2 font-black px-4">
          <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground">A</div>
          <span className="group-data-[collapsible=icon]:hidden">ANTIGRAVITY</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Analytics">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Users">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Layouts">
                  <Layers className="h-4 w-4" />
                  <span>Layouts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
         <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden w-full">
            <SignedIn>
              <UserButton showName />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="w-full justify-start gap-2 h-8 px-2">
                  <Users className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </SignInButton>
            </SignedOut>
         </div>
      </SidebarFooter>
    </Sidebar>
  )
}
