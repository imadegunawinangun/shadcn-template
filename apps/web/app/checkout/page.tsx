import { PaymentSelector } from '@/components/payment-selector';

export default function CheckoutPage() {
  // Demo amount: 150,000 IDR
  const amount = 150000;
  
  const items = [
    {
      id: 'prod_1',
      name: 'Premium Plan Subscription',
      price: 150000,
      quantity: 1,
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span>{items[0].name}</span>
              <span className="font-medium">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(items[0].price)}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4">
              <span>Total</span>
              <span>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)}
              </span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Secure Payment</h3>
            <p className="text-sm text-muted-foreground">
              Your transaction is secured with industry-standard encryption. We support multiple local and international payment methods.
            </p>
          </div>
        </div>
        
        <div>
          <PaymentSelector amount={amount} items={items} />
        </div>
      </div>
    </div>
  );
}
