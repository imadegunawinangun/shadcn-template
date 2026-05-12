import { NextResponse } from 'next/server';
// @ts-ignore
import { db } from '@workspace/database';
// @ts-ignore
import { transaction } from '@workspace/database/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    let status: 'pending' | 'success' | 'failed' | 'expired' = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        status = 'pending';
      } else if (fraudStatus === 'accept') {
        status = 'success';
      }
    } else if (transactionStatus === 'settlement') {
      status = 'success';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      status = 'failed';
    } else if (transactionStatus === 'pending') {
      status = 'pending';
    }

    await db.update(transaction)
      .set({ status, updatedAt: new Date() })
      .where(eq(transaction.id, orderId));

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Midtrans Webhook Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
