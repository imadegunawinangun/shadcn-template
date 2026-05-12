"use client"

import { useState } from "react"
import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { 
  PricingTable, 
  BillingHistory, 
  PaymentMethods, 
  UsageOverview,
  PricingPlan,
  PaymentMethod
} from "@workspace/billing"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { navSections, currentUser } from "@/lib/navigation"
import { mockPlans, mockInvoices, mockPaymentMethods } from "@/lib/mock-data"
import { toast } from "sonner"


import { Sparkles, CreditCard, Receipt, Target, AlertTriangle, ShieldCheck, Download } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export default function BillingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>(mockPlans)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [invoices] = useState(mockInvoices)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const handleSelectPlan = (selectedPlan: PricingPlan) => {
    if (selectedPlan.price === "Custom") {
      toast.info("Contacting sales team...", {
        description: "An agent will reach out to you shortly."
      })
      return
    }

    setPlans(prev => prev.map(plan => ({
      ...plan,
      current: plan.name === selectedPlan.name,
      buttonText: plan.name === selectedPlan.name ? "Current Plan" : 
                  plan.name === "Free" ? "Downgrade" : "Upgrade"
    })))
    
    toast.success(`Switched to ${selectedPlan.name} plan (${billingCycle})`, {
      description: "Your new limits will take effect immediately."
    })
  }

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== id))
    toast.success("Payment method removed")
  }

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(m => ({
      ...m,
      isDefault: m.id === id
    })))
    toast.success("Default payment method updated")
  }

  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Billing" }]}
    >
      <DashboardShell>
        <DashboardHeader
          heading="Billing & Plans"
          text="Manage your subscription, invoices, and payment methods."
        />
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="plans" className="space-y-6">
              <TabsList>
                <TabsTrigger value="plans">Plans</TabsTrigger>
                <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
                <TabsTrigger value="history">Billing History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="plans" className="space-y-4">
                <PricingTable 
                  plans={plans} 
                  onSelect={handleSelectPlan} 
                  billingCycle={billingCycle}
                  onCycleChange={setBillingCycle}
                />
              </TabsContent>
              
              <TabsContent value="payment-methods" className="space-y-6">
                <PaymentMethods 
                  methods={paymentMethods} 
                  onDelete={handleDeletePaymentMethod}
                  onSetDefault={handleSetDefaultPaymentMethod}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Billing Email</CardTitle>
                    <CardDescription>Receive invoices and billing notifications at this address.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input defaultValue={currentUser.email} className="max-w-xs" />
                      <Button variant="outline" onClick={() => toast.success("Billing email updated")}>Update</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <BillingHistory invoices={invoices} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            <UsageOverview />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Billing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs">Address</Label>
                  <Input id="address" placeholder="Billing Address" defaultValue="123 AI Street, Tech City" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs">City</Label>
                    <Input id="city" placeholder="City" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-xs">ZIP</Label>
                    <Input id="zip" placeholder="ZIP" defaultValue="94103" />
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => toast.success("Billing details saved")}>
                  Save Details
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Once you cancel your subscription, you will lose access to all pro features at the end of your billing cycle.
                </p>
                <Button variant="destructive" className="w-full" onClick={() => toast.error("Cancellation flow coming soon")}>
                  Cancel Subscription
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </DashboardLayout>
  )
}
