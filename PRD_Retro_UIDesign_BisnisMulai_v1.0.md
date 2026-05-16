# PRD — Redesain UI/UX: Retro 90s Design System
## BisnisMulai Platform

**Dokumen:** PRD Fitur — Redesain Total UI/UX ke Retro 90s (Windows 95 Style)
**Versi:** v1.0
**Tanggal:** Mei 2025
**Status:** Ready for Design & Development
**Parent PRD:** PRD BisnisMulai v1.0

---

## Daftar Isi

1. [Visi Desain](#1-visi-desain)
2. [Design System Retro 90s](#2-design-system-retro-90s)
3. [Komponen UI Retro](#3-komponen-ui-retro)
4. [Perubahan Per Halaman](#4-perubahan-per-halaman)
5. [Dark / Light Mode Retro](#5-dark--light-mode-retro)
6. [Tipografi](#6-tipografi)
7. [Ikonografi & Ilustrasi](#7-ikonografi--ilustrasi)
8. [Animasi & Interaksi](#8-animasi--interaksi)
9. [Spesifikasi Teknis Frontend](#9-spesifikasi-teknis-frontend)
10. [Panduan Migrasi dari Desain Lama](#10-panduan-migrasi-dari-desain-lama)
11. [Checklist Implementasi](#11-checklist-implementasi)

---

## 1. Visi Desain

### 1.1 Konsep Utama

BisnisMulai akan mengadopsi estetika **Windows 95 / Retro 90s** secara penuh di seluruh platform. Ini bukan sekadar gimmick nostalgia — ini adalah keputusan brand yang disengaja untuk membuat platform ini **benar-benar diingat** di antara ratusan platform bisnis yang terlihat identik.

Inspirasi visual utama:
- **Windows 95 / 98** — window chrome, raised/sunken borders, title bars
- **Early web design (1994–1999)** — bold flat colors, dithered textures, marquee elements
- **90s productivity software** — toolbar icons, status bars, dialog boxes
- **Pixel art aesthetic** — crisp edges, aliased fonts, chunky UI elements

### 1.2 Prinsip Desain

| Prinsip | Penjelasan |
|---|---|
| **Pixel Perfect** | Semua elemen menggunakan border yang tajam (tidak ada border-radius kecuali 0 atau 2px). Tidak ada blur, shadow difuse, atau efek glassmorphism. |
| **Bold & Flat** | Warna solid tanpa gradient. Contrast tinggi. Tidak ada subtle color. |
| **Chunky UI** | Elemen UI lebih besar dan lebih tebal dari normal. Button dan input terlihat "nyata" dan bisa diklik. |
| **Fungsional Dulu** | Estetika retro tidak boleh mengorbankan keterbacaan atau usability. Semua teks harus tetap legible. |
| **Konsisten** | Satu design language di seluruh platform — tidak ada halaman yang terlihat "modern" di tengah halaman retro. |

### 1.3 Referensi Visual

```
Windows 95 elements yang diadaptasi:
├── Title bar (gradient biru → abu)
├── Raised border (3D bevel effect via box-shadow)
├── Sunken border (untuk input dan inset areas)
├── Desktop taskbar → jadi bottom navigation di mobile
├── Start button → jadi main menu button
├── Dialog boxes → jadi modal/alert
├── File icons → jadi tool icons
└── Progress bar (segmented, chunky)
```

---

## 2. Design System Retro 90s

### 2.1 Palet Warna — Light Mode (Default Retro)

> **Catatan:** Di tema retro, Light Mode adalah default (seperti Windows 95 aslinya). Dark Mode adalah "Night Mode" versi retro.

| Token | Hex | Nama Retro | Penggunaan |
|---|---|---|---|
| `color.desktop` | `#008080` | Teal Classic | Background desktop / halaman utama |
| `color.window.bg` | `#C0C0C0` | Silver | Background window / card / panel |
| `color.window.title` | `#000080` | Navy | Title bar aktif |
| `color.window.title.inactive` | `#808080` | Gray | Title bar tidak aktif |
| `color.title.text` | `#FFFFFF` | White | Teks di title bar |
| `color.button.face` | `#C0C0C0` | Silver | Background tombol normal |
| `color.button.text` | `#000000` | Black | Teks tombol |
| `color.button.shadow` | `#808080` | Dark Gray | Shadow bawah/kanan tombol (sunken) |
| `color.button.highlight` | `#FFFFFF` | White | Highlight atas/kiri tombol (raised) |
| `color.accent` | `#000080` | Navy | Aksen utama, link, active state |
| `color.accent.selected` | `#000080` | Navy | Background item terpilih |
| `color.accent.selected.text` | `#FFFFFF` | White | Teks item terpilih |
| `color.text.primary` | `#000000` | Black | Teks utama |
| `color.text.secondary` | `#444444` | Dark Gray | Teks sekunder |
| `color.text.disabled` | `#808080` | Gray | Teks disabled |
| `color.input.bg` | `#FFFFFF` | White | Background input / text area |
| `color.input.border` | `#808080` | Gray | Border input |
| `color.success` | `#008000` | Green | Status sukses |
| `color.warning` | `#808000` | Olive | Status peringatan |
| `color.danger` | `#800000` | Maroon | Status bahaya / error |
| `color.link` | `#0000EE` | Blue | Hyperlink |
| `color.link.visited` | `#551A8B` | Purple | Visited link |

### 2.2 Palet Warna — Dark Mode (Night Mode Retro)

Dark mode retro terinspirasi dari **MS-DOS**, terminal IBM, dan CRT monitor malam hari.

| Token | Hex | Nama | Penggunaan |
|---|---|---|---|
| `color.desktop` | `#000000` | Black | Background utama |
| `color.window.bg` | `#1A1A1A` | Dark Gray | Background window / card |
| `color.window.title` | `#000080` | Navy | Title bar (sama) |
| `color.button.face` | `#333333` | Charcoal | Background tombol |
| `color.button.text` | `#C0C0C0` | Silver | Teks tombol |
| `color.accent` | `#00FFFF` | Cyan | Aksen utama (neon CRT) |
| `color.accent.selected` | `#003333` | Dark Teal | Background selected |
| `color.text.primary` | `#C0C0C0` | Silver | Teks utama |
| `color.text.secondary` | `#808080` | Gray | Teks sekunder |
| `color.input.bg` | `#000000` | Black | Background input |
| `color.input.border` | `#C0C0C0` | Silver | Border input |
| `color.success` | `#00FF00` | Lime | Status sukses (neon) |
| `color.warning` | `#FFFF00` | Yellow | Status peringatan |
| `color.danger` | `#FF0000` | Red | Status error |

### 2.3 Efek 3D Bevel (Inti Visual Retro)

Efek raised/sunken border adalah ciri khas paling ikonik dari Windows 95. Semua elemen interaktif menggunakan efek ini via `box-shadow`.

```css
/* RAISED — untuk button, card, window frame */
.raised {
  box-shadow:
    inset -1px -1px 0px #808080,   /* shadow kanan-bawah dalam */
    inset 1px 1px 0px #FFFFFF,     /* highlight kiri-atas dalam */
    inset -2px -2px 0px #404040,   /* shadow kanan-bawah luar */
    inset 2px 2px 0px #DFDFDF;    /* highlight kiri-atas luar */
}

/* SUNKEN — untuk input, inset panel, pressed button */
.sunken {
  box-shadow:
    inset 1px 1px 0px #808080,     /* shadow kiri-atas dalam */
    inset -1px -1px 0px #FFFFFF,   /* highlight kanan-bawah dalam */
    inset 2px 2px 0px #404040,     /* shadow kiri-atas luar */
    inset -2px -2px 0px #DFDFDF;  /* highlight kanan-bawah luar */
}

/* BUTTON PRESSED — saat button diklik */
.pressed {
  box-shadow:
    inset 1px 1px 0px #808080,
    inset 2px 2px 0px #404040;
}

/* WINDOW FRAME — border luar window */
.window-frame {
  border: 2px solid;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  outline: 1px solid #000000;
}
```

---

## 3. Komponen UI Retro

### 3.1 Window (Komponen Utama)

Setiap card, panel, modal, dan section di-wrap dalam komponen `Window` yang menyerupai jendela Windows 95.

**Struktur:**
```
┌─[Title Bar]────────────────[_][□][✕]─┐
│ Window Title                          │
├───────────────────────────────────────┤
│ [Menu Bar jika ada]                   │
├───────────────────────────────────────┤
│                                       │
│  Window Content Area                  │
│                                       │
└───────────────────────────────────────┘
  [Status Bar jika ada]
```

**Spesifikasi Title Bar:**
- Background: gradient `#000080` → `#1084D0` (kiri ke kanan)
- Teks: putih, font monospace, bold, 13px
- Tombol kontrol kanan: `_` (minimize) `□` (maximize) `✕` (close)
- Setiap tombol adalah `raised` button 16x14px dengan karakter ASCII

**CSS Class:**
```css
.window {
  border: 2px solid;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  outline: 1px solid #000000;
  background: #C0C0C0;
}

.window-titlebar {
  background: linear-gradient(to right, #000080, #1084D0);
  color: #FFFFFF;
  font-family: 'Px437 IBM VGA8', monospace;
  font-size: 13px;
  font-weight: bold;
  padding: 3px 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.window-titlebar-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  image-rendering: pixelated;
}

.window-controls button {
  width: 16px;
  height: 14px;
  font-size: 9px;
  margin-left: 2px;
  /* raised effect */
}
```

---

### 3.2 Button

Tiga varian button:

**Primary Button (Default)**
```css
.btn-retro {
  background: #C0C0C0;
  color: #000000;
  border: none;
  padding: 4px 16px;
  font-family: 'Px437 IBM VGA8', monospace;
  font-size: 13px;
  cursor: pointer;
  min-width: 75px;
  /* raised effect */
  box-shadow:
    inset -1px -1px 0 #808080,
    inset 1px 1px 0 #FFFFFF,
    inset -2px -2px 0 #404040,
    inset 2px 2px 0 #DFDFDF;
}

.btn-retro:active {
  /* pressed effect */
  box-shadow:
    inset 1px 1px 0 #808080,
    inset 2px 2px 0 #404040;
  padding: 5px 15px 3px 17px; /* slight offset saat ditekan */
}

.btn-retro:focus {
  outline: 1px dotted #000000;
  outline-offset: -4px;
}
```

**Default/Accent Button** — border ekstra untuk tombol default dialog:
```css
.btn-retro-default {
  /* sama dengan btn-retro tapi dengan border hitam ekstra 1px */
  outline: 1px solid #000000;
}
```

**Danger Button:**
```css
.btn-retro-danger {
  /* sama tapi text color #800000 */
}
```

---

### 3.3 Input & Form Elements

```css
/* Text Input */
.input-retro {
  background: #FFFFFF;
  color: #000000;
  border: none;
  padding: 3px 4px;
  font-family: 'Px437 IBM VGA8', monospace;
  font-size: 13px;
  width: 100%;
  /* sunken effect */
  box-shadow:
    inset 1px 1px 0 #808080,
    inset -1px -1px 0 #FFFFFF,
    inset 2px 2px 0 #404040,
    inset -2px -2px 0 #DFDFDF;
}

.input-retro:focus {
  outline: none;
  /* border berubah warna saat focus */
  box-shadow:
    inset 1px 1px 0 #000080,
    inset -1px -1px 0 #FFFFFF,
    inset 2px 2px 0 #000060,
    inset -2px -2px 0 #DFDFDF;
}

/* Label */
.label-retro {
  font-family: 'Px437 IBM VGA8', monospace;
  font-size: 13px;
  color: #000000;
  margin-bottom: 2px;
  display: block;
}

/* Checkbox */
.checkbox-retro {
  appearance: none;
  width: 13px;
  height: 13px;
  background: #FFFFFF;
  border: none;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #404040;
  cursor: pointer;
  position: relative;
}

.checkbox-retro:checked::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 1px;
  font-size: 11px;
  color: #000000;
}

/* Select / Dropdown */
.select-retro {
  background: #FFFFFF;
  border: none;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #404040;
  font-family: 'Px437 IBM VGA8', monospace;
  font-size: 13px;
  padding: 3px 20px 3px 4px;
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* dropdown arrow pixel art */
}
```

---

### 3.4 Progress Bar

```
┌────────────────────────────────┐
│██████████████░░░░░░░░░░░░░░░░░│  48%
└────────────────────────────────┘
```

```css
.progress-retro {
  /* sunken container */
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #404040;
  background: #C0C0C0;
  height: 20px;
  padding: 2px;
}

.progress-retro-fill {
  background: #000080; /* navy untuk light mode */
  height: 100%;
  /* Tidak ada transition smooth — langsung jump sesuai nilai */
  /* Efek segmented dengan repeating gradient */
  background: repeating-linear-gradient(
    to right,
    #000080 0px, #000080 8px,
    #1084D0 8px, #1084D0 9px
  );
}
```

---

### 3.5 Modal / Dialog Box

```
     ┌─[Dialog Title]────────────[✕]─┐
     │ ⚠                             │
     │  Pesan dialog box di sini.    │
     │  Bisa multi-baris.            │
     │                               │
     │           [OK]   [Cancel]     │
     └───────────────────────────────┘
```

- Selalu center screen
- Background overlay: `rgba(0,0,0,0.0)` — **tidak ada overlay gelap** (persis seperti Windows 95)
- Window di belakang hanya greyed-out title bar-nya
- Tombol OK dan Cancel menggunakan btn-retro
- Ada icon di kiri: ⚠ untuk warning, ℹ untuk info, ✕ untuk error, ? untuk konfirmasi

---

### 3.6 Tab Component

```
[Tab 1 ▼][Tab 2   ][Tab 3   ]
┌───────────────────────────┐
│                           │
│  Tab Content Area         │
│                           │
└───────────────────────────┘
```

```css
.tab-retro {
  border-bottom: none;
  padding: 4px 12px;
  background: #C0C0C0;
  font-family: 'Px437 IBM VGA8', monospace;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  top: 1px; /* active tab naik 1px */
}

.tab-retro.active {
  background: #C0C0C0;
  z-index: 1;
  box-shadow: -1px 0 0 #FFFFFF, 0 -1px 0 #FFFFFF, 1px 0 0 #808080;
}

.tab-retro:not(.active) {
  background: #B0B0B0;
  top: 2px;
}
```

---

### 3.7 Sidebar / Taskbar

Sidebar kiri diubah menjadi **Explorer-style panel** seperti Windows Explorer 95:

```
┌─[BisnisMulai Explorer]────[_][□][✕]─┐
├──────────────────────────────────────┤
│ File  Edit  View  Tools  Help        │
├──────────────────────────────────────┤
│ [←][→][↑] Address: /dashboard       │
├────────────┬─────────────────────────┤
│ 📁 Dashboard│                        │
│ 📁 Roadmap │                        │
│  📄 Fase 01│   Main Content Area    │
│  📄 Fase 02│                        │
│  📄 ...    │                        │
│ 📁 Tools   │                        │
│  📄 HPP    │                        │
│  📄 ...    │                        │
│ 📁 Konsult │                        │
│ 📁 Profil  │                        │
├────────────┴─────────────────────────┤
│ 5 objects selected    [≡] status bar │
└──────────────────────────────────────┘
```

---

### 3.8 Notification / Alert

Diimplementasikan sebagai **System Tray notification** di pojok kanan bawah:

```
                    ┌────────────────────────┐
                    │ ℹ BisnisMulai          │
                    │ Fase 02 siap dibuka!   │
                    │ [Buka] [Tutup]         │
                    └────────────────────────┘
▌Start▐ [≡][♪][🕐]  11:45 AM
```

---

### 3.9 Tooltip

```css
.tooltip-retro {
  background: #FFFFE1; /* yellow tooltip klasik */
  border: 1px solid #000000;
  font-family: 'Px437 IBM VGA8', monospace;
  font-size: 11px;
  color: #000000;
  padding: 2px 4px;
  /* Tidak ada border-radius */
  /* Tidak ada shadow */
}
```

---

### 3.10 Scrollbar

Custom scrollbar yang menyerupai Windows 95:

```css
::-webkit-scrollbar { width: 17px; }
::-webkit-scrollbar-track {
  background: #C0C0C0;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #FFFFFF;
}
::-webkit-scrollbar-thumb {
  background: #C0C0C0;
  box-shadow: inset -1px -1px 0 #808080, inset 1px 1px 0 #FFFFFF,
              inset -2px -2px 0 #404040, inset 2px 2px 0 #DFDFDF;
}
::-webkit-scrollbar-button {
  background: #C0C0C0;
  height: 17px;
  /* raised effect + arrow karakter */
  box-shadow: inset -1px -1px 0 #808080, inset 1px 1px 0 #FFFFFF,
              inset -2px -2px 0 #404040, inset 2px 2px 0 #DFDFDF;
}
```

---

## 4. Perubahan Per Halaman

### 4.1 Landing Page (`/`)

**Sebelum:** Hero section clean modern dengan gradient
**Sesudah:** Tampilan seperti desktop Windows 95 yang baru di-boot

Elemen baru:
- Background: wallpaper teal (#008080) dengan pola subtle noise/dither
- Di tengah: window utama "Selamat datang di BisnisMulai" dengan icon komputer 32x32px
- Di bawah window: beberapa icon desktop (shortcut) — Roadmap, Tools, Konsultasi
- Taskbar di bawah: tombol "Start", clock, dan system tray
- "Start" button mengekspansi ke menu navigasi utama
- CTA button: tombol raised dengan teks "Mulai Sekarang >" (ASCII arrow)

---

### 4.2 Halaman Login & Register (`/login`, `/register`)

**Sesudah:** Dialog box Windows 95 style di tengah desktop teal

```
     ┌─[🔐 BisnisMulai — Login]──[✕]─┐
     │                                │
     │  Username:                     │
     │  [____________________________]│
     │                                │
     │  Password:                     │
     │  [****************************]│
     │                                │
     │  [✓] Ingat saya                │
     │                                │
     │  [   OK   ]  [ Batal ]         │
     │                                │
     │  ─────────────────────         │
     │  [G] Login dengan Google       │
     │                                │
     │  Belum punya akun? Daftar »    │
     └────────────────────────────────┘
```

---

### 4.3 Onboarding (`/onboarding`)

**Sesudah:** Wizard dialog box multi-step seperti "Setup Wizard" Windows 95

```
┌─[🧙 BisnisMulai Setup Wizard]────[✕]─┐
│ ┌──────────────────────────────────┐  │
│ │  [Gambar wizard pixel art]       │  │
│ │  Selamat datang di BisnisMulai!  │  │
│ └──────────────────────────────────┘  │
│                                       │
│  Langkah 1 dari 5: Jenis Bisnis       │
│                                       │
│  (●) Produk Fisik                     │
│  ( ) Produk Digital                   │
│  ( ) Jasa                             │
│  ( ) F&B                              │
│                                       │
├───────────────────────────────────────┤
│  [< Back]  [Next >]  [Cancel]         │
└───────────────────────────────────────┘
```

Progress ditampilkan sebagai progress bar segmented di bagian bawah wizard.

---

### 4.4 Dashboard (`/dashboard`)

**Sesudah:** Tampilan Windows Explorer / My Computer dengan icon-icon

Layout:
- Title bar: "📊 Dashboard — BisnisMulai Explorer"
- Menu bar: File | Tampilan | Tools | Bantuan
- Toolbar: icon pixel art untuk navigasi
- Area konten: grid icon besar (seperti "My Computer")

Icon yang ditampilkan:
```
[📊 Health Score]  [🗺️ Roadmap]    [💰 Kalkulator]
   72 / 100          Fase 2/6         9 Tools

[⚠️ Alert]         [📅 Konsultasi]  [📋 Profil Saya]
  2 pesan baru       Booking          Edit data
```

Status bar di bawah: "6 items | Fase aktif: Validasi Ide | Terakhir update: hari ini"

---

### 4.5 Roadmap (`/roadmap`, `/roadmap/fase/[id]`)

**Sesudah:** File explorer tree di kiri + content panel di kanan

Kiri (tree view):
```
📁 Roadmap Bisnis
  ✅ 📄 01 Mental Reset
  ▶️ 📄 02 Validasi Ide  ← aktif
  🔒 📄 03 Bangun Fondasi
  🔒 📄 04 Launch Pertama
  🔒 📄 05 Stabilisasi
  🔒 📄 06 Skala
```

Kanan (detail panel):
- Title bar per fase
- Konten fase dalam window raised
- Checklist menggunakan checkbox retro
- "Fatal Trap" ditampilkan sebagai **Error dialog** dengan icon ⚠️
- Perspektif konsultan ditampilkan sebagai **speech bubble pixel art**

---

### 4.6 Tools (`/tools/*`)

**Sesudah:** Setiap tool adalah sebuah **window application** terpisah yang bisa di-minimize/maximize

Tampilan halaman `/tools`:
- Grid icon seperti "Programs" di Start Menu
- Setiap tool punya icon pixel art 32x32px yang unik
- Klik icon → "membuka aplikasi" dengan animasi window appear

Di dalam tool (misal `/tools/hpp`):
```
┌─[💰 Kalkulator HPP — BisnisMulai]────[_][□][✕]─┐
│ File  Edit  Hitung  Bantuan                      │
├──────────────────────────────────────────────────┤
│ Biaya Bahan Baku:    [_________________] Rp      │
│ Biaya Tenaga Kerja:  [_________________] Rp      │
│ Biaya Overhead:      [_________________] Rp      │
│ Target Margin:       [______] %                  │
├──────────────────────────────────────────────────┤
│ [ Hitung HPP ]                                   │
├──────────────────────────────────────────────────┤
│ ┌─ Hasil ─────────────────────────────────────┐  │
│ │ HPP per unit:      Rp 28.000                │  │
│ │ Harga jual min:    Rp 46.667                │  │
│ │ Profit per unit:   Rp 18.667                │  │
│ └─────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│ Ready                                   NUM CAPS │
└──────────────────────────────────────────────────┘
```

---

### 4.7 Chatbot BizBot

**Sesudah:** Floating window seperti aplikasi chat Windows Messenger era 2000

```
┌─[💬 BizBot — Asisten Bisnis]──[_][□][✕]─┐
│ File  Tampilan  Bantuan                   │
├───────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐  │
│ │ [BizBot] Halo! Ada yang bisa       │  │
│ │          saya bantu?               │  │
│ │                                    │  │
│ │                  [Kamu] Halo!  ▐   │  │
│ │                                    │  │
│ └─────────────────────────────────────┘  │
├───────────────────────────────────────────┤
│ [________________________________] [Kirim]│
└───────────────────────────────────────────┘
```

---

### 4.8 Konsultasi Booking (`/konsultasi`)

**Sesudah:** Dialog "Schedule Meeting" seperti calendar app Windows

- Calendar ditampilkan sebagai grid dengan border raised
- Slot tersedia: background navy dengan teks putih
- Slot tidak tersedia: greyed out (disabled state)
- Tombol booking: dialog konfirmasi Windows 95 style

---

### 4.9 Profil (`/profil`)

**Sesudah:** "System Properties" dialog Windows 95

Tab-tab:
```
[Umum][Bisnis][Preferensi][Keamanan]
```

Setiap tab seperti tab Properties dialog asli Windows.

---

### 4.10 Admin Panel (`/admin`)

**Sesudah:** Tampilan seperti "Computer Management" / "Device Manager" Windows

- Tree view di kiri: Users, Consultants, Analytics, Settings
- Data table di kanan dengan grid bergaris seperti spreadsheet klasik
- Toolbar dengan icon pixel art untuk aksi (Add, Delete, Edit, Refresh)

---

## 5. Dark / Light Mode Retro

### 5.1 Toggle Mechanism

Toggle tema menggunakan ikon **🌙 / ☀️** di taskbar (bukan di header).

Di light mode: tampilan Windows 95 silver klasik.
Di dark mode: tampilan MS-DOS / CRT terminal dengan teks cyan/hijau di atas hitam.

### 5.2 Penyimpanan

Sama seperti PRD utama — disimpan di `localStorage` dan di-sync ke database kolom `theme_preference` di tabel `users`.

### 5.3 Perbedaan Visual Dark Mode

Di dark mode, efek bevel tidak menggunakan putih tapi menggunakan `#404040` untuk highlight dan `#000000` untuk shadow — menciptakan efek emboss yang lebih subtle dan lebih terasa seperti CRT monitor.

---

## 6. Tipografi

### 6.1 Font Utama — Pixel / Monospace

| Peran | Font | Fallback | Ukuran |
|---|---|---|---|
| UI Primary | `Px437 IBM VGA8` | `fixedsys`, monospace | 13px (tidak boleh di-scale) |
| UI Secondary | `MS Sans Serif` | `Tahoma`, sans-serif | 11–13px |
| Kode / Terminal | `Perfect DOS VGA 437` | `Courier New`, monospace | 13px |
| Judul Besar (landing) | `VT323` (Google Fonts) | monospace | 24–48px |
| Body teks panjang | `MS Sans Serif` | `Tahoma` | 13px, line-height 1.6 |

### 6.2 Aturan Tipografi Retro

- **Tidak ada font smoothing (anti-aliasing) di ukuran kecil.** Gunakan `font-smooth: never` dan `text-rendering: optimizeSpeed` untuk ukuran < 16px.
- **Tidak ada italic** untuk elemen UI (hanya untuk teks konten panjang jika perlu).
- **Tidak ada font weight selain normal dan bold** (tidak ada light, medium, semibold).
- **Ukuran teks:** 11px, 12px, 13px, 16px, 24px, 32px, 48px — hanya kelipatan pixel yang bersih.
- **Line height:** 1.0 untuk elemen UI, 1.6 untuk teks konten.

### 6.3 Loading Font

```css
@font-face {
  font-family: 'Px437 IBM VGA8';
  src: url('/fonts/Px437_IBM_VGA8.woff2') format('woff2');
  font-display: swap;
}

@font-face {
  font-family: 'Perfect DOS VGA 437';
  src: url('/fonts/PerfectDOSVGA437.woff2') format('woff2');
  font-display: swap;
}
```

Font file disimpan di `/public/fonts/`. Tambahkan ke Vercel static assets.

---

## 7. Ikonografi & Ilustrasi

### 7.1 Icon Style

Semua icon adalah **pixel art 32x32px atau 16x16px**, style Windows 95 era. Tidak ada SVG smooth icons dari library modern (lucide-react, heroicons) — semua diganti.

### 7.2 Icon Per Fitur

| Fitur | Icon 32x32 | Deskripsi Visual |
|---|---|---|
| Dashboard | 📊 | Bar chart pixel art, warna biru navy |
| Roadmap | 🗺️ | Peta dengan jalur, pixel art |
| HPP Calculator | 💰 | Koin emas pixel art |
| Break-Even | ⚖️ | Timbangan klasik pixel art |
| Cash Flow | 📈 | Grafik naik pixel art |
| BMC Builder | 🗂️ | Canvas terbuka pixel art |
| Kompetitor | 🔍 | Kaca pembesar pixel art |
| SOP Builder | 📋 | Clipboard dengan checklist |
| Pricing | 🎯 | Target/dart board pixel art |
| KPI Dashboard | 📉 | Speedometer pixel art |
| Legal | ⚖️ | Palu hakim pixel art |
| Konsultasi | 📞 | Telepon klasik pixel art |
| Profil | 👤 | Siluet pengguna pixel art |
| BizBot | 🤖 | Robot kecil pixel art, khas 90s |
| Alert/Warning | ⚠️ | Segitiga kuning dengan ! |
| Success | ✅ | Centang dalam kotak hijau |
| Error | ❌ | X dalam kotak merah |
| Info | ℹ️ | i dalam kotak biru |
| Locked | 🔒 | Gembok pixel art |

### 7.3 Sumber Icon

Gunakan icon pack dari:
- **Windows 95 Icon Library** (public domain) — untuk icon sistem
- **Custom pixel art** dibuat dengan [Piskel](https://www.piskelapp.com) atau [Aseprite](https://www.aseprite.org) untuk icon fitur unik BisnisMulai
- Format: `.png` dengan `image-rendering: pixelated` di CSS

### 7.4 Ilustrasi

- **Wizard mascot** di onboarding: karakter pixel art pria/wanita berpakaian bisnis, gaya 90s clip art
- **Desktop wallpaper** landing: teal solid (#008080) atau pattern kotak-kotak subtle
- **Error page**: ilustrasi "Blue Screen of Death" versi BisnisMulai dengan pesan humor

```
A fatal exception 0E has occurred at BisnisMulai.
Halaman yang kamu cari tidak ditemukan.

* Tekan ENTER untuk kembali ke Dashboard
* Tekan ESC untuk kembali ke halaman sebelumnya

[ ENTER ]  [ ESC ]
```

---

## 8. Animasi & Interaksi

### 8.1 Prinsip Animasi Retro

- **Tidak ada smooth easing** — gunakan `linear` atau `steps()` untuk animasi
- **Tidak ada fade yang lama** — transisi maksimal 100ms
- **Cursor blink**: input cursor berkedip menggunakan animasi step
- **Window appear**: window "pop in" tanpa animasi (langsung muncul) atau dengan animasi 1-2 frame

### 8.2 Animasi yang Diizinkan

```css
/* Cursor blink di input */
@keyframes cursor-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* Progress bar fill — step animation, bukan smooth */
@keyframes progress-fill {
  from { width: 0%; }
  to { width: var(--target-width); }
}
.progress-fill {
  animation: progress-fill 0.3s steps(10) forwards;
}

/* Loading indicator — rotating pixel art */
@keyframes loading-spin {
  0% { content: '|'; }
  25% { content: '/'; }
  50% { content: '—'; }
  75% { content: '\\'; }
}

/* Window minimize — scale ke taskbar, 2 frame */
.window-minimize {
  animation: minimize 0.1s steps(2) forwards;
}
@keyframes minimize {
  from { transform: scale(1); }
  to { transform: scale(0); transform-origin: bottom left; }
}
```

### 8.3 Sound Effects (Opsional)

Jika diaktifkan oleh user (default OFF), tambahkan sound effect pixel:
- Click tombol: suara klik mechanical keyboard pendek
- Window open: suara "whoosh" 90s Windows
- Alert/error: beep klasik
- Notifikasi: ding Microsoft

Simpan sebagai `.wav` kecil di `/public/sounds/`. Toggle di Preferensi.

### 8.4 Cursor

```css
/* Default cursor — arrow pixel art */
* { cursor: url('/cursors/arrow.cur'), auto; }

/* Pointer untuk tombol */
button, a { cursor: url('/cursors/hand.cur'), pointer; }

/* Text cursor */
input, textarea { cursor: url('/cursors/beam.cur'), text; }

/* Loading */
.loading { cursor: url('/cursors/hourglass.cur'), wait; }
```

---

## 9. Spesifikasi Teknis Frontend

### 9.1 Pendekatan Implementasi

Buat **design system retro** sebagai layer di atas Tailwind CSS yang sudah ada. Jangan hapus Tailwind — tambahkan custom CSS variables dan utility classes retro di atasnya.

### 9.2 File yang Dibuat / Diubah

```
src/
  styles/
    retro.css               ← Design system retro (bevel, colors, typography)
    retro-components.css    ← Styling per komponen (window, button, input, dll)
    retro-dark.css          ← Override untuk dark mode retro
  components/
    retro/
      Window.tsx            ← Komponen window utama (bisa dipakai di mana saja)
      TitleBar.tsx          ← Title bar dengan icon dan window controls
      MenuBar.tsx           ← Menu bar (File, Edit, dll)
      Toolbar.tsx           ← Toolbar dengan pixel icon buttons
      StatusBar.tsx         ← Status bar di bawah window
      RetroButton.tsx       ← Button dengan bevel effect
      RetroInput.tsx        ← Input dengan sunken effect
      RetroCheckbox.tsx     ← Checkbox pixel art
      RetroSelect.tsx       ← Dropdown dengan arrow pixel
      RetroProgress.tsx     ← Progress bar segmented
      RetroTabs.tsx         ← Tab component Windows 95 style
      RetroModal.tsx        ← Dialog box / modal
      RetroTooltip.tsx      ← Tooltip kuning klasik
      RetroAlert.tsx        ← Alert dengan icon sistem
      Taskbar.tsx           ← Taskbar di bawah (mobile: bottom nav)
      StartMenu.tsx         ← Start menu expandable
      DesktopIcon.tsx       ← Icon di desktop/dashboard
      TreeView.tsx          ← File explorer tree navigation
      FileExplorer.tsx      ← Full explorer layout (sidebar + content)
  public/
    fonts/
      Px437_IBM_VGA8.woff2
      PerfectDOSVGA437.woff2
    icons/
      *.png                 ← Pixel art icons 16x16 dan 32x32
    cursors/
      arrow.cur
      hand.cur
      beam.cur
      hourglass.cur
    sounds/ (opsional)
      click.wav
      open.wav
      error.wav
```

### 9.3 Tailwind Config Update

```typescript
// tailwind.config.ts — tambahkan custom values
module.exports = {
  theme: {
    extend: {
      colors: {
        retro: {
          silver: '#C0C0C0',
          navy: '#000080',
          teal: '#008080',
          white: '#FFFFFF',
          black: '#000000',
          gray: '#808080',
          'dark-gray': '#404040',
          maroon: '#800000',
          olive: '#808000',
          green: '#008000',
        }
      },
      fontFamily: {
        retro: ['Px437 IBM VGA8', 'fixedsys', 'monospace'],
        'retro-ui': ['MS Sans Serif', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        'retro-sm': ['11px', '1.0'],
        'retro-base': ['13px', '1.0'],
        'retro-lg': ['16px', '1.0'],
        'retro-xl': ['24px', '1.0'],
        'retro-2xl': ['32px', '1.0'],
        'retro-hero': ['48px', '1.0'],
      },
      borderRadius: {
        'retro': '0px',        /* tidak ada border radius */
        'retro-sm': '2px',     /* maksimal 2px */
      },
      boxShadow: {
        'raised': 'inset -1px -1px 0 #808080, inset 1px 1px 0 #FFFFFF, inset -2px -2px 0 #404040, inset 2px 2px 0 #DFDFDF',
        'sunken': 'inset 1px 1px 0 #808080, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #404040, inset -2px -2px 0 #DFDFDF',
        'pressed': 'inset 1px 1px 0 #808080, inset 2px 2px 0 #404040',
        'window': '2px 2px 0 #000000',
      },
    }
  }
}
```

### 9.4 next-themes Integration

```typescript
// app/layout.tsx — update ThemeProvider
<ThemeProvider
  attribute="class"
  defaultTheme="retro-light"    // default: Windows 95 light
  themes={['retro-light', 'retro-dark']}
  enableSystem={false}
  storageKey="bisnisMulai-theme"
>
```

```css
/* globals.css */
.retro-light {
  --color-desktop: #008080;
  --color-window-bg: #C0C0C0;
  /* ... semua token light mode */
}

.retro-dark {
  --color-desktop: #000000;
  --color-window-bg: #1A1A1A;
  /* ... semua token dark mode */
}
```

---

## 10. Panduan Migrasi dari Desain Lama

### 10.1 Komponen yang Diganti

| Komponen Lama | Komponen Retro Baru |
|---|---|
| `<Card>` (shadcn) | `<Window>` |
| `<Button>` (shadcn) | `<RetroButton>` |
| `<Input>` (shadcn) | `<RetroInput>` |
| `<Checkbox>` (shadcn) | `<RetroCheckbox>` |
| `<Select>` (shadcn) | `<RetroSelect>` |
| `<Dialog>` (shadcn) | `<RetroModal>` |
| `<Tabs>` (shadcn) | `<RetroTabs>` |
| `<Progress>` (shadcn) | `<RetroProgress>` |
| `<Alert>` (shadcn) | `<RetroAlert>` |
| `<Tooltip>` (shadcn) | `<RetroTooltip>` |
| Sidebar navigasi | `<FileExplorer>` + `<TreeView>` |
| Bottom nav mobile | `<Taskbar>` |
| Floating chatbot | `<Window>` draggable |

### 10.2 Urutan Migrasi yang Disarankan

Migrasi dilakukan per lapisan, dari bawah ke atas:

1. **Setup design system** — install font, buat CSS variables, buat utility classes
2. **Buat komponen retro** — Window, Button, Input, dll (tanpa ubah halaman dulu)
3. **Migrasi komponen layout** — Sidebar, Taskbar, Header
4. **Migrasi halaman satu per satu**, urutan: Landing → Login → Onboarding → Dashboard → Tools → Roadmap → Chatbot → Konsultasi → Profil → Admin
5. **QA & testing** tiap halaman sebelum lanjut ke halaman berikutnya

### 10.3 Yang Tidak Perlu Diubah

- Logika API dan backend — tidak ada perubahan
- Database schema — tidak ada perubahan
- Auth flow — tidak ada perubahan
- Zustand stores — tidak ada perubahan
- React Hook Form dan Zod validations — tidak ada perubahan

---

## 11. Checklist Implementasi

### Setup
- [ ] Font retro sudah didownload dan diletakkan di `/public/fonts/`
- [ ] CSS variables design system retro sudah dibuat di `globals.css`
- [ ] Tailwind config sudah diupdate dengan values retro
- [ ] Custom scrollbar CSS sudah ditambahkan
- [ ] Cursor files sudah diletakkan di `/public/cursors/`

### Komponen Retro
- [ ] `Window.tsx` dengan title bar, controls, dan bevel effect
- [ ] `RetroButton.tsx` dengan raised/pressed state
- [ ] `RetroInput.tsx` dengan sunken effect
- [ ] `RetroCheckbox.tsx` dengan pixel check mark
- [ ] `RetroSelect.tsx` dengan dropdown arrow
- [ ] `RetroProgress.tsx` segmented
- [ ] `RetroTabs.tsx`
- [ ] `RetroModal.tsx` tanpa overlay gelap
- [ ] `RetroTooltip.tsx` kuning klasik
- [ ] `RetroAlert.tsx` dengan icon sistem
- [ ] `Taskbar.tsx`
- [ ] `StartMenu.tsx`
- [ ] `TreeView.tsx`
- [ ] `FileExplorer.tsx`

### Halaman
- [ ] Landing page: desktop + window + icons + taskbar
- [ ] Login / Register: dialog box style
- [ ] Onboarding: wizard style dengan progress bar
- [ ] Dashboard: My Computer / explorer style
- [ ] Roadmap: file explorer dengan tree view
- [ ] Semua halaman tools: window application style
- [ ] Chatbot: floating window draggable
- [ ] Konsultasi: calendar dialog style
- [ ] Profil: System Properties style
- [ ] Admin panel: Computer Management style
- [ ] Error 404: Blue Screen of Death style

### Dark Mode
- [ ] Dark mode CSS variables lengkap
- [ ] Semua komponen berfungsi benar di dark mode
- [ ] Toggle tema di taskbar berfungsi

### QA
- [ ] Semua komponen berfungsi di Chrome, Firefox, Safari
- [ ] Responsive di mobile 375px (taskbar sebagai bottom nav)
- [ ] Tidak ada element yang tidak terbaca karena contrast rendah
- [ ] Pixel art icons tidak blur di semua ukuran layar
- [ ] Animasi tidak mengganggu performa (target 60fps)

---

> **Catatan untuk Developer (Antigravity):** Estetika retro ini sengaja tidak menggunakan border-radius, shadow difuse, atau gradient modern. Konsistensi adalah kuncinya — satu elemen yang terlihat modern di tengah halaman retro akan merusak seluruh pengalaman. Jika ragu antara retro vs modern untuk satu elemen, selalu pilih retro.

---

*PRD UI/UX Redesain Retro 90s — BisnisMulai v1.0 | Dokumen Internal | Mei 2025*
