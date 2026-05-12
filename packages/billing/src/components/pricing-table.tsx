"use client"

import { Check } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"

export interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  buttonText: string
  current: boolean
  popular?: boolean
}

export interface Invoice {
  id: string
  date: string
  amount: string
  status: "Paid" | "Pending" | "Failed"
}

export interface PaymentMethod {
  id: string
  brand: "visa" | "mastercard" | "amex"
  last4: string
  expiry: string
  isDefault: boolean
}

interface PricingTableProps {
  plans: PricingPlan[]
  onSelect?: (plan: PricingPlan) => void
  billingCycle?: "monthly" | "yearly"
  onCycleChange?: (cycle: "monthly" | "yearly") => void
}

export function PricingTable({ plans, onSelect, billingCycle = "monthly", onCycleChange }: PricingTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Subscription Plans</h3>
          <p className="text-sm text-muted-foreground">
            Choose the plan that best fits your needs.
          </p>
        </div>
        
        <Tabs 
          value={billingCycle} 
          onValueChange={(v) => onCycleChange?.(v as "monthly" | "yearly")}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 md:w-[220px]">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="gap-1.5">
              Yearly 
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-none text-[8px] h-4 px-1.5">
                -20%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn(
            "flex flex-col h-full",
            plan.popular ? "border-primary shadow-sm" : ""
          )}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {plan.current && (
                  <Badge variant="secondary">Active</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="text-3xl font-bold">
                {plan.price === "Custom" ? "Custom" : (
                  <>
                    {billingCycle === "yearly" && plan.price !== "$0" 
                      ? `$${(parseInt(plan.price.replace("$", "")) * 0.8).toFixed(0)}` 
                      : plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </>
                )}
              </div>
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={plan.current ? "outline" : "default"} 
                className="w-full"
                disabled={plan.current}
                onClick={() => onSelect?.(plan)}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
