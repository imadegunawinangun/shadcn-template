"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CreditCard, Loader2, Lock, Plus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"

const cardSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits").max(19),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry (MM/YY)"),
  cvv: z.string().min(3, "CVV must be 3-4 digits").max(4),
  name: z.string().min(2, "Name is too short"),
})

type CardFormValues = z.infer<typeof cardSchema>

interface AddCardDialogProps {
  onAdd?: (card: any) => void
}

export function AddCardDialog({ onAdd }: AddCardDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      name: "",
    },
  })

  const onSubmit = async (data: CardFormValues) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const newCard = {
      id: Math.random().toString(36).substring(7),
      brand: data.cardNumber.startsWith("4") ? "visa" : "mastercard",
      last4: data.cardNumber.slice(-4),
      expiry: data.expiry,
      isDefault: false,
    }

    onAdd?.(newCard)
    setIsSubmitting(false)
    setOpen(false)
    form.reset()
    toast.success("Payment method added successfully")
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-2">
          <Plus className="h-3.5 w-3.5" />
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new credit or debit card to your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Card Preview */}
          <div className="relative h-48 w-full rounded-xl bg-gradient-to-br from-primary/90 to-primary p-6 text-primary-foreground shadow-xl overflow-hidden mb-6">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <CreditCard className="h-24 w-24" />
            </div>
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="flex justify-between items-start">
                <div className="h-10 w-12 bg-white/20 rounded-md backdrop-blur-sm" />
                <div className="text-sm font-medium italic opacity-80 uppercase tracking-widest">
                  {form.watch("cardNumber").startsWith("4") ? "Visa" : "Mastercard"}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-xl font-mono tracking-[0.2em]">
                  {formatCardNumber(form.watch("cardNumber")) || "•••• •••• •••• ••••"}
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase opacity-60">Card Holder</div>
                    <div className="text-sm font-medium uppercase tracking-wider">
                      {form.watch("name") || "Full Name"}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[10px] uppercase opacity-60">Expires</div>
                    <div className="text-sm font-medium">
                      {form.watch("expiry") || "MM/YY"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name on Card</Label>
              <Input 
                id="name" 
                placeholder="John Doe"
                {...form.register("name")}
                className={cn(form.formState.errors.name && "border-destructive")}
              />
              {form.formState.errors.name && (
                <p className="text-[10px] text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input 
                  id="cardNumber" 
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  {...form.register("cardNumber")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    form.setValue("cardNumber", value)
                  }}
                  className={cn("pr-10", form.formState.errors.cardNumber && "border-destructive")}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              {form.formState.errors.cardNumber && (
                <p className="text-[10px] text-destructive">{form.formState.errors.cardNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                <Input 
                  id="expiry" 
                  placeholder="MM/YY"
                  maxLength={5}
                  {...form.register("expiry")}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "")
                    if (value.length > 2) {
                      value = value.substring(0, 2) + "/" + value.substring(2)
                    }
                    form.setValue("expiry", value)
                  }}
                  className={cn(form.formState.errors.expiry && "border-destructive")}
                />
                {form.formState.errors.expiry && (
                  <p className="text-[10px] text-destructive">{form.formState.errors.expiry.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative">
                  <Input 
                    id="cvv" 
                    placeholder="123"
                    maxLength={4}
                    type="password"
                    {...form.register("cvv")}
                    className={cn(form.formState.errors.cvv && "border-destructive")}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
                {form.formState.errors.cvv && (
                  <p className="text-[10px] text-destructive">{form.formState.errors.cvv.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Card"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
