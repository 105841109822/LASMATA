# 🏛️ LASMATA - Layanan Aspirasi Masyarakat Desa Tembalae

Platform transparansi publik berbasis web untuk menyampaikan aspirasi, keluhan, dan saran pembangunan untuk Desa Tembalae. Proyek ini dikembangkan untuk memfasilitasi komunikasi digital yang terintegrasi antara masyarakat dan instansi pemerintahan desa.

---

## 📋 Tentang Proyek

LASMATA (Layanan Aspirasi Masyarakat Desa Tembalae) adalah sistem manajemen aspirasi masyarakat yang dirancang khusus untuk meningkatkan transparansi dan partisipasi warga dalam pembangunan desa. Platform ini menyediakan kanal komunikasi dua arah antara masyarakat dan pemerintah desa secara modern, responsif, dan akuntabel.

### 🎯 Tujuan Utama

- **Transparansi**: Menyediakan akses publik terhadap aspirasi yang masuk dan memantau status penanganannya.
- **Partisipasi**: Memudahkan warga menyampaikan keluhan atau saran dari mana saja melalui perangkat *mobile* maupun *desktop*.
- **Akuntabilitas**: Membantu pemerintah desa dalam mendokumentasikan dan menindaklanjuti aspirasi masyarakat secara terstruktur.
- **Validitas**: Memastikan laporan yang masuk berasal dari warga asli desa melalui sistem verifikasi Nomor Induk Kependudukan (NIK).

### ✨ Fitur Utama

#### Untuk Masyarakat:
- 📝 **Pengajuan Aspirasi Online** - Formulir pengajuan yang mudah digunakan dengan validasi NIK terdaftar.
- 🔍 **Tracking Status** - Melihat status penanganan aspirasi (Menunggu, Diproses, Selesai).
- 📊 **Dashboard Publik** - Transparansi data daftar aspirasi yang telah masuk dari warga lain.
- 🌓 **Dark/Light Mode** - Antarmuka yang nyaman di mata dengan dukungan mode gelap dan terang.

#### Untuk Administrator (Perangkat Desa):
- 🔐 **Autentikasi Aman** - Sistem login admin terlindungi menggunakan Better Auth.
- 📊 **Dashboard Admin** - Statistik dan ikhtisar seluruh laporan yang masuk.
- ✅ **Manajemen Status Laporan** - Memperbarui status tindak lanjut laporan warga.
- 👥 **Manajemen Master NIK** - Menambah, mengedit, dan mengelola *database* NIK warga yang diizinkan melapor.
- 🔒 **Manajemen Akun** - Pembaruan profil dan kata sandi administrator.

---

## 🚀 Cara Kerja Platform

graph TD
    %% Konfigurasi Warna (Styling)
    classDef warga fill:#d1fae5,stroke:#059669,stroke-width:2px,color:#064e3b,rx:10px,ry:10px;
    classDef admin fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px,color:#312e81,rx:10px,ry:10px;
    classDef sistem fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f;
    classDef db fill:#f3f4f6,stroke:#4b5563,stroke-width:2px,color:#1f2937;

    subgraph Masyarakat [👨‍👩‍👧‍👦 ALUR MASYARAKAT]
        direction TB
        M1[🌐 Akses Website LASMATA]:::warga
        M2[📝 Isi Formulir Aspirasi<br/>NIK, Kategori, Lokasi, dll]:::warga
        M3[👀 Lihat Laporan di<br/>Halaman Publik]:::warga
    end

    subgraph Core [⚙️ SISTEM & DATABASE]
        direction TB
        S1{🔍 Validasi NIK}:::sistem
        S2[(💾 Database Laporan<br/>Status: MENUNGGU)]:::db
        S3[(📋 Master Data NIK)]:::db
    end

    subgraph PerangkatDesa [👨‍💼 ALUR ADMINISTRATOR]
        direction TB
        A1[🔑 Login Portal Admin]:::admin
        A2[📊 Tinjau Laporan Baru<br/>di Dashboard]:::admin
        A3[✅ Ubah Status Laporan<br/>DIPROSES / SELESAI]:::admin
        A4[👥 Kelola Data NIK<br/>Tambah Warga Baru]:::admin
    end

    %% Relasi Alur Masyarakat
    M1 --> M2
    M2 -->|Kirim Data| S1
    S1 -- NIK Tidak Valid --> M2
    S1 -- NIK Valid --> S2
    S2 -->|Tampil Secara Publik| M3

    %% Relasi Database
    S3 -.->|Pengecekan| S1
    
    %% Relasi Alur Administrator
    A1 --> A2
    S2 ===|Data Laporan Masuk| A2
    A2 --> A3
    A3 ===|Update Status Database| S2
    
    %% Manajemen NIK
    A4 ===|Tambah/Edit NIK| S3

---

## 🛠️ Tech Stack (Teknologi yang Digunakan)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes (Dark/Light mode)

### Backend & Database
- **Database**: PostgreSQL (Hosted on Neon)
- **ORM**: Prisma v7.4.1
- **Authentication**: Better Auth
- **Password Hashing**: bcryptjs

### Development Tools
- **Runtime & Package Manager**: Node.js & Bun
- **Linting**: ESLint 9

---

## 🚀 Setup & Instalasi Lokal

### Prasyarat
- Node.js & **Bun** terinstal di komputer.
- Akun [Neon.tech](https://neon.tech/) untuk *database* PostgreSQL.
- Akun GitHub.

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone [https://github.com/username-anda/lasmata-web.git](https://github.com/username-anda/lasmata-web.git)
   cd lasmata-web
