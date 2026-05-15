"use client"

import { useState } from "react"
import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { 
  PricingTable, 
  BillingHistory, 
  PaymentMethods, 
  UsageOverview,
  PricingPlan,
  PaymentMethod,
  PRICING_PLANS,
  getPriceByPlan
} from "@workspace/billing"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { navSections, currentUser } from "@/lib/navigation"
import { toast } from "sonner"
import { PaymentSelector } from "@/components/payment-selector"

import { 
  Sparkles, 
  CreditCard, 
  Receipt, 
  Target, 
  AlertTriangle, 
  ShieldCheck, 
  Download,
  Zap,
  Globe,
  Lock,
  Crown
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export default function BillingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>(PRICING_PLANS)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PricingPlan | null>(null)

  const handleSelectPlan = (selectedPlan: PricingPlan) => {
    if (selectedPlan.name === "Enterprise") {
      toast.info("Contacting sales team...", {
        description: "An agent will reach out to you shortly to discuss Enterprise options."
      })
      return
    }

    if (selectedPlan.name === "Free") {
      toast.info("You are already on the Free plan")
      return
    }

    setSelectedPlanForPayment(selectedPlan)
    setIsPaymentModalOpen(true)
  }

  // Calculate real IDR amounts for Xendit/Doku
  const getAmount = () => {
    if (!selectedPlanForPayment) return 0
    return getPriceByPlan(selectedPlanForPayment.name, billingCycle)
  }

  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Billing" }]}
    >
      <DashboardShell className="relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <DashboardHeader
            heading="Manajemen Langganan nstok"
            text="Kelola paket layanan untuk optimasi pakan, penjualan, dan akses modal peternakan Anda."
          />
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border p-1 rounded-lg">
            <Button 
              variant={billingCycle === "monthly" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setBillingCycle("monthly")}
              className="rounded-md transition-all"
            >
              Monthly
            </Button>
            <Button 
              variant={billingCycle === "yearly" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setBillingCycle("yearly")}
              className="rounded-md transition-all"
            >
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-600 border-none text-[10px]">SAVE 20%</Badge>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={cn(
                    "relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                    plan.popular ? "border-primary shadow-lg shadow-primary/5 ring-1 ring-primary/20" : "bg-card/50 backdrop-blur-md"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 uppercase tracking-wider">
                        <Crown className="h-3 w-3" /> Most Popular
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                      {plan.price !== "Custom" && (
                        <span className="text-sm text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                      )}
                    </div>
                    <CardDescription className="mt-2 min-h-[40px]">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-primary" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Button 
                      className={cn("w-full h-11 transition-all", plan.current ? "bg-muted text-muted-foreground cursor-default hover:bg-muted" : "shadow-md hover:shadow-primary/20")} 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan)}
                      disabled={plan.current}
                    >
                      {plan.current ? (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          {plan.buttonText}
                        </>
                      ) : (
                        <>
                          {plan.name === "Enterprise" ? <Globe className="mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4" />}
                          {plan.buttonText}
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="history" className="space-y-6">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="history" className="rounded-md">Payment History</TabsTrigger>
                <TabsTrigger value="methods" className="rounded-md">Payment Methods</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-md">Billing Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Transaction History</CardTitle>
                      <CardDescription>View and download your past invoices.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <BillingHistory invoices={[]} />
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Receipt className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <h3 className="font-semibold text-lg">No invoices yet</h3>
                      <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                        Once you make a purchase, your invoices will appear here for easy access.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="methods">
                <PaymentMethods methods={[]} onDelete={() => {}} onSetDefault={() => {}} onAdd={() => {}} />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Billing Information</CardTitle>
                    <CardDescription>This information will be used for your invoices.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Billing Email</Label>
                      <Input defaultValue={currentUser.email} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID (Optional)</Label>
                      <Input placeholder="NPWP / NIK" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Input placeholder="Full Billing Address" />
                    </div>
                    <Button className="w-fit" onClick={() => toast.success("Billing information updated")}>
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <UsageOverview />
            
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <ShieldCheck className="h-12 w-12" />
              </div>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-tighter">
                  <Lock className="h-3 w-3" /> Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kami memproses pembayaran melalui gerbang aman (Xendit & DOKU) untuk memastikan data transaksi peternakan Anda selalu terlindungi.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-8 w-12 bg-card rounded flex items-center justify-center border text-[8px] font-bold text-muted-foreground/50">VISA</div>
                  <div className="h-8 w-12 bg-card rounded flex items-center justify-center border text-[8px] font-bold text-muted-foreground/50">QRIS</div>
                  <div className="h-8 w-12 bg-card rounded flex items-center justify-center border text-[8px] font-bold text-muted-foreground/50">GOPAY</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/10 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[10px] text-muted-foreground mb-4">
                  Closing your account will immediately stop all active subscriptions and delete your billing history.
                </p>
                <Button variant="link" className="text-destructive text-xs p-0 h-auto hover:no-underline font-semibold" onClick={() => toast.error("Cancellation flow coming soon")}>
                  Cancel Subscription &rarr;
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-primary-foreground">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Upgrade ke Paket Grow
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 text-sm">
                Buka fitur feednstok (FCR), POS tanpa batas, dan optimasi bisnis peternakan Anda sekarang.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 bg-card">
            {selectedPlanForPayment && (
              <PaymentSelector 
                amount={getAmount()} 
                items={[
                  {
                    id: selectedPlanForPayment.name.toLowerCase(),
                    name: `${selectedPlanForPayment.name} Plan (${billingCycle})`,
                    price: getAmount(),
                    quantity: 1
                  }
                ]}
              />
            )}
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3" /> Powered by Xendit & DOKU Indonesia
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
