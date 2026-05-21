# Admin Feature (@workspace/admin)

Paket ini menyediakan komponen UI dan alat administratif internal untuk mengelola ekosistem aplikasi secara dinamis.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengembang (Developers) dan Administrator Sistem. |
| **What** (Apa) | Paket modular untuk kontrol internal (Admin Console) seperti Feature Flags, Impersonation, dan Maintenance Mode. |
| **Where** (Dimana) | Digunakan pada rute dashboard admin khusus (contoh: `/dashboard/admin`). |
| **When** (Kapan) | Digunakan saat memerlukan kontrol fitur secara real-time, pengujian fitur beta, atau pemeliharaan sistem darurat. |
| **Why** (Mengapa) | Untuk meningkatkan fleksibilitas operasional tanpa perlu melakukan deployment ulang setiap ada perubahan konfigurasi kecil. |
| **How** (Bagaimana) | Dengan mengintegrasikan komponen UI admin ke dashboard dan menghubungkannya ke backend atau konfigurasi global. |

---

## Cara Menggunakan di Aplikasi Baru

Untuk menggunakan fitur admin di aplikasi Next.js atau React baru dalam monorepo ini:

### 1. Tambahkan Dependensi
Pastikan paket `@workspace/admin` tersedia di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/admin": "workspace:*"
  }
}
```

### 2. Impor dan Gunakan Komponen
Gunakan komponen `FeatureFlags` di halaman admin Anda:

```tsx
import { FeatureFlags } from "@workspace/admin"

const myFlags = [
  { id: "1", name: "Beta Search", description: "Enable AI search engine", enabled: true, beta: true },
  { id: "2", name: "Maintenance Mode", description: "Put site in read-only", enabled: false }
]

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Console</h1>
      <FeatureFlags 
        flags={myFlags} 
        onToggle={(flag, enabled) => console.log(`${flag.name} is now ${enabled}`)} 
      />
    </div>
  )
}
```

---

## Contoh Kasus Penggunaan

1.  **Gradual Rollout (Canary Release)**:
    Mengaktifkan fitur "Pembayaran Kripto" hanya untuk tim internal terlebih dahulu sebelum dirilis ke publik melalui toggle Feature Flag.
    
2.  **Emergency Kill-Switch**:
    Jika fitur "Notifikasi Real-time" menyebabkan beban berlebih pada server, Admin dapat mematikannya secara instan melalui dashboard tanpa harus mematikan seluruh aplikasi.
    
3.  **User Impersonation (Coming Soon)**:
    Tim dukungan pelanggan dapat "masuk sebagai" user yang melaporkan bug untuk melihat persis apa yang mereka lihat tanpa perlu meminta password mereka.
    
4.  **Maintenance Mode**:
    Mengunci akses tulis ke database atau menampilkan banner pemeliharaan secara global saat sedang melakukan upgrade infrastruktur.

## Integrasi Monorepo

Package ini dirancang untuk bekerja secara harmonis dengan paket lain dalam monorepo:
- **`@workspace/dashboard`**: Digunakan sebagai wrapper layout (`DashboardLayout`) untuk konsistensi navigasi dan breadcrumbs.
- **`@workspace/ui`**: Menyediakan komponen dasar seperti `Switch`, `Badge`, dan `Typography` untuk tampilan yang seragam.
- **`apps/web`**: Aplikasi utama yang mengonsumsi package ini untuk merender halaman admin internal.

---
*Dibuat untuk ekosistem Web SLO.*
