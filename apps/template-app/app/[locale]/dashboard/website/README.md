# Modular Landing Page Builder Architecture

Dokumentasi ini menjelaskan konsep dasar dan arsitektur di balik sistem Landing Page Builder yang digunakan dalam aplikasi ini. Sistem ini dirancang untuk kecepatan, skalabilitas, dan kemudahan kustomisasi visual.

## 4 Pilar Utama Cara Kerja

Sistem ini dibangun di atas pendekatan **Modular Data-Driven Rendering**, yang memisahkan antara data konten, logika penyusunan, dan mesin visual.

### 1. Section Library (Katalog Desain)
Ini adalah "toko" tempat pengguna memilih modul atau bagian halaman.
- **Identitas Unik**: Setiap item dalam library memiliki **ID Varian unik** (misal: #001 hingga #104).
- **Abstraksi**: Library tidak menyimpan kode komponen asli, melainkan hanya metadata dan ID varian. Saat sebuah section dipilih, sistem hanya mencatat ID varian tersebut ke dalam database.

### 2. Builder Client (Editor Penyusun)
Interface interaktif yang digunakan oleh pengguna untuk mengatur struktur halaman.
- **JSON Engine**: Builder mengonversi aksi pengguna (drag-and-drop, edit teks) menjadi sebuah objek **JSON raksasa** yang disimpan di kolom `content` pada database.
- **State Management**: Menggunakan React state untuk sinkronisasi real-time antara input editor dengan data yang akan disimpan.

### 3. Shared Marketing Components (Mesin Visual Visual)
Terletak di paket `@workspace/marketing`, ini adalah kumpulan komponen React nyata yang dibangun dengan **Shadcn UI** dan **Tailwind CSS**.
- **Variant-Aware**: Satu komponen (misal: `Hero.tsx`) memiliki logika internal untuk merubah layout-nya secara otomatis berdasarkan prop `variant` (ID dari Library).
- **Styling**: Menggunakan Tailwind CSS untuk fleksibilitas layout dan **Framer Motion** untuk animasi transisi yang premium (SaaS-style).

### 4. Landing Page Renderer (Jembatan Publik)
Mesin cerdas yang merubah data JSON menjadi tampilan website yang fungsional di sisi publik (`/slug-anda`).
- **Mapping Logic**: Membaca array sections dari database, lalu memutuskan komponen mana yang harus dipanggil dan prop apa yang harus dipasang.
- **Efficiency**: Hanya merender komponen yang diperlukan, memastikan waktu pemuatan halaman (Page Load) yang sangat cepat.

---

## Alur Data (Data Flow)

1. **User Action**: Memilih varian #004 (Hero Glassmorphism) di Builder.
2. **Storage**: JSON `{ type: 'hero', variant: '004', title: '...' }` disimpan di Database.
3. **Fetching**: Laman publik mengambil JSON tersebut melalui Server Action.
4. **Rendering**: Renderer memanggil `<Hero variant="004" title="..." />`.
5. **Output**: Pengunjung melihat Hero dengan efek Glassmorphism yang indah.

---

> [!TIP]
> Untuk menambah varian baru, cukup tambahkan kode layout baru di dalam komponen yang relevan di `@workspace/marketing` dan daftarkan ID barunya di `SectionLibrary`.
