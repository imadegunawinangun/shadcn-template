export interface PaymentConfig {
  amount: number;
  currency: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface PaymentResponse {
  paymentId: string;
  checkoutUrl?: string;
  token?: string; // For Midtrans Snap
  provider: string;
  status: 'pending' | 'success' | 'failed';
}

export interface IPaymentProvider {
  createPayment(config: PaymentConfig): Promise<PaymentResponse>;
  verifyWebhook(payload: any, headers?: any): Promise<boolean>;
  getPaymentStatus(paymentId: string): Promise<string>;
}

export * from './providers/stripe';
export * from './providers/midtrans';
export * from './providers/xendit';
export * from './providers/doku';
export * from './factory';
