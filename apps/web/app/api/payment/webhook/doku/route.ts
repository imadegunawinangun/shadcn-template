import { NextResponse } from 'next/server';
// @ts-ignore
import { db } from '@workspace/database';
// @ts-ignore
import { transaction } from '@workspace/database/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const invoiceNumber = body.order.invoice_number;
    const dokuStatus = body.transaction.status;

    let status: 'pending' | 'success' | 'failed' | 'expired' = 'pending';

    if (dokuStatus === 'SUCCESS') {
      status = 'success';
    } else if (dokuStatus === 'FAILED') {
      status = 'failed';
    } else if (dokuStatus === 'EXPIRED') {
      status = 'expired';
    }

    await db.update(transaction)
      .set({ status, updatedAt: new Date() })
      .where(eq(transaction.id, invoiceNumber));

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('DOKU Webhook Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
