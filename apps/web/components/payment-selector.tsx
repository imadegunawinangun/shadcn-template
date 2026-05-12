'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group';
import { Label } from '@workspace/ui/components/label';
import { Loader2, CreditCard, Wallet, Banknote } from 'lucide-react';
import { toast } from 'sonner';

const providers = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'International payments via Credit Card',
    icon: CreditCard,
  },
  {
    id: 'midtrans',
    name: 'Midtrans',
    description: 'Local Indonesian payments (QRIS, VA, GoPay)',
    icon: Wallet,
  },
  {
    id: 'xendit',
    name: 'Xendit',
    description: 'Fast local transfers and e-wallets',
    icon: Banknote,
  },
  {
    id: 'doku',
    name: 'DOKU',
    description: 'Popular Indonesian payment gateway',
    icon: Wallet,
  },
];

interface PaymentSelectorProps {
  amount: number;
  items?: any[];
}

export function PaymentSelector({ amount, items }: PaymentSelectorProps) {
  const [provider, setProvider] = useState('stripe');
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
        throw new Error('Failed to create payment');
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.token) {
        // Handle Midtrans Snap token if needed
        // For simplicity, we assume redirect_url is provided
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Choose Payment Method</CardTitle>
        <CardDescription>Select your preferred payment provider to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={provider} onValueChange={setProvider} className="grid gap-4">
          {providers.map((p) => (
            <div key={p.id}>
              <RadioGroupItem value={p.id} id={p.id} className="peer sr-only" />
              <Label
                htmlFor={p.id}
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <p.icon className="h-6 w-6" />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-between w-full text-lg font-bold">
          <span>Total</span>
          <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)}</span>
        </div>
        <Button className="w-full" size="lg" onClick={handlePayment} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
