# Webhooks Feature (@workspace/webhooks)

Sistem manajemen endpoint untuk komunikasi data real-time antar sistem (Inbound & Outbound) menggunakan arsitektur berbasis event.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengembang, Administrator Sistem, dan Partner Integrasi Pihak Ketiga. |
| **What** (Apa) | Paket modular untuk mengelola pengiriman data otomatis (Outgoing) dan penerimaan data (Incoming) antar sistem melalui HTTP. |
| **Where** (Dimana) | Dikelola melalui antarmuka **Webhook Manager** dan diakses via rute API publik aplikasi. |
| **When** (Kapan) | Digunakan saat sistem perlu merespons kejadian secara instan atau mengirimkan notifikasi ke platform lain tanpa jeda. |
| **Why** (Mengapa) | Memungkinkan integrasi real-time yang efisien dan otomatisasi alur kerja lintas platform. |
| **How** (Bagaimana) | Menggunakan mekanisme Signing Secret untuk keamanan dan registrasi event untuk menentukan pemicu pengiriman data. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/webhooks": "workspace:*"
  }
}
```

### 2. Implementasi Webhook Manager
Gunakan komponen manager di halaman dashboard Anda:

```tsx
import { WebhookManager } from "@workspace/webhooks"
import { getWebhooks, getWebhookDeliveries } from "@workspace/webhooks/actions"

export default async function WebhooksPage({ params }) {
  const webhooks = await getWebhooks(params.workspaceId)
  const deliveries = await getWebhookDeliveries(params.workspaceId)

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Integrasi Webhook</h1>
      <WebhookManager 
        webhooks={webhooks} 
        deliveries={deliveries} 
        workspaceId={params.workspaceId} 
      />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/webhooks` dirancang sebagai jembatan komunikasi:

- **`@workspace/database`**: Bergantung pada tabel `webhook` untuk menyimpan konfigurasi dan `webhookDelivery` untuk log riwayat pengiriman.
- **`@workspace/ui`**: Menggunakan komponen dasar seperti `Table`, `Badge`, `Tabs`, `Dialog`, dan `Button` untuk antarmuka manager.
- **`apps/web`**: Menghosting rute API publik untuk menerima request masuk (incoming) dan memvalidasi token keamanan.

---

## Contoh Kasus Penggunaan

1.  **Payment Gateway Sync**:
    Menerima sinyal dari **Midtrans** atau **Stripe** saat pelanggan menyelesaikan pembayaran dan secara otomatis mengubah status order menjadi "Paid".

2.  **Sistem Notifikasi Eksternal**:
    Mengirimkan data ringkasan pesanan ke endpoint **Discord** atau **Slack** tim operasional setiap kali ada transaksi baru.

3.  **Sinkronisasi Data Inventaris**:
    Mengirimkan update jumlah stok ke sistem e-commerce pihak ketiga (seperti Shopee atau Tokopedia) segera setelah terjadi penjualan di aplikasi POS.

---
*Dibuat untuk ekosistem Web SLO.*
