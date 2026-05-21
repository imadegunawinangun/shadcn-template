# Payments Feature (@workspace/payments)

Modul infrastruktur pembayaran yang menyediakan antarmuka terpadu (Unified API) untuk berbagai payment gateway.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengembang Backend dan Integrator Sistem Keuangan. |
| **What** (Apa) | Paket abstraksi yang mendukung berbagai provider pembayaran (Stripe, Midtrans, Xendit, Doku) dalam satu antarmuka. |
| **Where** (Dimana) | Digunakan pada logika server-side (Server Actions atau API Routes) untuk pemrosesan transaksi. |
| **When** (Kapan) | Digunakan saat checkout produk, pembayaran langganan, atau validasi webhook status pembayaran. |
| **Why** (Mengapa) | Memudahkan penggantian vendor pembayaran tanpa mengubah logika bisnis dan menstandarisasi penanganan transaksi. |
| **How** (Bagaimana) | Menggunakan pola **Factory Pattern** untuk menginisialisasi provider berdasarkan kebutuhan dan konfigurasi environment. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/payments": "workspace:*"
  }
}
```

### 2. Inisialisasi Provider
Gunakan `PaymentFactory` untuk memilih provider:

```tsx
import { PaymentFactory } from "@workspace/payments"

const paymentProvider = PaymentFactory.create('midtrans')

export async function processOrder(order) {
  const response = await paymentProvider.createPayment({
    amount: order.total,
    currency: 'IDR',
    orderId: order.id,
    customer: {
      name: order.userName,
      email: order.userEmail
    }
  })
  
  return response.checkoutUrl // Redirect pengguna ke halaman bayar
}
```

---

## Integrasi Monorepo

Paket `@workspace/payments` dirancang sebagai layanan inti:

- **`@workspace/billing`**: Paket ini menggunakan abstraksi pembayaran untuk menangani tagihan paket langganan SaaS.
- **`apps/web`**: Menyediakan kunci API (Secret Keys) melalui environment variables yang dikonsumsi oleh factory.
- **`@workspace/database`**: Digunakan untuk mencatat riwayat transaksi dan status pembayaran yang dikonfirmasi melalui webhook.

---

## Contoh Kasus Penggunaan

1.  **Lokal & Internasional Gateway**:
    Gunakan **Midtrans** untuk memproses pembayaran via Bank Transfer (VA) dan E-wallet di Indonesia, serta gunakan **Stripe** untuk menerima pembayaran Kartu Kredit dari pelanggan luar negeri.

2.  **Automated Fulfillment**:
    Saat sistem menerima webhook dari **Xendit** bahwa pembayaran sukses, sistem secara otomatis memberikan akses fitur ke pengguna (unlock features) secara real-time.

3.  **Flexible Subscription**:
    Memungkinkan peralihan provider pembayaran di masa depan (misal: pindah dari Doku ke Midtrans) cukup dengan mengubah konfigurasi satu baris kode di level factory.

---
*Dibuat untuk ekosistem Web SLO.*
