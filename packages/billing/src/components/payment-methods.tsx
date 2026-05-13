"use client"

import { CreditCard, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@workspace/ui/components/dropdown-menu"
import { PaymentMethod } from "./pricing-table"
import { toast } from "sonner"
import { AddCardDialog } from "./add-card-dialog"

interface PaymentMethodsProps {
  methods: PaymentMethod[]
  onDelete?: (id: string) => void
  onSetDefault?: (id: string) => void
  onAdd?: (card: any) => void
}

export function PaymentMethods({ methods, onDelete, onSetDefault, onAdd }: PaymentMethodsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Saved Cards</h4>
        <AddCardDialog onAdd={onAdd} />
      </div>

      <div className="grid gap-4">
        {methods.map((method) => (
          <Card key={method.id} className="relative overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-12 bg-muted rounded flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium capitalize">{method.brand} •••• {method.last4}</p>
                    {method.isDefault && (
                      <Badge variant="secondary" className="h-5 text-[10px] bg-primary/10 text-primary border-none">Default</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!method.isDefault && (
                    <DropdownMenuItem onClick={() => onSetDefault?.(method.id)}>
                      Set as default
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete?.(method.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
