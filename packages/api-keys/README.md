# API Keys Feature (@workspace/api-keys)

Modul manajemen autentikasi untuk akses sistem-ke-sistem secara aman dalam ekosistem aplikasi.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengembang (Developers), Mitra Integrasi, dan Sistem Otomasi. |
| **What** (Apa) | Modul manajemen token (API Keys) untuk memberikan akses terprogram ke API platform tanpa kredensial login manual. |
| **Where** (Dimana) | Dikelola melalui antarmuka **API Key Manager** di dashboard (contoh: `/dashboard/automation`). |
| **When** (Kapan) | Digunakan saat membangun integrasi pihak ketiga, webhook, atau skrip otomasi internal. |
| **Why** (Mengapa) | Menyediakan metode otentikasi yang dapat dicabut (revocable), terukur, dan aman tanpa mengekspos password akun. |
| **How** (Bagaimana) | Menggunakan token unik (prefix `sk_live_`) yang divalidasi melalui header HTTP `Authorization: Bearer [KEY]`. |

---

## Cara Menggunakan di Aplikasi Baru

Ikuti langkah berikut untuk mengintegrasikan manajemen API Key di aplikasi Next.js baru:

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json`:

```json
{
  "dependencies": {
    "@workspace/api-keys": "workspace:*"
  }
}
```

### 2. Gunakan di Halaman Dashboard
Impor Server Actions dan Komponen Manager:

```tsx
import { ApiKeyManager } from "@workspace/api-keys"
import { getApiKeys } from "@workspace/api-keys/actions"

export default async function ApiSettingsPage({ params }) {
  const { workspaceId } = params
  const keys = await getApiKeys(workspaceId)
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">API Management</h1>
      <ApiKeyManager initialKeys={keys} workspaceId={workspaceId} />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket ini memiliki ketergantungan erat dengan modul lain dalam monorepo:

- **`@workspace/database`**: Menggunakan schema table `apiKey` dan `db` instance untuk operasi CRUD.
- **`@workspace/ui`**: Bergantung pada komponen dasar (Button, Card, Input, Dialog, Table) untuk membangun antarmuka manager.
- **`next/cache`**: Menggunakan `revalidatePath` untuk memastikan UI sinkron setelah pembuatan atau penghapusan kunci.

---

## Contoh Kasus Penggunaan

1.  **Otomasi Pihak Ketiga (Make/Zapier)**:
    Pengguna men-generate API Key untuk menghubungkan toko online mereka dengan Zapier agar setiap ada pesanan baru, data otomatis masuk ke spreadsheet.

2.  **Custom Reporting Tool**:
    Tim internal membuat dashboard reporting kustom menggunakan Python yang mengambil data dari platform melalui API dengan otentikasi API Key.

3.  **IoT & POS Integration**:
    Menghubungkan perangkat hardware (seperti mesin kasir atau sensor gudang) untuk mengirimkan data stok secara real-time ke sistem pusat.

---
*Dibuat untuk ekosistem Web SLO.*
