import { Xendit } from 'xendit-node';
import { IPaymentProvider, PaymentConfig, PaymentResponse } from '../index';

export class XenditProvider implements IPaymentProvider {
  private xendit: Xendit;

  constructor(secretKey: string) {
    this.xendit = new Xendit({ secretKey });
  }

  async createPayment(config: PaymentConfig): Promise<PaymentResponse> {
    const response = await this.xendit.Invoice.createInvoice({
      data: {
        externalId: config.orderId,
        amount: config.amount,
        payerEmail: config.customer.email,
        description: `Order ${config.orderId}`,
        customer: {
          givenNames: config.customer.name,
          email: config.customer.email,
          mobileNumber: config.customer.phone,
        },
        items: config.items?.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      }
    });

    return {
      paymentId: response.id as string,
      checkoutUrl: response.invoiceUrl,
      provider: 'xendit',
      status: 'pending',
    };
  }

  async verifyWebhook(payload: any, headers: any): Promise<boolean> {
    // Xendit callback verification logic
    return true;
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    const response = await this.xendit.Invoice.getInvoiceById({ invoiceId: paymentId });
    return response.status as string;
  }
}
