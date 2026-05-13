"use client"

import * as React from "react"
import Link from "next/link"
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
  CreditCard,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  Globe,
  Rocket,
  CheckCircle2,
  ExternalLink,
  Mail,
  Smartphone,
  Star,
  Image as ImageIcon
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { ThemeCustomizer } from "@workspace/ui/components/theme-customizer"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background font-body overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 dark:opacity-10"></div>
      
      {/* Floating Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-black tracking-tight">Antigravity</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#components" className="text-muted-foreground hover:text-primary transition-colors">Components</Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95">Sign In</Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="rounded-full px-6 hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-300 active:scale-95">Go to Dashboard</Button>
              </Link>
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Zap className="h-3 w-3 mr-2 text-primary" />
              Now powered by Tailwind CSS v4
            </Badge>
            <h1 className="font-heading text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700">
              Build your <span className="text-primary italic">dream app</span> <br />
              faster than ever.
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
              A premium enterprise-grade template with everything you need: 
              Auth, Database, Payments, and a stunning UI engine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Button size="lg" className="h-12 px-8 rounded-full text-lg font-bold group hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 active:scale-95">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-lg font-bold bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:-translate-y-1 transition-all duration-300 active:scale-95">
                View Documentation
              </Button>
            </div>

            {/* Browser Preview Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto p-2 bg-muted/30 border rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 opacity-50"></div>
              <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                <div className="h-10 border-b bg-muted/20 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
                  </div>
                  <div className="h-6 w-64 bg-muted/50 rounded-md mx-auto"></div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    <div className="h-40 w-full bg-muted/30 rounded-2xl animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 w-full bg-muted/20 rounded-xl"></div>
                      <div className="h-24 w-full bg-muted/20 rounded-xl"></div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-12 w-full bg-primary/20 rounded-xl"></div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-muted/40 rounded"></div>
                      <div className="h-4 w-4/5 bg-muted/40 rounded"></div>
                      <div className="h-4 w-3/4 bg-muted/40 rounded"></div>
                    </div>
                    <div className="pt-4 border-t space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted/50"></div>
                          <div className="flex-1 h-3 bg-muted/30 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Showcase */}
        <section id="components" className="py-32 bg-muted/20 border-y">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="space-y-4">
                <h2 className="font-heading text-4xl font-black">Powered by <span className="text-primary italic">shadcn/ui</span></h2>
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Every component is modular, accessible, and fully customizable through our global theme engine.
                </p>
              </div>
              <Link href="/dashboard">
                <Button variant="link" className="group p-0 h-auto text-lg font-bold">
                  Explore Components Library
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="ui" className="w-full">
              <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
                <TabsTrigger value="ui">Core UI</TabsTrigger>
                <TabsTrigger value="data">Data Viz</TabsTrigger>
                <TabsTrigger value="forms">Interactions</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ui" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-lg border-none bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Dynamic Colors
                    </CardTitle>
                    <CardDescription>Accent and Base color system.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button className="rounded-full">Primary</Button>
                      <Button variant="secondary" className="rounded-full">Secondary</Button>
                      <Button variant="outline" className="rounded-full">Outline</Button>
                      <Button variant="ghost" className="rounded-full">Ghost</Button>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-chart-1">Chart 1</Badge>
                      <Badge className="bg-chart-2">Chart 2</Badge>
                      <Badge className="bg-chart-3">Chart 3</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-none bg-background/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TypeIcon className="h-5 w-5 text-primary" />
                      Typography
                    </CardTitle>
                    <CardDescription>Curated font pairings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <h1 className="font-heading text-4xl font-black italic">Display</h1>
                    <p className="font-body text-sm leading-relaxed text-muted-foreground">
                      Our system pairs the best Google Fonts for clarity and professional aesthetics.
                    </p>
                  </CardContent>
                  <CardFooter className="bg-primary/5 py-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Previewing Geist + Inter</span>
                  </CardFooter>
                </Card>

                <Card className="shadow-lg border-none bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MousePointer2 className="h-5 w-5 text-primary" />
                      Status Badges
                    </CardTitle>
                    <CardDescription>Interactive state indicators.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                      <span className="text-sm font-medium">Deployment</span>
                      <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5">Success</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                      <span className="text-sm font-medium">Payment</span>
                      <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5">Pending</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-xl border-none">
                  <CardHeader>
                    <CardTitle>Global Metrics</CardTitle>
                    <CardDescription>Monthly growth trends.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] flex items-end gap-3 px-8">
                    <div className="bg-primary/20 w-full rounded-t-xl h-[40%]"></div>
                    <div className="bg-primary/40 w-full rounded-t-xl h-[60%]"></div>
                    <div className="bg-primary/60 w-full rounded-t-xl h-[80%]"></div>
                    <div className="bg-primary w-full rounded-t-xl h-[100%] shadow-lg shadow-primary/20 animate-pulse"></div>
                    <div className="bg-primary/70 w-full rounded-t-xl h-[90%]"></div>
                    <div className="bg-primary/50 w-full rounded-t-xl h-[70%]"></div>
                  </CardContent>
                </Card>

                <div className="grid gap-6">
                   <div className="flex items-center gap-4 p-6 rounded-3xl border bg-card/50 backdrop-blur-sm shadow-lg">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">+24.5%</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Revenue Growth</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-6 rounded-3xl border bg-card/50 backdrop-blur-sm shadow-lg">
                      <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">12.4k</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Active Sessions</div>
                      </div>
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-6">
                <Alert className="bg-primary/5 border-primary/20 rounded-2xl p-6">
                  <Info className="h-5 w-5 text-primary" />
                  <AlertTitle className="text-lg font-bold mb-2">Heads up!</AlertTitle>
                  <AlertDescription className="text-muted-foreground">
                    You can change the <span className="font-bold text-foreground italic underline">Radius</span> using the Floating Action Button in the bottom left corner. 
                    Try "Full" for a more playful design or "None" for a brutalist aesthetic.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="rounded-3xl border-none shadow-lg">
                    <CardHeader>
                      <CardTitle>FAQ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-none bg-muted/20 px-4 rounded-xl mb-2">
                          <AccordionTrigger className="hover:no-underline font-bold py-4">Is it production ready?</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            Yes, this template uses enterprise standards for code quality and security.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-none bg-muted/20 px-4 rounded-xl">
                          <AccordionTrigger className="hover:no-underline font-bold py-4">Can I use my own fonts?</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            Absolutely. The theme engine supports 30+ curated Google Fonts out of the box.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                  
                  <div className="flex flex-col gap-6">
                    <Card className="rounded-3xl border-none shadow-lg overflow-hidden">
                       <div className="h-2 bg-primary"></div>
                       <CardHeader>
                         <CardTitle className="text-lg">System Update</CardTitle>
                       </CardHeader>
                       <CardContent className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-bold">Shadcn Template</div>
                            <div className="text-xs text-muted-foreground">Updated 2 minutes ago</div>
                          </div>
                       </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-lg bg-accent text-accent-foreground">
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <Shield className="h-5 w-5" />
                           Security First
                         </CardTitle>
                       </CardHeader>
                       <CardContent className="text-sm opacity-90 leading-relaxed">
                         Built-in protection for your routes and data using Clerk and RLS.
                       </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32">
          <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-black mb-4">The Complete <span className="text-primary italic">SaaS</span> Kit</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to launch a modern application in days, not months.
            </p>
          </div>
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Enterprise Auth"
              description="Secure authentication with Clerk. Social logins, MFA, and user management built-in."
            />
            <FeatureCard 
              icon={<Layers className="h-6 w-6 text-primary" />}
              title="Drizzle ORM"
              description="Type-safe database schema with automated migrations and Neon serverless support."
            />
            <FeatureCard 
              icon={<CreditCard className="h-6 w-6 text-primary" />}
              title="Stripe & Payments"
              description="Pre-integrated billing logic with support for subscriptions and one-time payments."
            />
            <FeatureCard 
              icon={<ImageIcon className="h-6 w-6 text-primary" />}
              title="Asset Services"
              description="Modular support for Cloudinary and ImageKit for professional asset management."
            />
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Next.js 15+"
              description="Using the latest App Router, Server Actions, and Turbopack for maximum speed."
            />
            <FeatureCard 
              icon={<Palette className="h-6 w-6 text-primary" />}
              title="Theme Engine"
              description="A unique runtime customizer that controls colors, fonts, and styles instantly."
            />
          </div>
        </section>

        {/* Pricing Table */}
        <section id="pricing" className="py-32 bg-primary/5">
          <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="font-heading text-4xl font-black mb-4">Simple, transparent <span className="text-primary italic">pricing</span></h2>
          </div>
          <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="rounded-3xl border-none shadow-md bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg">Starter</CardTitle>
                <div className="text-4xl font-black mt-2">$0</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Up to 1,000 users</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-50">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Basic analytics</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full rounded-full">Get Started</Button>
              </CardFooter>
            </Card>

            <Card className="rounded-3xl border-2 border-primary shadow-2xl relative scale-105 z-10 overflow-visible">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">Most Popular</div>
              <CardHeader>
                <CardTitle className="text-lg">Pro</CardTitle>
                <div className="text-4xl font-black mt-2">$29<span className="text-lg font-medium opacity-60">/mo</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Unlimited users</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Priority Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Custom domain</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-full shadow-lg shadow-primary/20">Upgrade Now</Button>
              </CardFooter>
            </Card>

            <Card className="rounded-3xl border-none shadow-md bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg">Enterprise</CardTitle>
                <div className="text-4xl font-black mt-2">Custom</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>SLA Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Dedicated account</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full rounded-full">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-primary-foreground shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] group-hover:scale-150 transition-transform duration-1000"></div>
              <h2 className="font-heading text-4xl md:text-6xl font-black mb-8 relative z-10">Ready to build something <span className="italic opacity-80">epic</span>?</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Button variant="secondary" size="lg" className="h-14 px-10 rounded-full text-xl font-bold">
                  Clone Repository
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-xl font-bold bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-white/10">
                  Join Discord
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1.5 rounded-xl">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-heading text-xl font-black tracking-tight">Antigravity</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Empowering developers to create stunning, enterprise-grade applications with zero friction.
              </p>
              <div className="flex gap-4">
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary"><GithubIcon className="h-5 w-5" /></Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary"><Globe className="h-5 w-5" /></Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary"><Mail className="h-5 w-5" /></Button>
              </div>
            </div>
            
            <FooterColumn title="Product" links={["Features", "Components", "Templates", "Pricing"]} />
            <FooterColumn title="Resources" links={["Documentation", "API Reference", "Guides", "Blog"]} />
            <FooterColumn title="Company" links={["About", "Customers", "Contact", "Privacy"]} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t">
            <p className="text-sm text-muted-foreground">© 2026 Antigravity UI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Theme Customizer moved to Dashboard Settings */}
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="rounded-[2.5rem] border-none bg-background shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8">
      <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="space-y-6">
      <h4 className="font-heading text-sm font-bold uppercase tracking-widest">{title}</h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.26 1.23-.26 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}
