import { NextResponse } from 'next/server';
// @ts-ignore
import { db } from '@workspace/database';
// @ts-ignore
import { transaction } from '@workspace/database/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const externalId = body.external_id;
    const xenditStatus = body.status;

    let status: 'pending' | 'success' | 'failed' | 'expired' = 'pending';

    if (xenditStatus === 'PAID' || xenditStatus === 'SETTLED') {
      status = 'success';
    } else if (xenditStatus === 'EXPIRED') {
      status = 'expired';
    } else if (xenditStatus === 'FAILED') {
      status = 'failed';
    }

    await db.update(transaction)
      .set({ status, updatedAt: new Date() })
      .where(eq(transaction.id, externalId));

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Xendit Webhook Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
