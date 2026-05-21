# Billing Feature (@workspace/billing)

Modul manajemen langganan, paket harga, dan penagihan terintegrasi untuk model bisnis SaaS.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pemilik Bisnis, Administrator Organisasi, dan Tim Keuangan. |
| **What** (Apa) | Paket modular untuk mengelola paket langganan (Pricing Plans), riwayat penagihan, metode pembayaran, dan monitoring penggunaan. |
| **Where** (Dimana) | Digunakan pada dashboard billing (`/dashboard/billing`) dan halaman landing page (tabel harga). |
| **When** (Kapan) | Digunakan saat pengguna melakukan upgrade/downgrade paket, membayar tagihan, atau mengecek kuota fitur. |
| **Why** (Mengapa) | Mengotomatisasi siklus pendapatan (revenue) dan membatasi akses fitur berdasarkan tier langganan secara sistematis. |
| **How** (Bagaimana) | Menyediakan komponen visual seperti `PricingTable` dan `UsageOverview` yang terintegrasi dengan state langganan organisasi. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/billing": "workspace:*"
  }
}
```

### 2. Tampilkan Tabel Harga
Gunakan komponen `PricingTable` untuk menawarkan paket langganan:

```tsx
import { PricingTable, PRICING_PLANS } from "@workspace/billing"

export default function PricingPage() {
  return (
    <div className="py-20">
      <h1 className="text-center text-3xl font-bold">Pilih Paket Anda</h1>
      <PricingTable 
        plans={PRICING_PLANS} 
        onSelect={(plan) => console.log("Plan selected:", plan.name)}
      />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/billing` bekerja sama dengan modul berikut:

- **`@workspace/payments`**: Menangani eksekusi pembayaran aktual melalui gateway (Stripe/Midtrans).
- **`@workspace/ui`**: Memberikan konsistensi visual melalui komponen `Card`, `Table`, `Dialog`, dan `Button`.
- **`apps/web`**: Aplikasi utama yang menyimpan konfigurasi rencana (`plans.ts`) dan mengelola logika akses fitur berdasarkan status langganan.

---

## Contoh Kasus Penggunaan

1.  **Subscription Tiering**:
    Membatasi jumlah hewan ternak maksimal 50 ekor untuk paket **Starter**, dan memberikan akses **Unlimited** untuk pengguna paket **Grow**.

2.  **Billing History Transparency**:
    Menampilkan daftar invoice bulanan yang dapat dilihat dan dikelola oleh admin perusahaan untuk transparansi biaya operasional.

3.  **Usage Monitoring**:
    Menampilkan progress bar penggunaan kuota fitur (misal: "Anda telah menggunakan 40 dari 50 slot hewan") agar pengguna tahu kapan harus melakukan upgrade.

---
*Dibuat untuk ekosistem Web SLO.*
