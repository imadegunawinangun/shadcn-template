import axios from 'axios';
import crypto from 'crypto';
import { IPaymentProvider, PaymentConfig, PaymentResponse } from '../index';

export class DokuProvider implements IPaymentProvider {
  private clientId: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(clientId: string, secretKey: string, isProduction: boolean = false) {
    this.clientId = clientId;
    this.secretKey = secretKey;
    this.baseUrl = isProduction 
      ? 'https://api.doku.com' 
      : 'https://api-sandbox.doku.com';
  }

  private generateSignature(requestId: string, timestamp: string, body: string): string {
    const rawSignature = `Client-Id:${this.clientId}\n` +
      `Request-Id:${requestId}\n` +
      `Request-Timestamp:${timestamp}\n` +
      `Request-Target:/checkout/v1/payment\n` +
      `Digest:${crypto.createHash('sha256').update(body).digest('base64')}`;

    return crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('base64');
  }

  async createPayment(config: PaymentConfig): Promise<PaymentResponse> {
    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString().split('.')[0] + 'Z';
    
    const body = {
      order: {
        invoice_number: config.orderId,
        amount: config.amount,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        line_items: config.items?.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
      customer: {
        name: config.customer.name,
        email: config.customer.email,
      },
    };

    const jsonBody = JSON.stringify(body);
    const signature = this.generateSignature(requestId, timestamp, jsonBody);

    const response = await axios.post(`${this.baseUrl}/checkout/v1/payment`, body, {
      headers: {
        'Client-Id': this.clientId,
        'Request-Id': requestId,
        'Request-Timestamp': timestamp,
        'Signature': `HMACSHA256=${signature}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      paymentId: response.data.response.payment.payment_uuid,
      checkoutUrl: response.data.response.payment.url,
      provider: 'doku',
      status: 'pending',
    };
  }

  async verifyWebhook(payload: any, headers: any): Promise<boolean> {
    // DOKU callback verification logic
    return true;
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    // Implement DOKU status check
    return 'pending';
  }
}
