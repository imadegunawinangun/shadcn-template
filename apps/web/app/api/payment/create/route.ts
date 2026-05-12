import { NextResponse } from 'next/server';
import { PaymentFactory, PaymentProviderType } from '@workspace/payments';
// @ts-ignore
import { db } from '@workspace/database';
// @ts-ignore
import { transaction } from '@workspace/database/schema';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { amount, provider, items, currency = 'IDR' } = await req.json();

    if (!amount || !provider) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    const paymentProvider = PaymentFactory.create(provider as PaymentProviderType);
    
    // In a real app, you'd get customer info from Clerk or DB
    const payment = await paymentProvider.createPayment({
      amount,
      currency,
      orderId,
      customer: {
        name: 'User ' + userId,
        email: 'user@example.com', // Replace with real email
      },
      items,
    });

    // Save transaction to DB
    await db.insert(transaction).values({
      id: orderId,
      userId,
      amount,
      currency,
      provider: provider as any,
      providerPaymentId: payment.paymentId,
      status: 'pending',
      checkoutUrl: payment.checkoutUrl,
    });

    return NextResponse.json(payment);
  } catch (error: any) {
    console.error('[PAYMENT_CREATE_ERROR]', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
