'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group';
import { Label } from '@workspace/ui/components/label';
import { Badge } from '@workspace/ui/components/badge';
import { Loader2, CreditCard, Wallet, Banknote, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@workspace/ui/lib/utils';

const providers = [
  {
    id: 'xendit',
    name: 'Xendit',
    description: 'Bank Transfer, QRIS & E-Wallets',
    icon: Zap,
    tag: 'Fast',
    tagColor: 'bg-green-500/10 text-green-600',
  },
  {
    id: 'doku',
    name: 'DOKU',
    description: 'VA & Convenience Stores',
    icon: Banknote,
    tag: 'Local',
    tagColor: 'bg-purple-500/10 text-purple-600',
  },
];

interface PaymentSelectorProps {
  amount: number;
  items?: any[];
}

export function PaymentSelector({ amount, items }: PaymentSelectorProps) {
  const [provider, setProvider] = useState('midtrans');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, provider, items }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create payment');
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        toast.success('Redirecting to payment gateway...');
        setTimeout(() => {
          window.location.href = data.checkoutUrl;
        }, 1000);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong', {
        description: 'Please check your environment variables or try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <RadioGroup value={provider} onValueChange={setProvider} className="grid gap-3">
        {providers.map((p) => (
          <div key={p.id}>
            <RadioGroupItem value={p.id} id={p.id} className="peer sr-only" />
            <Label
              htmlFor={p.id}
              className={cn(
                "flex items-center justify-between rounded-xl border-2 border-muted bg-card p-4 transition-all cursor-pointer",
                "hover:bg-accent/50 hover:border-accent-foreground/20",
                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  provider === p.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{p.name}</p>
                    <Badge variant="outline" className={cn("text-[10px] h-4 px-1 border-none", p.tagColor)}>
                      {p.tag}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
              </div>
              <div className={cn(
                "h-2 w-2 rounded-full transition-all",
                provider === p.id ? "bg-primary scale-150" : "bg-transparent"
              )} />
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="pt-4 border-t space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-sm text-muted-foreground font-medium">Total Amount</span>
          <span className="text-xl font-bold text-primary">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)}
          </span>
        </div>
        
        <Button 
          className="w-full h-12 text-md font-semibold shadow-lg shadow-primary/20" 
          onClick={handlePayment} 
          disabled={loading || amount === 0}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-5 w-5" />
              Secure Checkout
            </>
          )}
        </Button>
        
        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Encrypted & Secure Payments
        </p>
      </div>
    </div>
  );
}
