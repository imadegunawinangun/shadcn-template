# Security Feature (@workspace/security)

Modul pengawasan dan audit sistem untuk memastikan akuntabilitas dan keamanan data dalam ekosistem aplikasi.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Administrator Sistem, Tim IT, dan Pemilik Workspace. |
| **What** (Apa) | Paket modular untuk pemantauan keamanan, termasuk log audit aktivitas pengguna dan riwayat perubahan data. |
| **Where** (Dimana) | Digunakan pada dashboard keamanan (`/dashboard/security`) atau panel admin khusus. |
| **When** (Kapan) | Digunakan saat investigasi insiden, audit kepatuhan (compliance), atau pemantauan aktivitas operasional sehari-hari. |
| **Why** (Mengapa) | Menyediakan transparansi penuh (Who, What, When) untuk mencegah penyalahgunaan wewenang dan melacak kesalahan input. |
| **How** (Bagaimana) | Menampilkan riwayat aktivitas melalui komponen `AuditLogList` yang terhubung ke penyimpanan log permanen di database. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/security": "workspace:*"
  }
}
```

### 2. Gunakan Audit Log List
Implementasikan daftar riwayat aktivitas di halaman keamanan:

```tsx
import { AuditLogList } from "@workspace/security"

const logs = [
  { id: "1", action: "UPDATE_PRODUCT", user: "Admin", target: "Kambing Jantan", createdAt: new Date() },
  { id: "2", action: "DELETE_USER", user: "SuperAdmin", target: "Staff_1", createdAt: new Date() }
]

export default function SecurityPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Security & Audit Logs</h1>
      <AuditLogList logs={logs} />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/security` dirancang untuk berinteraksi dengan:

- **`@workspace/database`**: Mengambil data dari tabel `auditLog` yang mencatat setiap aktivitas mutasi data.
- **`@workspace/ui`**: Menggunakan komponen `Table`, `Badge`, `Input`, dan `Card` untuk antarmuka pemantauan.
- **`apps/web`**: Aplikasi utama yang menghosting rute keamanan dan mengelola otentikasi admin untuk mengakses data log sensitif.

---

## Contoh Kasus Penggunaan

1.  **Investigasi Kesalahan**:
    Admin melacak siapa yang melakukan penghapusan data transaksi yang dilaporkan hilang oleh tim operasional melalui log audit.

2.  **Compliance Monitoring**:
    Menghasilkan laporan aktivitas tahunan untuk membuktikan bahwa semua perubahan kebijakan akses telah dilakukan oleh personil yang berwenang.

3.  **Threat Detection**:
    Memantau frekuensi perubahan pengaturan sistem yang tidak biasa untuk mengidentifikasi potensi kompromi akun administrator.

---
*Dibuat untuk ekosistem Web SLO.*
