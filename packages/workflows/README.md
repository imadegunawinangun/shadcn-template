# Workflows Feature (@workspace/workflows)

Modul inti untuk orkestrasi otomasi visual menggunakan sistem berbasis node (Visual Canvas) untuk membangun alur kerja tanpa kode.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Admin Operasional, Manajer Bisnis, dan Pengembang. |
| **What** (Apa) | Platform otomasi visual (No-Code) yang memungkinkan penyusunan alur kerja otomatis menggunakan sistem node dan garis (canvas). |
| **Where** (Dimana) | Terintegrasi di dalam dashboard pada bagian **Automation** atau **Workflows**. |
| **When** (Kapan) | Digunakan saat ingin mengotomatiskan tugas repetitif atau logika bisnis yang sering berubah-ubah. |
| **Why** (Mengapa) | Meningkatkan efisiensi operasional dan fleksibilitas sistem tanpa perlu melakukan perubahan kode sumber. |
| **How** (Bagaimana) | Menggunakan engine eksekusi sekuensial yang menjalankan blok-blok aksi (Pieces) berdasarkan pemicu (Trigger) tertentu. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/workflows": "workspace:*"
  }
}
```

### 2. Implementasi Workflow Manager
Tampilkan daftar workflow di halaman dashboard:

```tsx
import { WorkflowManager } from "@workspace/workflows"
import { getWorkflows } from "@workspace/workflows/actions"

export default async function AutomationPage({ params }) {
  const workflows = await getWorkflows(params.workspaceId)
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Otomasi Alur Kerja</h1>
      <WorkflowManager 
        workflows={workflows} 
        workspaceId={params.workspaceId} 
      />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/workflows` beroperasi sebagai pusat logika otomasi:

- **`@workspace/database`**: Menyimpan struktur node, edge, dan konfigurasi alur kerja dalam tabel `workflow`.
- **`@workspace/ui`**: Menggunakan komponen UI seperti `Button`, `Dialog`, `Input`, `Card`, dan `Switch` untuk editor dan manager.
- **`apps/web`**: Aplikasi utama yang menjalankan engine eksekusi (`engine.ts`) dan menyediakan antarmuka visual berbasis React Flow.

---

## Contoh Kasus Penggunaan

1.  **Welcome Automation**:
    Membuat alur kerja yang secara otomatis mengirimkan email tutorial dan kupon diskon 10% segera setelah pengguna baru mendaftar di platform.

2.  **Low Stock Notification**:
    Otomatis mengirimkan pesan WhatsApp ke manajer pengadaan ketika sistem mendeteksi stok barang di gudang kurang dari 10 unit.

3.  **Payment Overdue Reminder**:
    Menjalankan alur kerja yang memeriksa invoice yang belum dibayar setiap hari dan mengirimkan pengingat bertahap pada hari ke-3, ke-7, dan ke-14 setelah jatuh tempo.

---
*Dibuat untuk ekosistem Web SLO.*
