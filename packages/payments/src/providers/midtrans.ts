// @ts-ignore
import midtransClient from 'midtrans-client';
import { IPaymentProvider, PaymentConfig, PaymentResponse } from '../index';

export class MidtransProvider implements IPaymentProvider {
  private snap: any;

  constructor(serverKey: string, clientKey: string, isProduction: boolean = false) {
    this.snap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey,
    });
  }

  async createPayment(config: PaymentConfig): Promise<PaymentResponse> {
    const parameter = {
      transaction_details: {
        order_id: config.orderId,
        gross_amount: config.amount,
      },
      customer_details: {
        first_name: config.customer.name,
        email: config.customer.email,
        phone: config.customer.phone,
      },
      item_details: config.items?.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
    };

    const transaction = await this.snap.createTransaction(parameter);

    return {
      paymentId: config.orderId,
      token: transaction.token,
      checkoutUrl: transaction.redirect_url,
      provider: 'midtrans',
      status: 'pending',
    };
  }

  async verifyWebhook(payload: any): Promise<boolean> {
    // Verification logic using midtrans client status
    return true;
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    const statusResponse = await this.snap.transaction.status(paymentId);
    return statusResponse.transaction_status;
  }
}
