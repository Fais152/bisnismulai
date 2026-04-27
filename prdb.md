# BisnisMulai — Product Requirements Document

**Versi:** v1.0 — Initial Release
**Tanggal:** April 2025
**Tech Stack:** Next.js + Node.js + PostgreSQL
**Infrastruktur:** Vercel + Supabase
**Timeline:** 6–12 Bulan, Full Feature
**Builder:** AI-Assisted (Antigravity)
**Monetisasi:** Gratis (Growth Phase)
**Bahasa:** Bahasa Indonesia

---

## Daftar Isi

1. [Ringkasan Produk](#1-ringkasan-produk)
2. [Fitur & Modul Platform](#2-fitur--modul-platform)
3. [Spesifikasi UI/UX](#3-spesifikasi-uiux)
4. [Spesifikasi Frontend](#4-spesifikasi-frontend)
5. [Spesifikasi Backend](#5-spesifikasi-backend)
6. [Spesifikasi Database](#6-spesifikasi-database)
7. [Infrastruktur & Deployment](#7-infrastruktur--deployment)
8. [Keamanan](#8-keamanan)
9. [Timeline Development](#9-timeline-development)
10. [Persyaratan Non-Fungsional](#10-persyaratan-non-fungsional)
11. [Fitur Masa Depan](#11-fitur-masa-depan)

---

## 1. Ringkasan Produk

### 1.1 Visi Produk

BisnisMulai adalah platform web all-in-one yang membimbing calon pengusaha Indonesia membangun bisnis dari nol secara sistematis. Platform ini menggabungkan roadmap terstruktur berbasis 4 fase, ekosistem tools kalkulator bisnis yang saling terhubung, sistem advisory otomatis, dan fitur konsultasi langsung — semuanya dalam satu antarmuka yang intuitif dengan tema gelap sebagai default.

Platform ini dirancang berdasarkan 10 tahun pengalaman konsultan bisnis lapangan, bukan teori. Setiap tool, setiap fase, dan setiap alert yang dihasilkan sistem mencerminkan pola kegagalan dan keberhasilan bisnis nyata.

### 1.2 Masalah yang Diselesaikan

- Calon pengusaha tidak tahu dari mana harus memulai — tidak ada panduan terstruktur yang personal.
- Tools bisnis tersebar di berbagai platform (Excel, Notion, kalkulator online) — tidak ada yang terhubung.
- Banyak yang mulai bisnis tanpa validasi dan sistem yang benar, mengakibatkan kegagalan di bulan ke-4 hingga ke-8.
- Akses ke konsultan bisnis berpengalaman mahal dan tidak terjangkau untuk UMKM.

### 1.3 Target Pengguna

| Segmen | Profil | Kebutuhan Utama |
|---|---|---|
| Pemula Absolut | 18–30 tahun, baru punya ide bisnis, belum pernah buka usaha | Panduan step-by-step dari nol, bahasa sederhana |
| Pemilik UMKM Informal | 30–45 tahun, sudah berjualan tapi belum tersistem | Tools keuangan, SOP, struktur legal |
| Mahasiswa Wirausaha | 18–25 tahun, ada modal kecil, butuh validasi ide | BMC, analisis kompetitor, break-even |
| Profesional Transisi | 25–40 tahun, keluar kerja, ingin buka bisnis sendiri | Cash flow, pricing strategy, roadmap realistis |

---

## 2. Fitur & Modul Platform

### 2.1 Sistem Roadmap 4 Fase

Inti dari platform ini adalah sistem roadmap bertahap yang tidak bisa dilewati. Setiap fase memiliki checklist minimum yang harus diselesaikan sebelum fase berikutnya terbuka.

| Fase | Nama | Durasi Est. | Checklist Kunci |
|---|---|---|---|
| 01 | Validasi Ide | 2–4 minggu | Riset pasar, analisis 3 kompetitor, survei demand min. 30 responden |
| 02 | Bangun Sistem | 4–8 minggu | HPP dihitung, SOP dibuat, struktur legal dipilih, pembukuan setup |
| 03 | Launch & Akuisisi | 4–8 minggu | Channel penjualan aktif, 10 pelanggan pertama, pricing divalidasi |
| 04 | Skala & Tumbuh | Ongoing | KPI dashboard aktif, cash flow 6 bulan diproyeksi, rekrutmen pertama |

### 2.2 Ekosistem Tools

#### 2.2.1 Kalkulator HPP & Harga Jual

- **Input:** biaya bahan baku, biaya tenaga kerja, biaya overhead, target margin (%).
- **Output:** HPP per unit, harga jual minimal, estimasi profit per unit.
- **Koneksi:** Output HPP otomatis menjadi input break-even analysis.
- **Advisory:** Jika margin < 20%, sistem memunculkan peringatan dan rekomendasi spesifik.

#### 2.2.2 Break-Even Analysis

- **Input:** HPP (dari tool sebelumnya atau manual), harga jual, total biaya tetap per bulan.
- **Output:** unit break-even per bulan, omzet break-even, estimasi waktu balik modal.
- **Koneksi:** Output unit break-even menjadi baseline proyeksi di cash flow projector.

#### 2.2.3 Cash Flow Projector (12 Bulan)

- **Input:** omzet bulan ke-0, asumsi pertumbuhan (%/bulan), biaya tetap, biaya variabel per unit.
- **Output:** tabel arus kas 12 bulan, grafik visualisasi, bulan-bulan proyeksi negatif di-highlight merah.
- **Smart check:** sistem membandingkan asumsi pertumbuhan dengan benchmark industri dan memberi peringatan jika terlalu agresif.

#### 2.2.4 Business Model Canvas Builder

- 9 blok canvas interaktif: Value Proposition, Customer Segments, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure.
- Setiap blok memiliki panduan pertanyaan dan contoh nyata sesuai jenis bisnis yang dipilih saat profiling.
- BMC terhubung ke metrik: Value Proposition terhubung ke repeat rate di KPI dashboard, Revenue Streams terhubung ke cash flow.

#### 2.2.5 Analisis Kompetitor

- Framework terstruktur: identifikasi 3–5 kompetitor, bandingkan di 8 dimensi (harga, kualitas, distribusi, brand, dll).
- Output: matriks perbandingan, identifikasi gap pasar, rekomendasi positioning.

#### 2.2.6 SOP Builder

- Template SOP untuk 5 kategori: produksi, layanan pelanggan, keuangan, pengiriman, rekrutmen.
- Setiap SOP dapat dikustomisasi, disimpan, dan diexport sebagai PDF.

#### 2.2.7 Pricing Strategy Advisor

- **Input:** jenis bisnis, HPP, harga kompetitor, nilai unik produk.
- **Output:** rekomendasi strategi pricing (cost-plus, value-based, penetration, atau premium) beserta alasan dan risiko masing-masing.

#### 2.2.8 KPI Dashboard & Business Health Score

- Metrik yang dilacak: omzet aktual vs target, gross margin, customer acquisition cost (CAC), repeat order rate, inventory turnover.
- Business Health Score: skor 0–100 yang dihitung dari kombinasi metrik utama, diperbarui setiap bulan.
- Alert otomatis: notifikasi jika ada metrik yang di bawah threshold yang ditetapkan.

#### 2.2.9 Legal & Izin Checklist

- Panduan memilih badan usaha: UD, CV, PT, atau PT Perorangan — beserta perbandingan biaya, kompleksitas, dan kecocokan untuk skala bisnis.
- Checklist izin operasional: NIB (OSS), PIRT, Halal, SNI, dan lainnya sesuai kategori bisnis.
- Kewajiban pajak dasar: panduan NPWP, PPh 21, PPN, dan tarif PPh Final UMKM 0,5%.

### 2.3 Sistem Konsultasi Booking

- User dapat booking sesi konsultasi 1-on-1 dengan konsultan via kalender terintegrasi.
- Durasi pilihan: 30 menit, 60 menit, 90 menit.
- Sebelum sesi, user mengisi form briefing singkat yang menarik data dari profil dan tools mereka.
- Konsultan menerima ringkasan otomatis: fase user, Business Health Score, tools yang sudah diisi.
- Meeting dilakukan via Google Meet atau Zoom (link digenerate otomatis).
- Catatan post-sesi disimpan di profil user sebagai referensi sesi berikutnya.
- **Payment gateway:** diimplementasikan di fase berikutnya. Saat ini konsultasi gratis.

### 2.4 Sistem Advisory Otomatis

Advisory Engine adalah lapisan kecerdasan platform yang menganalisis data user secara kontekstual dan menghasilkan rekomendasi spesifik — bukan panduan generik.

- **Rule-based alerts:** kondisi tertentu (margin < 20%, cash flow negatif bulan ke-3, tidak ada update 14 hari) memicu notifikasi spesifik.
- **Monthly diagnosis:** setiap bulan, platform menghasilkan laporan ringkas — apa yang on-track, apa yang perlu perhatian, keputusan apa yang harus dibuat bulan ini.
- **Phase gate validation:** sebelum fase berikutnya dibuka, sistem memverifikasi kelengkapan checklist minimum dan memberikan feedback jika ada yang belum selesai.

---

## 3. Spesifikasi UI/UX

### 3.1 Tema & Design System

Platform menggunakan dark theme sebagai default dengan opsi toggle ke light mode. Preferensi tema disimpan di `localStorage` dan database (sinkron antar perangkat untuk user yang login).

#### 3.1.1 Palet Warna — Dark Mode (Default)

| Token | Hex | Penggunaan |
|---|---|---|
| `background.primary` | `#0E0E0E` | Background utama halaman |
| `background.secondary` | `#1A1A1A` | Card, sidebar, panel |
| `background.tertiary` | `#242424` | Input, dropdown, hover state |
| `accent.primary` | `#1D9E75` | CTA, progress, active state |
| `accent.hover` | `#5DCAA5` | Hover pada elemen accent |
| `accent.light` | `#0F3D2E` | Background badge, alert sukses |
| `text.primary` | `#F0EDE6` | Teks utama |
| `text.secondary` | `#9C9A92` | Label, deskripsi, placeholder |
| `text.tertiary` | `#5F5E5A` | Disabled, hint text |
| `border.default` | `rgba(255,255,255,0.08)` | Border card dan input |
| `border.focus` | `#1D9E75` | Border saat input focus |
| `danger` | `#E24B4A` | Error, peringatan kritis |
| `warning` | `#EF9F27` | Alert, perlu perhatian |
| `success` | `#1D9E75` | Konfirmasi, selesai |

#### 3.1.2 Palet Warna — Light Mode

| Token | Hex | Penggunaan |
|---|---|---|
| `background.primary` | `#FFFFFF` | Background utama |
| `background.secondary` | `#F5F3EE` | Card, sidebar |
| `background.tertiary` | `#ECEAE4` | Input, hover |
| `accent.primary` | `#0F6E56` | CTA, active state |
| `text.primary` | `#1A1A1A` | Teks utama |
| `text.secondary` | `#5F5E5A` | Label, deskripsi |
| `border.default` | `rgba(0,0,0,0.10)` | Border |

#### 3.1.3 Tipografi

| Elemen | Font | Size | Weight |
|---|---|---|---|
| Display / Hero | Inter | 48–72px | 700 |
| H1 — Judul Halaman | Inter | 32px | 600 |
| H2 — Section Title | Inter | 24px | 600 |
| H3 — Sub-section | Inter | 18px | 500 |
| Body | Inter | 15px | 400 |
| Label / Caption | Inter | 12–13px | 400–500 |
| Kode / Monospace | JetBrains Mono | 13px | 400 |

### 3.2 Layout & Navigasi

- **Sidebar navigasi kiri:** fixed di desktop, collapsible di tablet, bottom nav di mobile.
- **Header:** logo + nama platform, tombol toggle dark/light mode, avatar user + dropdown profil.
- **Dashboard utama:** progress fase, Business Health Score, shortcuts ke tools terakhir digunakan, alert aktif.
- **Tools section:** ditampilkan dalam grid card — tool yang sudah diisi ditandai badge hijau, yang belum abu-abu.
- **Responsive:** mobile-first. Semua tools harus fully functional di layar 375px ke atas.

### 3.3 Komponen UI Utama

- **PhaseCard:** menampilkan fase, status (locked / active / completed), progress bar, dan tombol masuk.
- **ToolCard:** judul tool, deskripsi singkat, status pengisian, tombol buka. Jika sudah diisi, tampilkan nilai kunci (contoh: HPP = Rp 28.000).
- **AlertBanner:** muncul di atas dashboard jika ada alert aktif dari Advisory Engine. Dapat di-dismiss.
- **HealthScoreRing:** visualisasi radial skor 0–100 dengan warna sesuai range (merah < 40, kuning 40–70, hijau > 70).
- **BookingCalendar:** tampilan kalender inline untuk memilih slot konsultasi tersedia.

---

## 4. Spesifikasi Frontend

### 4.1 Tech Stack Frontend

| Teknologi | Versi | Peran |
|---|---|---|
| Next.js | 14+ (App Router) | Framework utama — SSR, routing, API routes |
| TypeScript | 5+ | Type safety di seluruh codebase |
| Tailwind CSS | 3+ | Utility-first styling, dark mode via class strategy |
| shadcn/ui | Latest | Komponen UI accessible & customizable |
| Zustand | 4+ | State management global (user, tema, tools data) |
| React Hook Form | 7+ | Form handling semua tools kalkulator |
| Zod | 3+ | Validasi schema form di sisi client |
| Recharts | 2+ | Visualisasi grafik cash flow, KPI, health score |
| next-themes | Latest | Dark/light mode toggle dengan localStorage sync |
| date-fns | 3+ | Manipulasi tanggal untuk booking kalender |
| Framer Motion | 11+ | Animasi transisi halaman dan komponen |

### 4.2 Struktur Folder Next.js

```
src/
  app/
    (auth)/           → login, register, callback
    (dashboard)/      → halaman utama setelah login
    (tools)/          → semua halaman tool kalkulator
    (roadmap)/        → halaman fase dan checklist
    (konsultasi)/     → booking dan riwayat konsultasi
    api/              → API routes Next.js (BFF layer)
  components/
    ui/               → komponen shadcn/ui
    layout/           → sidebar, header, footer
    tools/            → komponen per tool
    charts/           → wrapper Recharts
    shared/           → komponen reusable
  lib/
    supabase.ts       → Supabase client
    utils.ts          → helper functions
    validations/      → Zod schemas
  stores/             → Zustand stores
  types/              → TypeScript interfaces
  hooks/              → custom React hooks
```

### 4.3 Halaman & Routing

| Route | Halaman | Auth? |
|---|---|---|
| `/` | Landing page — hero, fitur, cara kerja, CTA daftar | Public |
| `/login` | Login — email/password + Google OAuth button | Public |
| `/register` | Registrasi — email, nama, password + Google OAuth | Public |
| `/onboarding` | Profiling 5 langkah — jenis bisnis, status, modal, target | Private |
| `/dashboard` | Dashboard utama — fase, health score, alert, tool shortcuts | Private |
| `/roadmap` | Halaman roadmap 4 fase — detail checklist per fase | Private |
| `/tools/hpp` | Kalkulator HPP & Harga Jual | Private |
| `/tools/break-even` | Break-Even Analysis | Private |
| `/tools/cash-flow` | Cash Flow Projector 12 Bulan | Private |
| `/tools/bmc` | Business Model Canvas Builder | Private |
| `/tools/kompetitor` | Analisis Kompetitor | Private |
| `/tools/sop` | SOP Builder — list + editor SOP | Private |
| `/tools/pricing` | Pricing Strategy Advisor | Private |
| `/tools/kpi` | KPI Dashboard & Health Score | Private |
| `/tools/legal` | Legal & Izin Checklist | Private |
| `/konsultasi` | Booking kalender + riwayat sesi | Private |
| `/konsultasi/[id]` | Detail sesi konsultasi + catatan | Private |
| `/profil` | Profil user, preferensi, edit data bisnis | Private |
| `/admin` | Admin panel — manajemen user, konsultan, jadwal | Admin |

### 4.4 Dark/Light Mode Implementation

Implementasi tema menggunakan strategi class-based dari `next-themes` dengan Tailwind CSS. Tema default adalah `dark`.

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="bisnisMulai-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// tailwind.config.ts
module.exports = {
  darkMode: 'class',
  // ...
}
```

> Toggle tema disimpan di `localStorage` (via next-themes) dan juga di-sync ke kolom `preferences` di tabel `users` di database saat user login, sehingga preferensi konsisten di semua perangkat.

---

## 5. Spesifikasi Backend

### 5.1 Arsitektur Backend

Backend menggunakan dua lapisan: API Routes Next.js sebagai BFF (Backend for Frontend) layer untuk logika ringan dan validasi, dan Supabase sebagai backend utama untuk database, autentikasi, storage, dan realtime.

```
Client (Next.js) → API Routes /api/* → Supabase SDK → PostgreSQL

Logika berat (advisory engine, health score calculation) diletakkan di:
→ Supabase Edge Functions (Deno runtime) untuk kalkulasi yang dipicu event
→ Cron jobs via pg_cron untuk monthly diagnosis generation
```

### 5.2 Autentikasi

- **Provider:** Supabase Auth (dibangun di atas GoTrue).
- **Metode:** Email/password + Google OAuth 2.0.
- **Session:** JWT token disimpan di httpOnly cookie, refresh token otomatis.
- **Row Level Security (RLS)** aktif di semua tabel — user hanya bisa akses datanya sendiri.
- **Google OAuth callback URL:** `/auth/callback` — dihandle oleh route handler Next.js.
- **Role system:** tabel `user_roles` dengan nilai `user | consultant | admin`. Middleware Next.js memproteksi route sesuai role.

### 5.3 API Endpoints

#### Auth

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/register` | Registrasi email/password baru |
| POST | `/api/auth/login` | Login email/password |
| POST | `/api/auth/logout` | Logout, clear session |
| GET | `/api/auth/callback` | Handler callback Google OAuth |
| GET | `/api/auth/session` | Cek session aktif |

#### User & Profil

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/user/profile` | Ambil profil + data bisnis user |
| PUT | `/api/user/profile` | Update profil dan preferensi |
| POST | `/api/user/onboarding` | Submit hasil profiling awal |
| GET | `/api/user/health-score` | Ambil Business Health Score terkini |

#### Roadmap & Fase

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/roadmap` | Ambil status 4 fase + checklist user |
| PUT | `/api/roadmap/phase/:id/checklist` | Update item checklist fase |
| POST | `/api/roadmap/phase/:id/complete` | Submit penyelesaian fase (trigger validasi) |

#### Tools

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/tools/:tool_slug` | Ambil data tersimpan untuk satu tool |
| POST | `/api/tools/:tool_slug` | Simpan/update data tool |
| GET | `/api/tools/:tool_slug/history` | Riwayat perubahan data tool |
| GET | `/api/tools/summary` | Ringkasan semua tool user (untuk dashboard) |

#### Advisory & Alerts

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/advisory/alerts` | Ambil semua alert aktif user |
| PUT | `/api/advisory/alerts/:id/dismiss` | Dismiss satu alert |
| GET | `/api/advisory/diagnosis` | Ambil laporan monthly diagnosis terkini |
| POST | `/api/advisory/recalculate` | Trigger recalculate health score manual |

#### Konsultasi Booking

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/konsultasi/slots` | Ambil slot tersedia dari konsultan |
| POST | `/api/konsultasi/book` | Booking slot konsultasi |
| GET | `/api/konsultasi/sessions` | Riwayat sesi konsultasi user |
| GET | `/api/konsultasi/sessions/:id` | Detail satu sesi + catatan |
| PUT | `/api/konsultasi/sessions/:id/notes` | Update catatan sesi (konsultan) |
| DELETE | `/api/konsultasi/book/:id` | Cancel booking (min. 24 jam sebelum) |

#### Admin

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/admin/users` | List semua user dengan filter & pagination |
| GET | `/api/admin/consultants` | List konsultan + jadwal mereka |
| POST | `/api/admin/consultants/slots` | Tambah slot tersedia konsultan |
| GET | `/api/admin/stats` | Statistik platform (registrasi, tool usage, dsb) |

### 5.4 Advisory Engine Logic

Advisory Engine adalah kumpulan rules yang berjalan di Supabase Edge Functions, dipanggil setiap kali user menyimpan data di tool apapun.

| Kondisi | Trigger | Aksi Sistem |
|---|---|---|
| margin < 20% | Simpan data HPP | Buat alert WARNING dengan rekomendasi naik harga atau turunkan biaya |
| Cash flow negatif bulan ke-1 s/d 3 | Simpan cash flow | Buat alert DANGER — bisnis tidak sustainable tanpa injeksi modal |
| Fase tidak diupdate > 14 hari | Cron job harian | Buat alert INFO — pengingat progress dengan link langsung ke fase aktif |
| Break-even > 12 bulan | Simpan break-even | Alert WARNING — pertimbangkan ulang model harga atau struktur biaya |
| Health score turun > 15 poin | Monthly recalculate | Alert INFO — laporan penurunan performa dengan detail metrik |
| Profiling selesai pertama kali | POST /onboarding | Generate roadmap personal + welcome diagnosis |

---

## 6. Spesifikasi Database

### 6.1 Konfigurasi

- **Database:** PostgreSQL 15 via Supabase.
- **ORM:** Supabase SDK (untuk query umum) + Prisma (untuk migration dan type generation).
- **Row Level Security (RLS):** aktif di semua tabel user-facing.
- **Backup:** otomatis via Supabase (daily, 30 hari retensi di Pro plan).

### 6.2 Skema Tabel

#### Tabel: `users`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Primary key, sinkron dengan Supabase Auth |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email user |
| `full_name` | VARCHAR(100) | NOT NULL | Nama lengkap |
| `avatar_url` | TEXT | NULLABLE | URL foto profil (dari Google atau upload) |
| `role` | ENUM | DEFAULT 'user' | `user \| consultant \| admin` |
| `theme_preference` | ENUM | DEFAULT 'dark' | `dark \| light` |
| `onboarding_completed` | BOOLEAN | DEFAULT false | Apakah profiling sudah selesai |
| `business_type` | VARCHAR(50) | NULLABLE | `produk_fisik \| digital \| jasa \| fnb` |
| `business_stage` | VARCHAR(50) | NULLABLE | `ide \| ada_produk \| sudah_berjualan` |
| `initial_capital` | BIGINT | NULLABLE | Modal awal dalam Rupiah |
| `target_monthly_revenue` | BIGINT | NULLABLE | Target omzet per bulan |
| `current_phase` | SMALLINT | DEFAULT 1 | Fase roadmap aktif: 1–4 |
| `health_score` | SMALLINT | NULLABLE | Skor 0–100, diupdate bulanan |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Waktu registrasi |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Terakhir diupdate |

#### Tabel: `phase_progress`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users.id, NOT NULL | |
| `phase_number` | SMALLINT | NOT NULL, CHECK (1–4) | Nomor fase |
| `status` | ENUM | DEFAULT 'locked' | `locked \| active \| completed` |
| `checklist_items` | JSONB | DEFAULT '[]' | Array of `{id, label, completed}` |
| `completed_at` | TIMESTAMPTZ | NULLABLE | Waktu fase diselesaikan |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | |

#### Tabel: `tool_data`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users.id, NOT NULL | |
| `tool_slug` | VARCHAR(50) | NOT NULL | `hpp \| break-even \| cash-flow \| bmc \| kompetitor \| sop \| pricing \| kpi \| legal` |
| `data` | JSONB | NOT NULL | Seluruh data tool dalam format JSON (fleksibel per tool) |
| `version` | SMALLINT | DEFAULT 1 | Versi data untuk riwayat perubahan |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | |

> **Catatan:** UNIQUE constraint pada `(user_id, tool_slug)` — satu user hanya punya satu record per tool. Riwayat perubahan disimpan di tabel `tool_data_history` yang mereplikasi setiap perubahan via trigger PostgreSQL.

#### Tabel: `tool_data_history`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | PK |
| `tool_data_id` | UUID | FK → tool_data.id |
| `user_id` | UUID | FK → users.id |
| `tool_slug` | VARCHAR(50) | Slug tool |
| `data_snapshot` | JSONB | Snapshot data sebelum perubahan |
| `changed_at` | TIMESTAMPTZ | Waktu perubahan |

#### Tabel: `advisory_alerts`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users.id, NOT NULL | |
| `type` | ENUM | NOT NULL | `info \| warning \| danger` |
| `trigger_source` | VARCHAR(50) | NOT NULL | Tool atau proses yang memicu alert |
| `title` | VARCHAR(200) | NOT NULL | Judul alert singkat |
| `message` | TEXT | NOT NULL | Pesan lengkap + rekomendasi |
| `action_url` | VARCHAR(255) | NULLABLE | Link tool terkait untuk tindak lanjut |
| `dismissed` | BOOLEAN | DEFAULT false | Apakah sudah di-dismiss user |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | |

#### Tabel: `consultants`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | PK, FK → users.id |
| `bio` | TEXT | Deskripsi profil konsultan |
| `specialization` | TEXT[] | Array spesialisasi: keuangan, operasional, marketing, dsb |
| `years_experience` | SMALLINT | Tahun pengalaman |
| `is_available` | BOOLEAN | DEFAULT true — toggle jika sedang tidak aktif |
| `created_at` | TIMESTAMPTZ | |

#### Tabel: `consultation_slots`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | PK |
| `consultant_id` | UUID | FK → consultants.id |
| `start_time` | TIMESTAMPTZ | Waktu mulai slot |
| `end_time` | TIMESTAMPTZ | Waktu selesai slot |
| `is_booked` | BOOLEAN | DEFAULT false |
| `created_at` | TIMESTAMPTZ | |

#### Tabel: `consultation_sessions`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → users.id |
| `consultant_id` | UUID | FK → consultants.id |
| `slot_id` | UUID | FK → consultation_slots.id |
| `status` | ENUM | `pending \| confirmed \| completed \| cancelled` |
| `briefing` | JSONB | Form briefing yang diisi user sebelum sesi |
| `user_snapshot` | JSONB | Snapshot health score + fase + tool summary saat booking |
| `meeting_url` | VARCHAR(255) | URL Google Meet / Zoom |
| `consultant_notes` | TEXT | Catatan post-sesi dari konsultan |
| `duration_minutes` | SMALLINT | `30 \| 60 \| 90` |
| `cancelled_at` | TIMESTAMPTZ | Waktu pembatalan jika cancelled |
| `created_at` | TIMESTAMPTZ | |

#### Tabel: `monthly_diagnoses`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | FK → users.id |
| `month_year` | DATE | Bulan laporan (selalu tanggal 1) |
| `health_score` | SMALLINT | Skor bulan ini |
| `score_delta` | SMALLINT | Perubahan dari bulan lalu (positif/negatif) |
| `on_track_items` | TEXT[] | List hal yang berjalan baik |
| `attention_items` | TEXT[] | List hal yang perlu perhatian |
| `decision_items` | TEXT[] | Keputusan yang harus dibuat bulan ini |
| `generated_at` | TIMESTAMPTZ | Waktu laporan digenerate |

---

## 7. Infrastruktur & Deployment

### 7.1 Stack Infrastruktur

| Komponen | Platform | Keterangan |
|---|---|---|
| Frontend Hosting | Vercel | Deploy otomatis dari GitHub. Preview per PR. Edge Network global. |
| Database | Supabase (PostgreSQL) | Managed PostgreSQL. RLS, Auth, Storage, Realtime terintegrasi. |
| Autentikasi | Supabase Auth | Email/password + Google OAuth. JWT management otomatis. |
| File Storage | Supabase Storage | Untuk foto profil dan export PDF dari SOP Builder. |
| Edge Functions | Supabase Edge Functions | Advisory Engine logic — Deno runtime, zero cold start. |
| Email Transaksional | Resend | Konfirmasi booking, reset password, monthly diagnosis notif. |
| Cron Jobs | pg_cron (via Supabase) | Monthly diagnosis generation, health score recalculation. |
| Monitoring | Vercel Analytics + Supabase Dashboard | Error tracking, performa, database metrics. |
| Domain | Custom domain via Vercel | bisnisMulai.id (atau domain pilihan) |

### 7.2 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@bisnisMulai.id

# App
NEXT_PUBLIC_APP_URL=https://bisnisMulai.id
NEXT_PUBLIC_APP_NAME=BisnisMulai

# Meeting (placeholder untuk integrasi masa depan)
GOOGLE_MEET_API_KEY=
ZOOM_API_KEY=
```

### 7.3 CI/CD Pipeline

1. Developer push ke branch `feature/` di GitHub.
2. GitHub Actions menjalankan: type check (`tsc`), linting (ESLint), unit test (Vitest).
3. Jika semua pass, Vercel otomatis deploy ke preview URL.
4. Pull request di-review, merge ke `main`.
5. Vercel otomatis deploy ke production domain.
6. Database migration dijalankan manual via Prisma Migrate sebelum deploy jika ada perubahan schema.

---

## 8. Keamanan

- **Row Level Security (RLS):** setiap query database difilter berdasarkan `auth.uid()` — tidak ada celah user A mengakses data user B.
- **HTTPS only:** Vercel memaksa HTTPS untuk semua koneksi. Supabase juga HTTPS.
- **JWT rotation:** refresh token dirotasi setiap 7 hari. Access token expired dalam 1 jam.
- **Rate limiting:** API routes dibatasi menggunakan Vercel Edge Middleware — max 60 request/menit per IP.
- **Input validation:** semua input user divalidasi dengan Zod di server side sebelum ke database.
- **SQL injection:** tidak mungkin terjadi karena menggunakan Supabase SDK yang parameterized queries.
- **XSS prevention:** Next.js secara default escape output. Tidak menggunakan `dangerouslySetInnerHTML`.
- **Environment variables:** service role key tidak pernah di-expose ke client. Hanya di server-side.

---

## 9. Timeline Development

### 9.1 Fase Pengembangan

| Bulan | Milestone | Deliverable Utama |
|---|---|---|
| 1–2 | Foundation | Setup project, auth (email + Google), onboarding flow, database schema, dark/light mode UI |
| 3–4 | Core Tools | HPP, Break-even, Cash Flow Projector, BMC Builder — fully functional & terhubung |
| 5–6 | Complete Tools | Analisis Kompetitor, SOP Builder, Pricing Advisor, KPI Dashboard, Legal Checklist |
| 7–8 | Roadmap & Advisory | Sistem 4 fase dengan gate validation, Advisory Engine rules, alert system, monthly diagnosis |
| 9–10 | Konsultasi | Booking system, kalender konsultan, briefing form, meeting URL generation, catatan sesi |
| 11–12 | Polish & Scale | Admin panel, performa optimization, SEO, monitoring, load testing, public launch |

### 9.2 Prioritas Fitur (MoSCoW)

#### Must Have
- Autentikasi (email + Google OAuth)
- Onboarding profiling
- Sistem roadmap 4 fase + checklist
- Kalkulator HPP, Break-even, Cash Flow
- Dark/light mode
- Dashboard dengan health score dan alert

#### Should Have
- BMC Builder, Analisis Kompetitor, Pricing Advisor
- SOP Builder dengan export PDF
- KPI Dashboard
- Advisory Engine (alert otomatis)
- Konsultasi booking system

#### Could Have
- Monthly diagnosis report otomatis
- Legal & Izin Checklist interaktif
- Riwayat perubahan data tool
- Admin panel untuk manajemen konsultan

#### Won't Have (fase ini)
- Payment gateway (Midtrans/Xendit) — akan diimplementasi di fase berikutnya saat platform sukses
- Fitur komunitas/forum
- Mobile native app (iOS/Android)
- Integrasi akuntansi (Jurnal, Accurate)

---

## 10. Persyaratan Non-Fungsional

| Kategori | Target | Cara Ukur |
|---|---|---|
| Performa | LCP < 2.5 detik, FID < 100ms | Vercel Analytics, Core Web Vitals |
| Uptime | 99.9% SLA | Supabase + Vercel SLA bawaan |
| Skalabilitas | Siap untuk 10.000 concurrent users | Vercel serverless auto-scale, Supabase connection pooling |
| Aksesibilitas | WCAG 2.1 AA | Lighthouse audit, shadcn/ui sudah accessible by default |
| SEO | Score Lighthouse > 90 | Next.js metadata API, sitemap.xml otomatis |
| Keamanan | Zero high-severity vulnerability | Dependabot alerts, regular audit |
| Responsivitas | Fully functional di 375px – 1440px | Testing di Chrome DevTools + device nyata |

---

## 11. Fitur Masa Depan

### 11.1 Payment Gateway (Prioritas Pertama Setelah Launch)

Saat platform telah terbukti sukses dan memiliki user base yang solid, implementasi payment gateway adalah langkah monetisasi pertama.

- **Provider:** Midtrans (untuk pasar Indonesia) atau Xendit sebagai alternatif.
- **Model:** Freemium → tier Builder (Rp 149.000/bulan) + Scale (Rp 499.000/bulan).
- **Fitur yang akan di-gate:** Cash Flow Projector, On-demand konsultasi berbayar, KPI Dashboard lanjutan, multi-user access.
- **Database tambahan:** tabel `subscriptions`, `invoices`, `payment_transactions`.
- Webhook handler untuk konfirmasi pembayaran dari Midtrans/Xendit.

### 11.2 Roadmap Jangka Panjang

- **Fitur komunitas:** forum diskusi per industri, berbagi BMC anonim, peer review.
- **Integrasi akuntansi:** sinkronisasi dengan Jurnal.id dan Accurate Online untuk data keuangan real-time.
- **Mobile app:** React Native dengan shared business logic dari Next.js.
- **AI Advisory:** upgrade Advisory Engine dari rule-based ke model AI yang belajar dari pola bisnis serupa.
- **Marketplace konsultan:** konsultan independen bisa bergabung dan menawarkan spesialisasi.

---

> **Catatan untuk Developer (Antigravity):** Seluruh PRD ini dirancang untuk diimplementasikan menggunakan AI-assisted development. Pastikan setiap komponen dibuat dengan TypeScript yang ketat, komentar yang jelas, dan test coverage minimal untuk logika kritis (Advisory Engine, health score calculation, auth flow). Supabase menyediakan Type Generator yang bisa di-run setelah setiap migrasi untuk menghasilkan types PostgreSQL otomatis ke TypeScript.

---

*BisnisMulai © 2025 — Dokumen PRD Internal — v1.0 — Confidential*
