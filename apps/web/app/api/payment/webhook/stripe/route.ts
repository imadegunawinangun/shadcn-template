import { NextResponse } from 'next/server';
import Stripe from 'stripe';
// @ts-ignore
import { db } from '@workspace/database';
// @ts-ignore
import { transaction } from '@workspace/database/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.client_reference_id;

  if (event.type === 'checkout.session.completed' && orderId) {
    await db.update(transaction)
      .set({ status: 'success', updatedAt: new Date() })
      .where(eq(transaction.id, orderId));
  } else if (event.type === 'checkout.session.expired' && orderId) {
    await db.update(transaction)
      .set({ status: 'expired', updatedAt: new Date() })
      .where(eq(transaction.id, orderId));
  }

  return NextResponse.json({ received: true });
}
