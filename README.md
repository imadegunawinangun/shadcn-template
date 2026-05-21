# 🌌 Antigravity Enterprise Monorepo Template

**The definitive Next.js monorepo blueprint designed for high-performance, aesthetically superior, and SaaS-ready business ecosystems.**

---

## 🚀 The Vision: Design-Driven Enterprise Architecture

This is not just a boilerplate; it's a **Design-Driven Development** system. It provides the industrial-grade infrastructure needed to build, deploy, and manage multiple business applications (Web, POS, Accounting, Inventory, etc.) under a single, unified, and secure multi-tenant platform.

### 💎 Core Pillars

1.  **SaaS-Ready Multi-Tenancy**: Built-in support for multiple organizations sharing one system. Each organization has its own private "apartment" with its own apps and user permissions.
2.  **Modular "App" System**: Treat features like apps. Turn on "POS" for one client and "Accounting" for another with a single click.
3.  **Visual Excellence**: Built-in support for high-end aesthetics using Tailwind v4 and OKLCH color spaces (Glassmorphism, dynamic gradients, and professional typography).
4.  **Strict Package Boundaries**: Shared logic, UI components, and database schemas are isolated in standalone packages, ensuring your codebase never becomes a "spaghetti" mess.
5.  **AI-Native Developer Experience**: Structured specifically to be understood and extended by AI coding assistants, making development 10x faster.

---

## 🏛️ Arsitektur Multi-Tenant (Analogi Apartemen)

Sistem ini menggunakan struktur **Multi-Tenant Modular** yang sangat canggih namun mudah dipahami. Bayangkan sistem ini seperti sebuah **Gedung Apartemen Besar**:

1.  **Gedung Utama (Satu Platform)**: Anda hanya perlu mengelola satu gedung (satu server/deployment). Ini menghemat biaya dan mempermudah pemeliharaan.
2.  **Unit Apartemen (Workspace)**: Setiap pelanggan Anda (Perusahaan A, Perusahaan B) mendapatkan unit apartemen mereka sendiri. Mereka tinggal di gedung yang sama, tapi **punya kunci masing-masing** dan tidak bisa saling melihat data satu sama lain.
3.  **Kamar yang Bisa Disewa (Modular Apps)**: Di dalam apartemen tersebut, ada banyak kamar (Kamar Website, Kamar Kasir/POS, Kamar Akuntansi). Perusahaan bisa memilih untuk menyewa kamar mana saja sesuai kebutuhan bisnis mereka.
4.  **Izin Akses Anggota Keluarga (Granular Roles)**: Di dalam satu keluarga, setiap orang punya kunci yang berbeda. Ayah mungkin punya kunci ke semua kamar, tapi staff kasir hanya punya kunci ke kamar POS.

---

## ✨ Features & Modules

### 🏦 Core SaaS Infrastructure
- **Unified Auth**: Powered by **Clerk** with full support for Organizations and Multi-session.
- **Database Isolation**: Powered by **Neon Postgres** and **Drizzle ORM**. Setiap baris data dikunci dengan `workspaceId`.
- **Audit Logs**: Melacak setiap perubahan penting (siapa, kapan, apa yang diubah) untuk transparansi tingkat tinggi.
- **Invitation System**: Undang anggota tim dengan peran (role) yang sudah ditentukan untuk setiap aplikasi.

### 🎨 Premium Design System (`@workspace/ui`)
- **Runtime Theme Customizer**: Ganti warna brand, font, dan radius aplikasi secara *real-time* tanpa menyentuh kode.
- **OKLCH Color Engine**: Warna yang lebih hidup dan konsisten di semua layar.
- **Typography Matrix**: 30+ kombinasi font profesional dari Google Fonts.
- **Glassmorphism**: Komponen modern dengan efek *blur* dan *translucent*.

### 🍱 Media & Assets (`@workspace/assets`)
- **Multi-Provider**: Mendukung **ImageKit** dan **Cloudinary** secara bersamaan.
- **Shared Media Gallery**: Satu galeri untuk semua aplikasi. Foto produk POS bisa langsung dipakai di Landing Page.
- **AI-Powered SEO**: Menghasilkan deskripsi gambar (Alt Text) secara otomatis menggunakan AI.

### 💳 Payments & Revenue (`@workspace/payments`)
- **Unified Factory**: Satu interface untuk berbagai provider (**Stripe, Midtrans, Xendit, DOKU**).
- **Checkout Dialogs**: UI pembayaran yang premium dan responsif langsung di dalam dashboard.

### 🔄 Ekosistem Terintegrasi (Data Synergy)

Salah satu kekuatan utama template ini adalah kemampuan antar aplikasi (Web, POS, Accounting) untuk **"saling mengobrol"** secara otomatis karena mereka berbagi satu "Otak" yang sama.

1.  **Satu Ingatan (Shared Database)**: Karena semua aplikasi membaca database yang sama, data selalu sinkron. Jika stok berkurang di aplikasi **POS**, website **E-commerce** Anda akan langsung memperbarui sisa stok secara *real-time* tanpa jeda.
2.  **Logika Terpusat (Shared Actions)**: Fungsi-fungsi penting seperti "Proses Penjualan" disimpan di satu tempat (`packages/database`). Saat fungsi ini dijalankan, ia bisa otomatis mengupdate stok (POS) sekaligus mencatat laporan keuangan (Accounting).
3.  **Otomatisasi Lintas Aplikasi**: Anda bisa mengatur agar saat ada order di **Website**, sistem otomatis membuat draft invoice di **Accounting** dan mengirimkan notifikasi ke printer gudang di **POS**.

**Hasilnya?** Tidak ada lagi kerja dua kali (double input) dan risiko data tidak akurat antar divisi perusahaan Anda.

---

## 📂 Architecture Overview (Monorepo)

```text
├── apps
│   └── web              # Aplikasi Utama (Website Builder, Dashboard, POS UI)
├── packages
│   ├── ui               # Design System: Komponen shadcn & Theme Engine
│   ├── database         # Data Layer: Schema Drizzle & Server Actions
│   ├── payments         # Revenue Layer: Integrasi Payment Gateway
│   ├── dashboard        # Metrics Layer: Widget & Chart Dashboard
│   ├── assets           # Media Layer: Management Gambar & Video
│   ├── settings         # Config Layer: UI untuk pengaturan Web/POS/Accounting
│   └── eslint-config    # Standard: Aturan coding & linting
├── .agents              # AI Agent Workspace: Skill & instruksi AI
├── turbo.json           # Turborepo Config
└── pnpm-workspace.yaml  # Monorepo Orchestration
```

---

## ⚙️ Cara Menambah Aplikasi Baru (Misal: Inventory)

Sistem ini didesain agar sangat mudah diperluas. Namun, Anda harus mengikuti **Standar Pengembangan** agar kode tetap bersih:

1.  **Daftarkan App ID**: Buka `packages/database/src/schema.ts` dan tambahkan ID baru (misal: `"inventory"`) ke dalam konstanta `AVAILABLE_APPS`.
2.  **Modular Schema**: Buat tabel konfigurasi baru (misal: `inventoryConfig`) jika aplikasi tersebut butuh pengaturan unik.
3.  **STANDAR UTAMA (Packages-First Creation)**: 
    *   **BUAT DI PACKAGES**: Jika Anda butuh membuat fitur, logika, atau komponen baru yang bisa dipakai di masa depan, **WAJIB** membuatnya di dalam folder `packages/`, bukan di dalam `apps/`.
    *   **DILARANG** membuat komponen UI baru dari nol jika sudah ada di `@workspace/ui`.
    *   **DILARANG** membuat logika database baru jika sudah ada di `@workspace/database`.
    *   **Apps hanya untuk Orchestration**: Folder `apps/` hanya boleh berisi file *routing*, *layouts*, dan pemanggilan fungsi-fungsi yang ada di `packages/`.
4.  **Implementasi UI**: Buat dashboard baru di dalam `apps/web/app/dashboard/inventory`. Manfaatkan *layout* yang sudah ada.
5.  **Atur Izin**: Daftarkan role khusus aplikasi tersebut di dalam JSONB `appRoles` pada tabel `membership`.

**Ingat**: Semakin banyak Anda menaruh logika di `packages`, semakin mudah Anda membuat aplikasi ke-2, ke-3, dan seterusnya.

---

## 🤖 AI Agent Operating Procedures (AOP)

> [!IMPORTANT]
> **ATURAN WAJIB UNTUK AI AGENT**
> Untuk menjaga integritas arsitektur, semua AI agent HARUS mengikuti aturan ini:

1.  **PACKAGE-FIRST CREATION**: Jika Anda diminta membuat fitur baru, buatlah kodenya di dalam folder `packages/`. Folder `apps/` hanya digunakan untuk menampilkan (rendering) fitur tersebut.
2.  **Jangan Buat Komponen Lokal**: Semua UI harus dibuat di `packages/ui`.
3.  **Gunakan OKLCH**: Dilarang keras menggunakan warna Hex atau RGB. Gunakan variabel CSS (contoh: `bg-primary`).
4.  **Kunci Workspace**: Setiap query database WAJIB menyertakan `workspaceId`.
5.  **Modular Schema**: Jangan mencampur setting POS ke dalam setting Website. Gunakan tabel yang berbeda.

---

## 🏗️ Getting Started

### 1. Persiapan
- Node.js 20+
- pnpm 9+

### 2. Instalasi
```bash
pnpm install
pnpm dev
```

### 3. Migrasi Database
```bash
pnpm --filter @workspace/database db:push
```

## 🏗️ Multi-Tenant Architecture

Template ini menggunakan arsitektur multi-tenant dua level untuk fleksibilitas maksimal:

### Level 1: Organization Context (Clerk)
- **Identity Provider**: Clerk Organizations.
- **Scope**: Perusahaan atau Organisasi utama.
- **Data Isolation**: Menggunakan `workspaceId` (Clerk `orgId`) sebagai primary filter di database.
- **Sync**: Setiap login akan menyinkronkan data organisasi Clerk ke tabel `workspace` lokal.

### Level 2: Entity Context (Internal)
- **Scope**: Unit bisnis di bawah organisasi (contoh: Toko, Gudang, Kebun).
- **Data Isolation**: Menggunakan `entityId` yang merujuk pada tabel `entity`.
- **Implementation**: Hanya aktif pada aplikasi yang membutuhkan (contoh: POS yang memiliki banyak cabang).
- **Flexibility**: Satu organisasi bisa memiliki banyak entitas dengan tipe yang berbeda-beda (`store`, `warehouse`, dll).

### 🔐 Hierarki Role & Access Control (RBAC)

Sistem menggunakan RBAC 2 Tingkat (Global & App-Specific) agar sangat fleksibel untuk organisasi Enterprise:

#### 1. Global Workspace Role (Tingkat Perusahaan)
Berlaku lintas aplikasi dan mengontrol hak akses fundamental terhadap workspace itu sendiri (diatur di tabel `membership`).
- **`owner`**: Kendali absolut (Penagihan, Hapus Workspace, Integrasi Utama).
- **`admin`**: Manajemen operasional (Undang user, ganti nama workspace).
- **`member`**: Anggota tim standar (Butuh App Role untuk melakukan tugas spesifik).
- **`viewer`**: Pengamat (*read-only* murni).

#### 2. App-Specific Role (Tingkat Aplikasi)
Menentukan apa yang bisa dilakukan user di dalam aplikasi tertentu (diatur di tabel `workspaceAppRole`). Seseorang bisa menjadi sekadar `member` di Workspace, tapi menjadi `store_manager` di aplikasi POS.

**Contoh Kasus: Aplikasi Website Builder (template-web)**
Untuk aplikasi pembuat website/landing page ini, peran yang disederhanakan dan lebih praktis adalah:
- **`admin`**: Kendali penuh atas seluruh website (Desain, Pengaturan SEO, Pengaturan Tema/Global, dan Integrasi).
- **`writer`**: Fokus pada penciptaan dan optimalisasi konten (Menulis Blog, menyusun Landing Page, mengatur SEO, menjalankan AI Smart Writer, dan mengatur Tema Level 3 spesifik aplikasi). Tidak punya akses ke pengaturan tema global Level 1/2 atau penagihan perusahaan.

Di dalam *App Role* tersebut juga terdapat lapisan **Granular Permissions** (contoh: `{"can_publish": false, "can_draft": true}`) yang bisa disesuaikan secara dinamis oleh Admin.

---

## 📈 Scaling Strategy

---

## 🚀 Feature Highlights (Modular Architecture)

Sistem ini dibangun dengan arsitektur **Package-First** untuk memastikan skalabilitas dan reusabilitas tinggi antar aplikasi.

### 1. Multi-Tenancy Hierarchy
- **Level 1 (Organization)**: Menggunakan Clerk Organizations untuk manajemen tim dan langganan tingkat tinggi.
- **Level 2 (Entities)**: Manajemen unit bisnis (Toko, Gudang, Cabang) di dalam organisasi menggunakan `@workspace/entities`.

### 2. Modular Navigation System (`@workspace/navigation`)
- **Centralized Registry**: Seluruh menu aplikasi dikelola di satu tempat.
- **App-Aware**: Sidebar otomatis berubah sesuai aplikasi yang sedang aktif (POS, Dashboard, dll).
- **Role-Based**: Menu Admin hanya muncul untuk user dengan role `org:admin`.

### 3. Global Search ⌘K (`@workspace/search`)
- **Contextual Actions**: Menampilkan hasil pencarian dan aksi cepat berdasarkan konteks aplikasi.
- **Premium UX**: Animasi halus dengan integrasi `cmdk` untuk navigasi kilat.

### 4. Smart Onboarding (`@workspace/onboarding`)
- **Multi-Step Flow**: Alur pendaftaran bisnis yang premium dan intuitif.
- **Data Initialization**: Membantu user menyiapkan workspace dan entitas pertama mereka dengan mudah.

### 5. Unified Dashboard Layout (`@workspace/dashboard`)
- **Aesthetic Excellence**: Menggunakan desain Glassmorphism dengan latar belakang dinamis.
- **Shared Components**: Termasuk `DashboardStats`, `SiteHeader`, dan `AppSidebar` yang siap pakai.

### 6. Design System & UI
- **Shadcn/UI Foundation**: Komponen standar industri yang telah dikustomisasi untuk densitas tinggi.
- **Framer Motion**: Animasi mikro di seluruh interface untuk pengalaman pengguna yang premium.

---

### Untuk Bisnis (SaaS)
- **Modular Selling**: Anda bisa menjual "Hanya POS" atau "Paket Lengkap" hanya dengan mengubah satu kolom di database.
- **Branding Per Client**: Setiap klien bisa punya logo dan warna mereka sendiri, tapi berjalan di sistem yang sama.

### Untuk Developer
- **Shared Code**: Perbaiki bug di `packages/ui`, maka semua aplikasi (Web, POS, Accounting) akan langsung terupdate secara otomatis.
- **Turborepo**: Build yang super cepat dengan sistem *caching* yang cerdas.

### ⚙️ Strategi Konfigurasi (ENV vs Database)

Untuk menjaga keamanan dan fleksibilitas, template ini membagi pengaturan menjadi dua lapisan:

#### 1. Lapisan Infrastruktur (File `.env`)
Ini adalah pengaturan "Fondasi" yang hanya bisa diakses oleh Anda sebagai pemilik platform. Pengaturan ini tidak akan pernah berubah antar organisasi.
- **DATABASE_URL**: Koneksi utama ke Neon Postgres.
- **CLERK_SECRET_KEY & PUBLISHABLE_KEY**: Kunci utama untuk sistem autentikasi.
- **IMAGEKIT_PRIVATE_KEY (Master)**: Jika Anda menyediakan penyimpanan default untuk semua user.
- **STRIPE_SECRET_KEY (Platform)**: Untuk menarik biaya langganan dari klien Anda.

#### 2. Lapisan Organisasi (Database Config)
Ini adalah pengaturan yang **bisa diubah-ubah oleh klien Anda** melalui dashboard mereka. Data ini disimpan di tabel `siteConfig`, `posConfig`, dll.
- **Branding**: Logo, Nama Perusahaan, Warna Tema (Primary/Accent).
- **Client Media**: Kredensial ImageKit milik klien sendiri (agar mereka memiliki datanya sendiri).
- **POS Settings**: Tarif Pajak (PPN), Judul Struk, Alamat Toko.
- **Accounting Settings**: Tanggal mulai tahun fiskal, Mata uang dasar.

**Keuntungannya?** Anda tidak perlu melakukan redeploy aplikasi hanya karena klien ingin mengganti logo atau mengubah tarif pajak di kasir mereka.

---

Dibuat dengan ❤️ oleh [Antigravity](https://github.com/imadegunawinangun).
