import { StripeProvider } from './providers/stripe';
import { MidtransProvider } from './providers/midtrans';
import { XenditProvider } from './providers/xendit';
import { DokuProvider } from './providers/doku';
import { IPaymentProvider } from './index';

export type PaymentProviderType = 'stripe' | 'midtrans' | 'xendit' | 'doku';

export class PaymentFactory {
  static create(type: PaymentProviderType): IPaymentProvider {
    switch (type) {
      case 'stripe':
        if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is missing');
        return new StripeProvider(process.env.STRIPE_SECRET_KEY);
      case 'midtrans':
        if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
          throw new Error('MIDTRANS_SERVER_KEY or MIDTRANS_CLIENT_KEY is missing');
        }
        return new MidtransProvider(
          process.env.MIDTRANS_SERVER_KEY,
          process.env.MIDTRANS_CLIENT_KEY,
          process.env.NODE_ENV === 'production'
        );
      case 'xendit':
        if (!process.env.XENDIT_SECRET_KEY) throw new Error('XENDIT_SECRET_KEY is missing');
        return new XenditProvider(process.env.XENDIT_SECRET_KEY);
      case 'doku':
        if (!process.env.DOKU_CLIENT_ID || !process.env.DOKU_SECRET_KEY) {
          throw new Error('DOKU_CLIENT_ID or DOKU_SECRET_KEY is missing');
        }
        return new DokuProvider(
          process.env.DOKU_CLIENT_ID,
          process.env.DOKU_SECRET_KEY,
          process.env.NODE_ENV === 'production'
        );
      default:
        throw new Error(`Unsupported payment provider: ${type}`);
    }
  }
}
