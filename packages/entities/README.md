# Entities Feature (@workspace/entities)

Modul pemilih data (Entity Selector) universal untuk memfasilitasi pencarian dan pemilihan objek data di seluruh aplikasi.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengguna yang melakukan entri data atau manajemen objek (Admin, Staf). |
| **What** (Apa) | Paket modular yang menyediakan komponen antarmuka untuk mencari dan memilih entitas (seperti Produk, Pelanggan, atau User). |
| **Where** (Dimana) | Digunakan di dalam form transaksi, pengaturan, atau modal pemilihan data. |
| **When** (Kapan) | Digunakan saat sistem membutuhkan referensi ke data yang sudah ada untuk membuat relasi baru. |
| **Why** (Mengapa) | Menstandarisasi pengalaman pencarian data dan memastikan validitas relasi antar objek dalam database. |
| **How** (Bagaimana) | Menggunakan komponen `EntitySelector` berbasis command-menu yang mendukung autocomplete dan rendering kustom. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/entities": "workspace:*"
  }
}
```

### 2. Gunakan Entity Selector
Implementasikan pemilih entitas dalam form Anda:

```tsx
import { EntitySelector } from "@workspace/entities"

const products = [
  { id: "1", label: "Pakan Ayam A", description: "Persediaan 50kg" },
  { id: "2", label: "Vaksin B", description: "Expired 2026" }
]

export default function OrderForm() {
  return (
    <div className="space-y-4">
      <label>Pilih Produk</label>
      <EntitySelector 
        options={products}
        placeholder="Cari produk..."
        onSelect={(item) => console.log("Terpilih:", item)}
      />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/entities` dirancang untuk fleksibilitas:

- **`@workspace/ui`**: Menggunakan komponen dasar (shadcn/ui) seperti `Command`, `Popover`, `Button`, dan `Badge`.
- **`@workspace/database`**: Memberikan data entitas yang valid dari berbagai tabel (seperti `product`, `customer`, atau `user`).
- **`apps/web`**: Menggunakan komponen ini di berbagai modul dashboard untuk mempermudah alur kerja operasional.

---

## Contoh Kasus Penggunaan

1.  **Quick Product Search**:
    Seorang kasir di aplikasi POS dapat dengan cepat mencari dan memilih produk dari ribuan stok hanya dengan mengetik beberapa huruf.

2.  **Assigning Tasks**:
    Manajer operasional memilih anggota tim dari daftar entitas user untuk ditugaskan melakukan pengecekan kesehatan hewan ternak.

3.  **Data Filtering**:
    Menggunakan pemilih entitas sebagai filter pada halaman laporan untuk menampilkan data spesifik berdasarkan kategori atau vendor tertentu.

---
*Dibuat untuk ekosistem Web SLO.*
