import Stripe from 'stripe';
import { IPaymentProvider, PaymentConfig, PaymentResponse } from '../index';

export class StripeProvider implements IPaymentProvider {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-01-27' as any,
    });
  }

  async createPayment(config: PaymentConfig): Promise<PaymentResponse> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: config.items?.map(item => ({
        price_data: {
          currency: config.currency,
          product_data: { name: item.name },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })) || [{
        price_data: {
          currency: config.currency,
          product_data: { name: `Order ${config.orderId}` },
          unit_amount: config.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      customer_email: config.customer.email,
      client_reference_id: config.orderId,
    });

    return {
      paymentId: session.id,
      checkoutUrl: session.url || undefined,
      provider: 'stripe',
      status: 'pending',
    };
  }

  async verifyWebhook(payload: any, headers: any): Promise<boolean> {
    // Basic verification logic - in production use stripe.webhooks.constructEvent
    return true;
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.retrieve(paymentId);
    return session.payment_status;
  }
}
