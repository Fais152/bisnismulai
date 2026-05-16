# PRD — Fitur Roadmap Bisnis
## BisnisMulai Platform

**Dokumen:** PRD Fitur — Roadmap Bisnis 6 Fase
**Versi:** v1.0
**Tanggal:** Mei 2025
**Status:** Ready for Development
**Parent PRD:** PRD BisnisMulai v1.0

---

## Daftar Isi

1. [Ringkasan Fitur](#1-ringkasan-fitur)
2. [Tujuan & Metrik Keberhasilan](#2-tujuan--metrik-keberhasilan)
3. [Spesifikasi 6 Fase Roadmap](#3-spesifikasi-6-fase-roadmap)
4. [Sistem Gate & Progression](#4-sistem-gate--progression)
5. [Spesifikasi Frontend](#5-spesifikasi-frontend)
6. [Spesifikasi Backend & API](#6-spesifikasi-backend--api)
7. [Skema Database](#7-skema-database)
8. [Notifikasi & Advisory Integration](#8-notifikasi--advisory-integration)
9. [Edge Cases & Error Handling](#9-edge-cases--error-handling)
10. [Checklist Implementasi](#10-checklist-implementasi)

---

## 1. Ringkasan Fitur

### 1.1 Deskripsi

Fitur Roadmap adalah **inti navigasi platform BisnisMulai**. Ini adalah sistem panduan bertahap yang membimbing pengguna melalui 6 fase perjalanan membangun bisnis — dari persiapan mental hingga siap skala. Setiap fase memiliki konten edukatif, task yang harus diselesaikan, checklist gate, dan perspektif konsultan.

Roadmap ini bukan sekadar daftar langkah. Ia adalah sistem progresif yang **tidak bisa dilewati** — pengguna harus menyelesaikan checklist minimum setiap fase sebelum fase berikutnya terbuka. Ini adalah keputusan desain yang disengaja berdasarkan pengalaman lapangan: bisnis yang skip fase validasi dan fondasi rata-rata gagal di bulan ke-4 hingga ke-8.

### 1.2 Konteks dalam Platform

```
Dashboard Utama
  └── Roadmap (fitur ini)
        ├── Fase 01 — Mental Reset
        ├── Fase 02 — Validasi Ide
        ├── Fase 03 — Bangun Fondasi
        ├── Fase 04 — Launch Pertama
        ├── Fase 05 — Stabilisasi
        └── Fase 06 — Skala
```

Roadmap terintegrasi langsung dengan:
- **Tools Platform** — setiap fase merekomendasikan tools spesifik yang relevan
- **Advisory Engine** — progress roadmap mempengaruhi Business Health Score
- **Chatbot BizBot** — konteks fase aktif dikirim ke chatbot untuk saran yang personal
- **Konsultasi Booking** — fase tertentu memunculkan rekomendasi booking konsultan

---

## 2. Tujuan & Metrik Keberhasilan

### 2.1 Tujuan Bisnis

- Meningkatkan retention pengguna dengan memberikan alasan jelas untuk kembali ke platform setiap hari
- Menjadi diferensiator utama BisnisMulai dari kompetitor (tidak ada platform serupa dengan sistem fase terstruktur)
- Menghasilkan data progres pengguna yang digunakan Advisory Engine untuk rekomendasi personal

### 2.2 Metrik Keberhasilan (KPI)

| Metrik | Target 3 Bulan | Target 6 Bulan |
|---|---|---|
| % user yang menyelesaikan minimal Fase 01 | > 80% | > 90% |
| % user yang mencapai Fase 03 | > 40% | > 55% |
| % user yang mencapai Fase 06 | > 10% | > 20% |
| Rata-rata waktu kembali ke platform | < 3 hari | < 2 hari |
| Checklist completion rate per fase | > 60% | > 75% |

---

## 3. Spesifikasi 6 Fase Roadmap

### Ringkasan Fase

| Fase | Nama | Durasi Estimasi | Status Default |
|---|---|---|---|
| 01 | Mental Reset | Minggu 1–2 | Active (terbuka saat registrasi) |
| 02 | Validasi Ide | Minggu 2–6 | Locked |
| 03 | Bangun Fondasi | Bulan 2–3 | Locked |
| 04 | Launch Pertama | Bulan 3–5 | Locked |
| 05 | Stabilisasi | Bulan 5–9 | Locked |
| 06 | Skala | Bulan 9+ | Locked |

---

### Fase 01 — Mental Reset

**Tagline:** *Bongkar mindset sebelum mulai*

**Deskripsi:** Mayoritas pemula gagal bukan karena ide yang buruk — tapi karena mental yang salah sejak awal. Fase ini memastikan pengguna memiliki fondasi psikologis dan pemahaman dasar yang benar sebelum investasi waktu dan uang.

#### Tasks (4 task)

| # | Judul | Deskripsi Detail |
|---|---|---|
| 1 | Definisikan 'mengapa' | Bukan sekadar ingin untung. Motivasi yang dangkal tidak bertahan saat bisnis sulit. User diminta menulis motivasi utama mereka dalam 3–5 kalimat. |
| 2 | Toleransi risiko | Jujur: berapa lama bisa bertahan tanpa penghasilan? 3 bulan? 12 bulan? User mengisi form estimasi runway finansial mereka. |
| 3 | Pelajari dasar bisnis | HPP, margin, cash flow, break-even. Platform menyediakan materi singkat (bisa berupa artikel atau link ke tools) untuk masing-masing konsep. |
| 4 | Identifikasi skills | Apa yang bisa dilakukan jauh lebih baik dari rata-rata? User mengisi field deskripsi skills dan pengalaman relevan. |

#### Gate Checklist (4 item)

```
[ ] Sudah mengisi motivasi utama membangun bisnis (bukan hanya uang)
[ ] Sudah estimasi berapa lama bisa bertahan tanpa income
[ ] Sudah membaca/mempelajari setidaknya 1 konsep keuangan bisnis dasar
[ ] Sudah menulis skills dan pengalaman relevan yang dimiliki
```

**Gate requirement:** Minimal 3 dari 4 checklist harus dicentang untuk membuka Fase 02.

#### Peringatan Umum (Fatal Trap)

> **Jebakan paling umum di fase ini:** Terlalu lama di fase 'planning' tanpa eksekusi. Banyak yang menghabiskan berbulan-bulan membuat business plan sempurna sebelum berbicara dengan satu pun calon pelanggan. Itu bukan persiapan — itu prokrastinasi terselubung.

#### Perspektif Konsultan

> *"Pertanyaan yang harus bisa dijawab sebelum lanjut: Jika bisnis ini tidak menghasilkan dalam 6 bulan pertama, apakah kamu akan menyesal sudah memulainya? Jika jawabannya 'tidak' — lanjut. Jika 'ya' — kamu perlu motivasi yang lebih kuat."*

#### Tools yang Direkomendasikan di Fase Ini
- Belum ada tool kalkulator yang relevan
- Link ke artikel pengantar: Apa itu HPP, Margin, Break-even

---

### Fase 02 — Validasi Ide

**Tagline:** *Uji ide sebelum modal keluar*

**Deskripsi:** Ide bukan bisnis. Ide yang dibayar orang — itu bisnis. Fase ini membuktikan apakah ada yang mau membayar untuk solusi yang ditawarkan.

#### Tasks (4 task)

| # | Judul | Deskripsi Detail |
|---|---|---|
| 1 | Riset masalah nyata | Wawancara 20–30 orang dari target pasar. Platform menyediakan template pertanyaan wawancara. Dengarkan masalah, jangan jual solusi dulu. |
| 2 | Analisis 3–5 kompetitor | Gunakan tool Analisis Kompetitor platform. Jika tidak ada kompetitor, itu bukan tanda bagus — itu tanda mungkin tidak ada pasar. |
| 3 | Definisikan value proposition | Dalam 1 kalimat: siapa yang dibantu, dengan apa, dan mengapa lebih baik dari alternatif? Diisi di form yang tersedia. |
| 4 | Buat MVP atau pre-order | Jual sebelum produk jadi. Jika tidak ada yang mau bayar di muka, pikirkan ulang. User diminta mendokumentasikan upaya pre-order mereka. |

#### Gate Checklist (4 item)

```
[ ] Sudah wawancara minimal 20 calon pelanggan (bukan keluarga/teman dekat)
[ ] Sudah identifikasi dan analisis minimal 3 kompetitor (via tool platform)
[ ] Value proposition sudah ditulis dalam 1 kalimat yang jelas
[ ] Ada setidaknya 5 orang yang berminat membayar (pre-order / daftar tunggu)
```

**Gate requirement:** Semua 4 checklist harus dicentang untuk membuka Fase 03.

#### Peringatan Umum (Fatal Trap)

> **Kesalahan fatal yang sering terjadi:** Bertanya 'apakah kamu suka produk ini?' kepada teman dan keluarga. Mereka akan bilang ya karena tidak ingin menyakiti perasaanmu. Yang harus ditanya: 'Masalah apa yang kamu hadapi sekarang terkait ini?' dan 'Apakah kamu pernah mencoba solusi lain?'

#### Perspektif Konsultan

> *"Tolok ukur validasi: jika 30% dari orang yang di-pitch bersedia membayar di muka, ide itu layak dilanjutkan. Di bawah itu, perlu pivot atau ubah penawaran. Angka ini keras, tapi inilah yang memisahkan ide dari bisnis nyata."*

#### Tools yang Direkomendasikan di Fase Ini
- **Analisis Kompetitor** — wajib diisi sebelum checklist #2 bisa dicentang
- **Business Model Canvas** — mulai draft awal

---

### Fase 03 — Bangun Fondasi

**Tagline:** *Sistem sebelum skala*

**Deskripsi:** Bisnis tanpa sistem adalah pekerjaan yang tidak bisa berhenti. Fondasi yang benar memungkinkan pertumbuhan yang sehat dan dapat didelegasikan.

#### Tasks (4 task)

| # | Judul | Deskripsi Detail |
|---|---|---|
| 1 | Hitung HPP dengan tepat | Semua biaya: bahan baku, tenaga kerja, overhead. Lalu tentukan margin minimum yang sehat (minimal 30–40%). Gunakan Kalkulator HPP platform. |
| 2 | Buat SOP minimal | Dokumentasi proses produksi/layanan, cara handle komplain, dan alur keuangan harian. Gunakan SOP Builder platform. |
| 3 | Pilih struktur legal | UD, CV, atau PT? Buka rekening bisnis terpisah dari rekening pribadi. Gunakan Legal Checklist platform. |
| 4 | Setup pembukuan dasar | Catat setiap pemasukan dan pengeluaran. Tidak perlu software mahal untuk awal — konsistensi lebih penting dari tool. |

#### Gate Checklist (4 item)

```
[ ] HPP per unit sudah dihitung dengan benar (semua komponen biaya dimasukkan)
[ ] Harga jual sudah ditetapkan dengan margin minimal 30%
[ ] Ada SOP minimal untuk proses utama bisnis
[ ] Rekening bisnis sudah dibuka terpisah dari rekening pribadi
```

**Gate requirement:** Semua 4 checklist harus dicentang untuk membuka Fase 04.

#### Peringatan Umum (Fatal Trap)

> **Penyakit bisnis kecil yang paling umum:** Menetapkan harga berdasarkan feeling atau 'lihat harga kompetitor'. Tanpa menghitung HPP dan margin minimum, bisa berjualan ratusan unit tapi tetap rugi. Ini terjadi lebih sering dari yang dikira.

#### Perspektif Konsultan

> *"Aturan yang selalu diberikan ke klien baru: jangan pernah bayar biaya bisnis dari rekening pribadi, dan jangan pernah pakai uang bisnis untuk kebutuhan pribadi. Pemisahan ini adalah perbedaan antara orang yang punya bisnis dan orang yang punya hobi yang menghasilkan uang."*

#### Tools yang Direkomendasikan di Fase Ini
- **Kalkulator HPP & Harga Jual** — wajib diisi sebelum checklist #1 dan #2 bisa dicentang
- **SOP Builder** — wajib diisi sebelum checklist #3 bisa dicentang
- **Legal & Izin Checklist** — direkomendasikan untuk checklist #3

---

### Fase 04 — Launch Pertama

**Tagline:** *Dapatkan 10 pelanggan pertama*

**Deskripsi:** 10 pelanggan pertama lebih penting dari 1.000 follower. Fokus pada konversi nyata, bukan awareness atau tampilan yang sempurna.

#### Tasks (4 task)

| # | Judul | Deskripsi Detail |
|---|---|---|
| 1 | Pilih 1 channel utama | Jangan coba semua platform sekaligus. Pilih satu yang paling dekat dengan target pasar dan kuasai itu dulu. User memilih channel dari daftar opsi. |
| 2 | Tawarkan langsung ke jaringan | 10 pelanggan pertama hampir selalu datang dari orang yang sudah mengenal sang founder. Tidak ada yang salah dengan itu. User mendokumentasikan outreach yang dilakukan. |
| 3 | Minta feedback agresif | Setelah setiap penjualan, tanya: apa yang bisa lebih baik? Apa yang hampir membuatmu tidak jadi beli? User mengisi form feedback yang dikumpulkan. |
| 4 | Iterate cepat | Dengan 10 pelanggan pertama, sudah ada data nyata. Gunakan untuk memperbaiki produk/layanan sebelum scale. |

#### Gate Checklist (4 item)

```
[ ] Sudah mendapatkan minimal 10 pelanggan yang membayar harga penuh (bukan diskon besar)
[ ] Sudah mengumpulkan feedback dari minimal 7 dari 10 pelanggan pertama
[ ] Ada setidaknya 1 testimonial nyata yang bisa digunakan
[ ] Sudah identifikasi pola: siapa pelanggan paling puas dan mengapa
```

**Gate requirement:** Semua 4 checklist harus dicentang untuk membuka Fase 05.

#### Peringatan Umum (Fatal Trap)

> **Jebakan launch yang sering menghancurkan momentum:** Menghabiskan semua energi untuk tampil sempurna — website sempurna, logo sempurna, feed Instagram sempurna — sebelum ada satu pun penjualan. Pelanggan pertama tidak peduli kamu punya logo bagus. Mereka peduli apakah produkmu menyelesaikan masalah mereka.

#### Perspektif Konsultan

> *"Yang membedakan launch yang berhasil dari yang gagal: obsesi pada pelanggan, bukan pada produk. Setiap hari, pertanyaannya harus 'bagaimana saya bisa melayani lebih baik?' bukan 'bagaimana produk saya terlihat lebih bagus?'"*

#### Tools yang Direkomendasikan di Fase Ini
- **Pricing Strategy Advisor** — pastikan pricing sudah optimal sebelum launch resmi
- **Break-Even Analysis** — ketahui target penjualan minimum yang harus dicapai

---

### Fase 05 — Stabilisasi

**Tagline:** *Dari chaos ke sistem yang berulang*

**Deskripsi:** Bisnis yang sehat bisa berjalan konsisten tanpa founder harus hadir setiap saat. Fase ini membangun sistem dan delegasi pertama.

#### Tasks (4 task)

| # | Judul | Deskripsi Detail |
|---|---|---|
| 1 | Tracking KPI mingguan | Omzet, jumlah transaksi, gross margin, dan repeat rate. Angka ini harus dilihat setiap minggu tanpa kecuali. Gunakan KPI Dashboard platform. |
| 2 | Bangun sistem repeat | Bagaimana membuat pelanggan kembali? Loyalty, subscription, upsell, referral — pilih minimal satu dan implementasikan. |
| 3 | Proyeksi cash flow 6 bulan | Kapan perlu modal? Apakah ada bulan defisit yang bisa diprediksi? Tahu ini sebelum terjadi. Gunakan Cash Flow Projector platform. |
| 4 | Delegasi hal pertama | Identifikasi satu pekerjaan yang bisa diajarkan dan didelegasikan — freelancer, part-timer, atau partner. |

#### Gate Checklist (4 item)

```
[ ] Ada laporan keuangan sederhana yang diupdate setiap minggu
[ ] Repeat rate pelanggan sudah di atas 20%
[ ] Cash flow 6 bulan ke depan sudah diproyeksi (via tool platform)
[ ] Sudah ada minimal 1 orang/pihak lain yang membantu operasional
```

**Gate requirement:** Semua 4 checklist harus dicentang untuk membuka Fase 06.

#### Peringatan Umum (Fatal Trap)

> **Alasan terbesar bisnis mandeg di fase ini:** Founder terlalu jadi 'pusat' semua hal. Ketika founder adalah satu-satunya yang bisa handle produksi, CS, keuangan, dan pemasaran — bisnis itu bukan bisnis, itu self-employment. Saat sakit atau pergi liburan, semua berhenti.

#### Perspektif Konsultan

> *"Target di fase ini: bisnis harus bisa berjalan normal selama founder sakit 2 minggu. Jika tidak bisa, belum punya bisnis yang sesungguhnya — masih punya pekerjaan yang diciptakan sendiri."*

#### Tools yang Direkomendasikan di Fase Ini
- **KPI Dashboard & Business Health Score** — wajib aktif sebelum checklist #1 bisa dicentang
- **Cash Flow Projector** — wajib diisi sebelum checklist #3 bisa dicentang

---

### Fase 06 — Skala

**Tagline:** *Tumbuh dengan sengaja, bukan kebetulan*

**Deskripsi:** Skala bukan tentang melakukan lebih banyak hal. Tapi tentang melakukan hal yang tepat, lebih banyak. Fase ini tidak memiliki gate — ini adalah fase ongoing yang terus berkembang.

#### Tasks (4 task)

| # | Judul | Deskripsi Detail |
|---|---|---|
| 1 | Pilih 1 lever pertumbuhan | Lebih banyak pelanggan baru? Naikkan nilai per transaksi? Tingkatkan frekuensi beli? Pilih satu dan fokus total selama minimal 90 hari. |
| 2 | Bangun tim inti | Rekrut untuk kelemahan, bukan untuk duplikasi. Hire orang yang lebih baik dari founder di area tertentu. |
| 3 | Formalisasi model bisnis | Update BMC, SOP, dan proyeksi dengan data aktual. Dokumen ini juga untuk investor atau mitra potensial. |
| 4 | Siapkan monetisasi lanjutan | Apakah ada fitur premium yang bisa dijual? Tier layanan berbeda? Partnership strategis? |

#### Checklist (tidak ada gate — ini ongoing KPI)

```
[ ] Unit economics positif: customer lifetime value > 3× customer acquisition cost
[ ] Ada satu lever pertumbuhan yang sedang dieksekusi secara konsisten
[ ] Tim atau partner yang membantu operasional sudah berjalan dengan baik
[ ] Business model canvas sudah diupdate berdasarkan data aktual, bukan asumsi awal
```

#### Peringatan Umum (Fatal Trap)

> **Cara paling cepat menghancurkan bisnis yang bagus:** Scale sebelum sistem stabil. Menambah kapasitas produksi, membuka cabang baru, atau menambah lini produk ketika proses utama masih kacau hanya akan memperbesar masalah yang sudah ada.

#### Perspektif Konsultan

> *"Satu hal yang selalu disampaikan sebelum klien masuk ke fase skala: kamu harus bisa menjawab pertanyaan ini dengan data, bukan dengan keyakinan — mengapa pelanggan membeli dari kamu, bukan dari kompetitor? Jika jawabannya 'karena produk saya lebih bagus', itu bukan jawaban bisnis. Itu jawaban harapan."*

#### Tools yang Direkomendasikan di Fase Ini
- Semua tools aktif dan diupdate secara rutin
- **Business Model Canvas** — diupdate dengan data aktual
- Pertimbangkan booking sesi konsultasi untuk strategi skala

---

## 4. Sistem Gate & Progression

### 4.1 Aturan Gate

```
Fase 01 → Fase 02 : Minimal 3/4 checklist Fase 01 selesai
Fase 02 → Fase 03 : Semua 4/4 checklist Fase 02 selesai
Fase 03 → Fase 04 : Semua 4/4 checklist Fase 03 selesai
Fase 04 → Fase 05 : Semua 4/4 checklist Fase 04 selesai
Fase 05 → Fase 06 : Semua 4/4 checklist Fase 05 selesai
Fase 06          : Tidak ada gate — ongoing
```

### 4.2 Aturan Unlock

- Fase yang belum terbuka ditampilkan dengan status `locked` — konten terlihat tapi tidak bisa diinteraksi.
- Saat gate terpenuhi, muncul modal konfirmasi: *"Kamu sudah menyelesaikan semua gate Fase [X]. Lanjut ke Fase [X+1]?"*
- Setelah dikonfirmasi, `phase_number` di tabel `phase_progress` diupdate ke fase berikutnya, dan notifikasi dikirim.
- Pengguna tetap bisa kembali ke fase sebelumnya kapan saja untuk review.

### 4.3 Tool-Linked Checklist

Beberapa checklist item hanya bisa dicentang jika pengguna sudah mengisi tool terkait. Sistem memverifikasi ini secara otomatis:

| Fase | Checklist Item | Tool yang Harus Diisi |
|---|---|---|
| 02 | Analisis minimal 3 kompetitor | `tool_data` slug `kompetitor` harus ada dan tidak kosong |
| 03 | HPP sudah dihitung dengan benar | `tool_data` slug `hpp` harus ada |
| 03 | SOP minimal sudah dibuat | `tool_data` slug `sop` harus ada dengan minimal 1 SOP |
| 05 | Cash flow 6 bulan sudah diproyeksi | `tool_data` slug `cash-flow` harus ada |

Jika pengguna mencoba mencentang item ini tanpa mengisi tool yang dimaksud, sistem memunculkan pesan: *"Selesaikan dulu [nama tool] untuk menyelesaikan checklist ini."* dengan tombol langsung ke tool tersebut.

---

## 5. Spesifikasi Frontend

### 5.1 Halaman & Routing

| Route | Komponen | Deskripsi |
|---|---|---|
| `/roadmap` | `RoadmapPage` | Halaman utama — overview 6 fase dengan progress bar |
| `/roadmap/fase/[id]` | `PhasePage` | Detail satu fase — tasks, checklist, perspektif konsultan |

### 5.2 Komponen yang Harus Dibuat

```
src/
  app/
    (dashboard)/
      roadmap/
        page.tsx                    ← Halaman overview roadmap
        fase/
          [id]/
            page.tsx                ← Halaman detail per fase
  components/
    roadmap/
      RoadmapOverview.tsx           ← Grid 6 fase dengan status dan progress
      PhaseCard.tsx                 ← Card satu fase di halaman overview
      PhaseNav.tsx                  ← Tab navigasi antar fase (pill buttons)
      PhaseHeader.tsx               ← Header fase (nomor, judul, tagline, durasi)
      FatalTrapBox.tsx              ← Kotak peringatan merah per fase
      TaskGrid.tsx                  ← Grid 2 kolom task cards
      TaskCard.tsx                  ← Card satu task (bisa di-toggle selesai)
      GateChecklist.tsx             ← Checklist gate dengan progress counter
      ChecklistItem.tsx             ← Satu item checklist (interaktif)
      ConsultantPerspective.tsx     ← Kotak perspektif konsultan (clickable)
      PhaseGateModal.tsx            ← Modal konfirmasi saat gate terpenuhi
      ToolRecommendation.tsx        ← Banner rekomendasi tools per fase
      LockedPhaseOverlay.tsx        ← Overlay untuk fase yang masih locked
```

### 5.3 State Management

Gunakan Zustand store `useRoadmapStore` untuk:

```typescript
interface RoadmapStore {
  phases: Phase[]
  currentPhase: number
  checklistStates: Record<number, boolean[]>  // phase_id → array of checked state
  taskStates: Record<number, boolean[]>        // phase_id → array of done state
  isGateModalOpen: boolean
  pendingUnlockPhase: number | null

  // Actions
  toggleChecklistItem: (phaseId: number, itemIndex: number) => void
  toggleTask: (phaseId: number, taskIndex: number) => void
  unlockNextPhase: () => void
  closeGateModal: () => void
}
```

### 5.4 Spesifikasi UI per Komponen

#### RoadmapOverview — Halaman `/roadmap`

- Layout: grid 2 kolom di desktop, 1 kolom di mobile
- Setiap `PhaseCard` menampilkan:
  - Nomor fase + nama fase
  - Tagline (subtitle)
  - Progress bar checklist (misal: "2/4 selesai")
  - Badge status: `Aktif` (hijau) / `Selesai` (teal) / `Terkunci` (abu)
  - Estimasi durasi
- Klik card → navigasi ke `/roadmap/fase/[id]`
- Di bagian atas halaman: overall progress bar seluruh 6 fase

#### PhasePage — Halaman `/roadmap/fase/[id]`

- Tab navigasi antar fase di bagian atas (bisa scroll horizontal di mobile)
- Konten utama scrollable ke bawah dengan urutan:
  1. `PhaseHeader` — nomor, judul, tagline, badge durasi, badge status
  2. `FatalTrapBox` — kotak peringatan, background merah muda
  3. `TaskGrid` — 4 task dalam grid 2x2
  4. `GateChecklist` — checklist dengan counter progress
  5. `ToolRecommendation` — tools yang direkomendasikan di fase ini
  6. `ConsultantPerspective` — kutipan konsultan, clickable ke chatbot
- Footer: tombol navigasi fase sebelumnya / berikutnya

#### PhaseGateModal

Muncul otomatis saat semua gate checklist terpenuhi.

```
┌─────────────────────────────────┐
│ 🎉 Fase 03 Selesai!             │
│                                 │
│ Kamu telah menyelesaikan semua  │
│ checklist Fase Bangun Fondasi.  │
│                                 │
│ Fase 04 — Launch Pertama        │
│ sekarang terbuka.               │
│                                 │
│ [Tetap di sini]  [Lanjut →]    │
└─────────────────────────────────┘
```

#### LockedPhaseOverlay

Untuk fase yang belum terbuka:
- Konten fase terlihat tapi di-blur (filter: blur(4px))
- Overlay semi-transparan dengan teks: *"Selesaikan Fase [X-1] terlebih dahulu untuk membuka fase ini."*
- Tombol: *"Lihat Fase [X-1]"*

### 5.5 Dark/Light Mode

Semua komponen roadmap mengikuti tema aktif platform via CSS variables. Tidak ada hardcode warna.

Warna khusus untuk status fase:

```css
/* Active phase */
--phase-active-bg: #E1F5EE;    /* dark: #0F3D2E */
--phase-active-text: #085041;  /* dark: #5DCAA5 */

/* Completed phase */
--phase-done-bg: #E6F1FB;      /* dark: #0C2F52 */
--phase-done-text: #185FA5;    /* dark: #85B7EB */

/* Locked phase */
--phase-locked-bg: var(--color-background-secondary);
--phase-locked-text: var(--color-text-tertiary);
```

### 5.6 Responsive Behavior

| Breakpoint | Layout |
|---|---|
| Mobile (< 640px) | 1 kolom, tab navigasi scroll horizontal, task grid 1 kolom |
| Tablet (640–1024px) | 2 kolom overview, task grid 2 kolom |
| Desktop (> 1024px) | 3 kolom overview, task grid 2 kolom, sidebar konsultan |

---

## 6. Spesifikasi Backend & API

### 6.1 API Endpoints

#### GET `/api/roadmap`

Ambil seluruh data roadmap user yang sedang login.

**Response:**
```json
{
  "current_phase": 2,
  "overall_progress_pct": 33,
  "phases": [
    {
      "phase_number": 1,
      "name": "Mental Reset",
      "tagline": "Bongkar mindset sebelum mulai",
      "status": "completed",
      "duration_label": "Minggu 1–2",
      "checklist_progress": { "done": 4, "total": 4 },
      "completed_at": "2025-04-10T08:00:00Z"
    },
    {
      "phase_number": 2,
      "name": "Validasi Ide",
      "tagline": "Uji ide sebelum modal keluar",
      "status": "active",
      "duration_label": "Minggu 2–6",
      "checklist_progress": { "done": 2, "total": 4 },
      "completed_at": null
    },
    ...
  ]
}
```

---

#### GET `/api/roadmap/phase/:id`

Ambil detail lengkap satu fase termasuk checklist state user.

**Response:**
```json
{
  "phase_number": 2,
  "name": "Validasi Ide",
  "status": "active",
  "checklist_items": [
    { "id": "v1", "label": "Sudah wawancara minimal 20 calon pelanggan", "completed": true, "tool_required": null },
    { "id": "v2", "label": "Sudah analisis minimal 3 kompetitor", "completed": false, "tool_required": "kompetitor", "tool_filled": false }
  ],
  "tasks": [
    { "id": "t1", "title": "Riset masalah nyata", "completed": false },
    ...
  ],
  "gate_met": false,
  "gate_requirement": "4 dari 4 checklist harus selesai"
}
```

---

#### PUT `/api/roadmap/phase/:id/checklist/:item_id`

Update status satu item checklist.

**Request body:**
```json
{ "completed": true }
```

**Logic di server:**
1. Cek apakah item ini memerlukan tool tertentu (`tool_required`)
2. Jika ya, verifikasi `tool_data` user untuk slug tersebut sudah ada
3. Jika tool belum diisi, return 400 dengan pesan error
4. Jika valid, update `checklist_items` di tabel `phase_progress`
5. Cek apakah gate requirement terpenuhi setelah update ini
6. Jika gate terpenuhi, set flag `gate_met: true` di response

**Response:**
```json
{
  "updated": true,
  "gate_met": true,
  "next_phase_unlockable": true
}
```

---

#### POST `/api/roadmap/phase/:id/complete`

Konfirmasi penyelesaian fase dan unlock fase berikutnya.

**Logic di server:**
1. Verifikasi ulang semua gate checklist terpenuhi
2. Update status fase current menjadi `completed`, set `completed_at`
3. Update status fase berikutnya menjadi `active`
4. Update `current_phase` di tabel `users`
5. Trigger Advisory Engine untuk generate alert/diagnosis update
6. Kirim notifikasi email (via Resend): *"Selamat! Kamu telah menyelesaikan Fase [X]"*

**Response:**
```json
{
  "phase_completed": 2,
  "next_phase_unlocked": 3,
  "health_score_updated": 72
}
```

---

#### PUT `/api/roadmap/phase/:id/task/:task_id`

Update status satu task (opsional — task tidak mempengaruhi gate).

**Request body:**
```json
{ "completed": true }
```

---

### 6.2 Middleware & Guard

Tambahkan guard di semua endpoint roadmap:

```typescript
// Verifikasi user sudah menyelesaikan onboarding
if (!user.onboarding_completed) {
  return NextResponse.redirect('/onboarding')
}

// Verifikasi fase yang diminta accessible
const requestedPhase = parseInt(params.id)
if (requestedPhase > user.current_phase) {
  return NextResponse.json({ error: 'Fase ini belum terbuka.' }, { status: 403 })
}
```

---

## 7. Skema Database

### 7.1 Tabel: `phase_progress`

Tabel ini sudah ada di PRD utama. Berikut detail lengkap khusus untuk fitur roadmap:

```sql
CREATE TABLE phase_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phase_number SMALLINT NOT NULL CHECK (phase_number BETWEEN 1 AND 6),
  status VARCHAR(20) NOT NULL DEFAULT 'locked'
    CHECK (status IN ('locked', 'active', 'completed')),

  -- Checklist items sebagai JSONB array
  -- Format: [{id: string, label: string, completed: boolean, tool_required: string|null}]
  checklist_items JSONB NOT NULL DEFAULT '[]',

  -- Task items sebagai JSONB array (opsional, tidak mempengaruhi gate)
  -- Format: [{id: string, title: string, completed: boolean}]
  task_items JSONB NOT NULL DEFAULT '[]',

  -- Metadata tambahan per fase (value proposition, motivasi, dll)
  -- Format bebas sesuai kebutuhan fase
  phase_data JSONB DEFAULT '{}',

  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id, phase_number)
);

-- RLS
ALTER TABLE phase_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own phase progress"
  ON phase_progress FOR ALL
  USING (auth.uid() = user_id);

-- Trigger: update updated_at otomatis
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phase_progress_updated_at
  BEFORE UPDATE ON phase_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 7.2 Inisialisasi Data Fase

Saat user menyelesaikan onboarding, sistem otomatis membuat 6 baris di `phase_progress`:

```sql
-- Dijalankan via Supabase Edge Function setelah onboarding selesai
INSERT INTO phase_progress (user_id, phase_number, status, checklist_items, task_items)
VALUES
  (user_id, 1, 'active',   '[{"id":"m1","label":"Sudah mengisi motivasi utama","completed":false,"tool_required":null},{"id":"m2","label":"Sudah estimasi runway finansial","completed":false,"tool_required":null},{"id":"m3","label":"Sudah pelajari 1 konsep keuangan","completed":false,"tool_required":null},{"id":"m4","label":"Sudah tulis skills relevan","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Definisikan mengapa","completed":false},{"id":"t2","title":"Toleransi risiko","completed":false},{"id":"t3","title":"Pelajari dasar bisnis","completed":false},{"id":"t4","title":"Identifikasi skills","completed":false}]'),
  (user_id, 2, 'locked',   '[{"id":"v1","label":"Sudah wawancara 20 calon pelanggan","completed":false,"tool_required":null},{"id":"v2","label":"Sudah analisis 3 kompetitor","completed":false,"tool_required":"kompetitor"},{"id":"v3","label":"Value proposition sudah ditulis","completed":false,"tool_required":null},{"id":"v4","label":"Ada 5 orang berminat membayar","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Riset masalah nyata","completed":false},{"id":"t2","title":"Analisis kompetitor","completed":false},{"id":"t3","title":"Definisikan value proposition","completed":false},{"id":"t4","title":"Buat MVP atau pre-order","completed":false}]'),
  (user_id, 3, 'locked',   '[{"id":"f1","label":"HPP dihitung dengan benar","completed":false,"tool_required":"hpp"},{"id":"f2","label":"Harga jual dengan margin 30%","completed":false,"tool_required":"hpp"},{"id":"f3","label":"Ada SOP minimal","completed":false,"tool_required":"sop"},{"id":"f4","label":"Rekening bisnis sudah dipisah","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Hitung HPP","completed":false},{"id":"t2","title":"Buat SOP minimal","completed":false},{"id":"t3","title":"Pilih struktur legal","completed":false},{"id":"t4","title":"Setup pembukuan dasar","completed":false}]'),
  (user_id, 4, 'locked',   '[{"id":"l1","label":"Sudah dapat 10 pelanggan harga penuh","completed":false,"tool_required":null},{"id":"l2","label":"Sudah kumpulkan feedback 7 pelanggan","completed":false,"tool_required":null},{"id":"l3","label":"Ada minimal 1 testimonial","completed":false,"tool_required":null},{"id":"l4","label":"Sudah identifikasi pola pelanggan puas","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Pilih 1 channel utama","completed":false},{"id":"t2","title":"Tawarkan ke jaringan","completed":false},{"id":"t3","title":"Minta feedback agresif","completed":false},{"id":"t4","title":"Iterate cepat","completed":false}]'),
  (user_id, 5, 'locked',   '[{"id":"s1","label":"Ada laporan keuangan mingguan","completed":false,"tool_required":null},{"id":"s2","label":"Repeat rate di atas 20%","completed":false,"tool_required":"kpi"},{"id":"s3","label":"Cash flow 6 bulan sudah diproyeksi","completed":false,"tool_required":"cash-flow"},{"id":"s4","label":"Ada 1 orang membantu operasional","completed":false,"tool_required":null}]', '[{"id":"t1","title":"Tracking KPI mingguan","completed":false},{"id":"t2","title":"Bangun sistem repeat","completed":false},{"id":"t3","title":"Proyeksi cash flow","completed":false},{"id":"t4","title":"Delegasi hal pertama","completed":false}]'),
  (user_id, 6, 'locked',   '[{"id":"sc1","label":"Unit economics positif (LTV > 3x CAC)","completed":false,"tool_required":"kpi"},{"id":"sc2","label":"Ada lever pertumbuhan yang dieksekusi","completed":false,"tool_required":null},{"id":"sc3","label":"Tim operasional sudah berjalan","completed":false,"tool_required":null},{"id":"sc4","label":"BMC diupdate dengan data aktual","completed":false,"tool_required":"bmc"}]', '[{"id":"t1","title":"Pilih lever pertumbuhan","completed":false},{"id":"t2","title":"Bangun tim inti","completed":false},{"id":"t3","title":"Formalisasi model bisnis","completed":false},{"id":"t4","title":"Siapkan monetisasi lanjutan","completed":false}]');
```

---

## 8. Notifikasi & Advisory Integration

### 8.1 Notifikasi Email (via Resend)

| Event | Template | Waktu Kirim |
|---|---|---|
| Fase selesai | `phase-completed` | Langsung setelah `POST /complete` |
| Tidak ada progress 7 hari | `roadmap-reminder` | Cron job harian |
| Fase terbuka | `phase-unlocked` | Langsung setelah unlock |

### 8.2 Alert Advisory Engine

Saat fase diselesaikan, Advisory Engine menghasilkan alert:

```
Fase 02 selesai → Alert INFO: "Validasi selesai! Saatnya masuk ke fase membangun sistem. Tools yang perlu kamu isi berikutnya: Kalkulator HPP dan SOP Builder."

Fase 03 selesai → Alert SUCCESS: "Fondasi bisnis kamu sudah solid. HPP dihitung, SOP ada, dan rekening bisnis terpisah. Ini sudah lebih baik dari 70% UMKM Indonesia."

Tidak ada update checklist 14 hari → Alert WARNING: "Sudah 14 hari sejak kamu terakhir mengupdate roadmap. Bisnis yang tidak bergerak adalah bisnis yang mundur. Lanjut dari [checklist item terakhir]?"
```

### 8.3 Health Score Contribution

Progress roadmap berkontribusi pada Business Health Score:

| Kondisi | Kontribusi Score |
|---|---|
| Fase 01 selesai | +10 poin |
| Fase 02 selesai | +15 poin |
| Fase 03 selesai | +15 poin |
| Fase 04 selesai | +15 poin |
| Fase 05 selesai | +20 poin |
| Fase 06 aktif | +10 poin (base) |
| KPI Fase 06 terpenuhi | +15 poin (bonus) |

---

## 9. Edge Cases & Error Handling

| Skenario | Penanganan |
|---|---|
| User mencoba akses `/roadmap/fase/4` padahal masih di fase 2 | Redirect ke fase aktif + tampilkan pesan "Fase ini belum terbuka" |
| User mencoba centang checklist tool-linked tapi tool belum diisi | Tampilkan bottom sheet: "Isi [nama tool] dulu" + tombol ke tool |
| Koneksi internet terputus saat submit checklist | Optimistic update di UI, retry otomatis, rollback jika gagal setelah 3x |
| User menghapus data tool yang dipakai sebagai gate | Alert WARNING + checklist item yang terkait otomatis di-uncheck |
| User sudah di fase 6 | Tampilkan dashboard fase 6 tanpa gate modal, dengan KPI tracking sebagai fokus |
| Onboarding belum selesai | Redirect ke `/onboarding` sebelum bisa akses roadmap |

---

## 10. Checklist Implementasi

### Database
- [ ] Tabel `phase_progress` sudah dibuat dengan skema yang benar
- [ ] RLS aktif di tabel `phase_progress`
- [ ] Trigger `update_updated_at` sudah dibuat
- [ ] Data inisialisasi 6 fase sudah dijalankan saat onboarding selesai

### Backend
- [ ] `GET /api/roadmap` mengembalikan data semua fase dengan progress
- [ ] `GET /api/roadmap/phase/:id` mengembalikan detail dan checklist state
- [ ] `PUT /api/roadmap/phase/:id/checklist/:item_id` memvalidasi tool-linked items
- [ ] `POST /api/roadmap/phase/:id/complete` unlock fase berikutnya dengan benar
- [ ] Guard: user yang belum onboarding tidak bisa akses roadmap
- [ ] Guard: user tidak bisa akses fase yang belum terbuka

### Frontend
- [ ] Halaman `/roadmap` menampilkan overview 6 fase dengan status dan progress yang benar
- [ ] Halaman `/roadmap/fase/[id]` menampilkan semua komponen: header, fatal trap, tasks, checklist, perspektif konsultan
- [ ] `PhaseGateModal` muncul otomatis saat semua gate terpenuhi
- [ ] `LockedPhaseOverlay` tampil dengan benar untuk fase yang locked
- [ ] Tab navigasi antar fase berfungsi di desktop dan mobile
- [ ] Tool-linked checklist menampilkan pesan dan link ke tool yang benar
- [ ] `ConsultantPerspective` clickable dan membuka chatbot dengan konteks fase
- [ ] Dark/light mode berjalan benar di semua komponen roadmap
- [ ] Responsive di mobile 375px

### Notifikasi & Integration
- [ ] Email notifikasi fase selesai terkirim via Resend
- [ ] Cron job pengingat 7 hari berjalan via pg_cron
- [ ] Advisory Engine alert digenerate saat fase selesai
- [ ] Health Score terupdate setelah fase selesai
- [ ] Konteks fase aktif dikirim ke BizBot chatbot

---

*PRD Fitur Roadmap Bisnis — BisnisMulai v1.0 | Dokumen Internal | Mei 2025*
