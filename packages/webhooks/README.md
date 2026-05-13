# @workspace/webhooks

Sistem manajemen endpoint untuk komunikasi data real-time antar sistem (Inbound & Outbound).

## 📝 5W1H (Analisis Strategis)
*   **What**: Gerbang (Gateway) masuk dan keluar bagi data sistem eksternal untuk berinteraksi dengan platform.
*   **Why**: Memungkinkan integrasi real-time dengan pihak ketiga (seperti Stripe, GitHub, atau sistem internal lain) tanpa pooling data manual.
*   **Who**: **Developer Eksternal** (mengirim data), **Developer Internal** (mendaftarkan event), **Admin** (memonitor pengiriman).
*   **Where**: Endpoint publik di `/api/webhooks/incoming/[id]`.
*   **When**: Digunakan saat sistem perlu merespons kejadian (event) secara instan atau mengirim notifikasi ke sistem lain.
*   **How**: Menggunakan Shared Secret untuk verifikasi keamanan dan Dynamic Registry untuk pendaftaran event.

## 🚀 Cara Penggunaan
### 📥 Manajemen Incoming (Menerima Data)
1.  Buka antarmuka **Webhook Manager** dan pilih kategori **Incoming**.
2.  Klik **"+ Incoming"** untuk membuat endpoint baru.
3.  Salin **Endpoint URL** dan **Signing Secret** yang muncul secara instan.
4.  Konfigurasikan **Events** yang ingin Anda tangani dari pengirim.

### 📤 Manajemen Outgoing (Mengirim Data)
1.  Pada **Webhook Manager**, pilih kategori **Outgoing**.
2.  Klik **"+ Outgoing"** dan masukkan **Target URL** server tujuan Anda.
3.  Pilih **Events** di platform ini yang akan memicu pengiriman data ke URL tersebut.

## 📦 Implementasi pada Aplikasi Baru
1.  **Instalasi Dependensi**:
    Tambahkan ke `package.json` aplikasi Anda:
    ```json
    "dependencies": {
      "@workspace/webhooks": "workspace:*"
    }
    ```
2.  **Impor Komponen**:
    ```tsx
    import { WebhookManager } from "@workspace/webhooks"
    import { getWebhooks, getWebhookDeliveries } from "@workspace/webhooks/actions"

    export default async function Page() {
      const webhooks = await getWebhooks(workspaceId);
      const deliveries = await getWebhookDeliveries(workspaceId);
      return <WebhookManager webhooks={webhooks} deliveries={deliveries} workspaceId={workspaceId} />
    }
    ```
3.  **Setup API Route (WAJIB)**:
    Anda harus memiliki API route untuk menerima data. Buat file `app/api/webhooks/incoming/[id]/route.ts` di aplikasi baru Anda untuk menangani request dari pihak luar.

## 🛠️ Informasi Teknis (Developer)
*   **Security**: Menggunakan verifikasi header `x-webhook-secret` untuk Inbound. Outbound mendukung penandatanganan payload (future update).
*   **Event Registry**: Sistem menggunakan `src/registry.ts` untuk mengelola daftar event yang tersedia.
*   **Logging**: Setiap pengiriman/penerimaan dicatat di tabel `webhookDelivery` untuk audit.

### Cara Menambah Event Baru
1.  Buka file fitur Anda (misal di paket lain).
2.  Impor fungsi `registerWebhookEvents` dari `@workspace/webhooks/src/registry`.
3.  Daftarkan event baru Anda (id, label, deskripsi).
4.  Event akan muncul otomatis di UI pemilihan Webhook.

## 👥 Panduan Stakeholder
*   **User**: Gunakan tab ini untuk memantau apakah data dari sistem lain berhasil masuk atau gagal (cek log history).
*   **Owner**: Menjamin integritas data antar sistem dan memungkinkan ekosistem aplikasi yang saling terhubung (Interconnected).
*   **Developer**: Selalu gunakan Secret yang kuat dan lakukan rotasi (Revoke) secara berkala jika ada indikasi kebocoran kunci.

---

## 🏗️ Status Pengembangan: PAUSED
*   **Kondisi Terakhir**: Inbound security aktif, client-side ID generation stabil, Demo Mode aktif.
*   **Rencana Mendatang**: Retries logic untuk pengiriman yang gagal dan dashboard analitik traffic.
