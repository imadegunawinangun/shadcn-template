# Notifications Feature (@workspace/notifications)

Modul UI untuk manajemen pemberitahuan dan pembaruan sistem secara terpusat.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Seluruh Pengguna Aplikasi (Admin, Member, dan Pelanggan). |
| **What** (Apa) | Paket modular yang menyediakan komponen daftar notifikasi interaktif untuk memantau aktivitas sistem. |
| **Where** (Dimana) | Digunakan pada halaman notifikasi (`/dashboard/notifications`) atau dropdown notifikasi di header dashboard. |
| **When** (Kapan) | Muncul saat ada pembaruan status transaksi, peringatan keamanan, atau pengumuman dari administrator. |
| **Why** (Mengapa) | Memastikan informasi penting tersampaikan tepat waktu dan memberikan riwayat interaksi sistem yang transparan. |
| **How** (Bagaimana) | Menggunakan komponen `NotificationList` yang mendukung aksi seperti "Mark as Read" dan "Delete" untuk pengelolaan mandiri oleh pengguna. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/notifications": "workspace:*"
  }
}
```

### 2. Gunakan Notification List
Implementasikan daftar notifikasi di halaman atau modal:

```tsx
import { NotificationList } from "@workspace/notifications"

const myNotifications = [
  { id: "1", title: "Pesanan Baru", message: "Anda menerima pesanan #123", type: "info", createdAt: new Date() },
  { id: "2", title: "Peringatan Stok", message: "Stok pakan menipis", type: "warning", createdAt: new Date() }
]

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Pemberitahuan</h1>
      <NotificationList 
        notifications={myNotifications}
        onMarkAsRead={(id) => console.log("Marked as read:", id)}
      />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/notifications` bekerja secara harmonis dengan:

- **`@workspace/ui`**: Menyediakan komponen dasar seperti `Tabs`, `Button`, `Badge`, dan `ScrollArea`.
- **`apps/web`**: Aplikasi utama yang mengelola rute notifikasi dan sinkronisasi badge jumlah notifikasi (unread count) pada sidebar/header.
- **`lucide-react`**: Menggunakan ikonografi untuk membedakan tipe notifikasi (Info, Success, Warning, Error).

---

## Contoh Kasus Penggunaan

1.  **Transaction Alerts**:
    Memberikan informasi instan kepada pemilik toko ketika pembayaran dari pelanggan telah berhasil diverifikasi oleh sistem.

2.  **Team Collaboration**:
    Memberitahu admin ketika ada permintaan bergabung (join request) dari anggota tim baru ke dalam workspace.

3.  **System Maintenance**:
    Menyampaikan pengumuman terjadwal mengenai pemeliharaan infrastruktur agar pengguna dapat melakukan antisipasi operasional.

---
*Dibuat untuk ekosistem Web SLO.*
