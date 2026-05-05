# PROMPT — Tambah Fitur Chatbot ke Platform BisnisMulai (Gemini API - GRATIS)

---

## KONTEKS PROJECT

Saya sedang membangun platform web bernama **BisnisMulai** — platform panduan bisnis all-in-one untuk calon pengusaha Indonesia yang ingin memulai bisnis dari nol. Platform ini dibangun dengan:

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Hosting:** Vercel + Supabase
- **Tema UI:** Dark mode sebagai default, dengan toggle light/dark mode
- **Bahasa:** Bahasa Indonesia

Platform memiliki fitur: roadmap bisnis 4 fase, tools kalkulator bisnis (HPP, break-even, cash flow, BMC, dll), sistem advisory, dan booking konsultasi.

---

## TUGAS

Tambahkan fitur **chatbot bisnis AI** ke dalam platform BisnisMulai menggunakan **Google Gemini API (gratis)**. Chatbot ini berfungsi sebagai **asisten konsultan bisnis virtual** yang hanya menjawab pertanyaan seputar topik bisnis yang relevan dengan platform.

---

## SETUP GEMINI API (GRATIS)

### Cara Mendapatkan API Key
1. Buka [https://aistudio.google.com](https://aistudio.google.com)
2. Login dengan akun Google
3. Klik **"Get API Key"** → **"Create API key"**
4. Copy API key yang digenerate
5. Tambahkan ke `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

### Free Tier Limit
- **Model:** `gemini-2.0-flash` (model terbaru, gratis)
- **Limit gratis:** 1.500 request/hari dan 1 juta token/hari
- **Cukup untuk:** ratusan user aktif di fase growth platform
- Tidak perlu kartu kredit untuk memulai

### Install SDK
```bash
npm install @google/generative-ai
```

---

## SPESIFIKASI FITUR CHATBOT

### 1. Identitas & Kepribadian Chatbot

- **Nama:** BizBot
- **Persona:** Konsultan bisnis berpengalaman 10 tahun, berbicara dalam Bahasa Indonesia yang profesional namun tidak kaku — seperti mentor bisnis yang suportif, jujur, dan to-the-point.
- **Gaya bahasa:** Semi-formal. Tidak menggunakan bahasa gaul berlebihan, tetapi tetap hangat dan mudah dimengerti oleh pengusaha pemula sekalipun.

---

### 2. Topik yang BOLEH Dijawab (In-Scope)

Chatbot HANYA boleh menjawab pertanyaan dalam kategori berikut:

- **Validasi ide bisnis** — cara menguji ide, riset pasar dasar, analisis demand
- **Perencanaan bisnis** — business model canvas, value proposition, segmentasi pelanggan
- **Keuangan bisnis** — cara menghitung HPP, harga jual, break-even, cash flow, margin, modal usaha
- **Operasional** — SOP, manajemen stok, sistem kerja harian bisnis kecil
- **Pemasaran & penjualan** — strategi pricing, channel penjualan, akuisisi pelanggan pertama
- **Legal & perizinan** — jenis badan usaha (UD/CV/PT), NIB, izin usaha dasar, kewajiban pajak UMKM
- **Skalabilitas** — kapan dan bagaimana menambah produk, tim, atau pasar
- **Mindset & keputusan bisnis** — manajemen risiko, pengambilan keputusan berbasis data, kapan harus pivot

### 3. Topik yang TIDAK BOLEH Dijawab (Out-of-Scope)

Jika user bertanya di luar topik bisnis, chatbot harus menolak dengan sopan dan mengarahkan kembali ke topik bisnis.

**Contoh respons penolakan:**
> "Pertanyaan ini di luar bidang saya. Saya adalah asisten bisnis — saya bisa membantu kamu soal perencanaan, keuangan, operasional, atau strategi bisnis. Ada yang bisa saya bantu di area tersebut?"

---

### 4. System Prompt yang Harus Digunakan

```
Kamu adalah BizBot, asisten konsultan bisnis virtual dari platform BisnisMulai.

Tugasmu adalah membantu pengguna yang ingin memulai atau mengembangkan bisnis mereka di Indonesia. Kamu memiliki pengalaman 10 tahun sebagai konsultan bisnis dan berbicara dalam Bahasa Indonesia yang profesional, jelas, dan suportif.

ATURAN YANG WAJIB DIIKUTI:
1. Hanya jawab pertanyaan yang berkaitan dengan bisnis: validasi ide, perencanaan, keuangan (HPP, harga jual, break-even, cash flow), operasional, pemasaran, legal/perizinan, dan skalabilitas bisnis.
2. Jika pertanyaan di luar topik bisnis, tolak dengan sopan dan arahkan kembali ke topik bisnis.
3. Jawaban harus spesifik, praktis, dan bisa langsung diterapkan — bukan teori abstrak.
4. Jika pertanyaan membutuhkan data spesifik dari user (misalnya berapa HPP-nya), tanyakan dulu sebelum memberikan saran.
5. Jangan pernah memberikan saran yang bisa merugikan user secara finansial — selalu sertakan konteks risiko jika relevan.
6. Gunakan angka dan contoh nyata dalam jawaban jika memungkinkan (misalnya: "Jika HPP kamu Rp 20.000 dan target margin 40%, maka harga jual minimal adalah Rp 33.333").
7. Jika user sedang dalam fase tertentu (diketahui dari konteks), sesuaikan saran dengan fase tersebut.
8. Panjang jawaban: ringkas untuk pertanyaan sederhana (2-4 kalimat), detail untuk pertanyaan kompleks (dengan poin-poin terstruktur).
9. Akhiri setiap jawaban dengan satu pertanyaan lanjutan yang relevan untuk menggali kebutuhan user lebih dalam, KECUALI jika jawaban sudah sangat lengkap.
10. Bahasa: Bahasa Indonesia. Jangan campur dengan bahasa Inggris kecuali untuk istilah teknis bisnis yang umum (break-even, cash flow, margin, dll).
```

---

### 5. Spesifikasi Teknis

#### API Integration
- Gunakan **Google Gemini API** (`gemini-2.0-flash`) sebagai AI backend chatbot.
- Endpoint internal: `POST /api/chatbot/message`
- Request body:
```json
{
  "message": "string",
  "conversation_history": [
    { "role": "user", "parts": [{ "text": "string" }] },
    { "role": "model", "parts": [{ "text": "string" }] }
  ],
  "user_context": {
    "current_phase": 1,
    "business_type": "produk_fisik",
    "health_score": 65
  }
}
```
- Response:
```json
{
  "reply": "string",
  "suggested_questions": ["string", "string", "string"]
}
```

> **Perhatian format history Gemini:** Gemini menggunakan `role: "model"` (bukan `"assistant"`) dan format `parts: [{ text }]` (bukan `content: string`). Pastikan konversi format ini benar di frontend sebelum dikirim ke API.

#### Konteks User (Opsional tapi Direkomendasikan)
Jika user sudah login, kirimkan konteks bisnis mereka agar chatbot bisa memberikan saran yang lebih personal. Tambahkan ke system prompt secara dinamis:

```
Konteks pengguna saat ini:
- Fase bisnis aktif: Fase [current_phase]
- Jenis bisnis: [business_type]
- Business Health Score: [health_score]/100

Sesuaikan saranmu dengan kondisi bisnis pengguna ini.
```

#### Rate Limiting
- Maksimum **30 pesan per user per hari** (lebih longgar karena Gemini gratis).
- Simpan counter di tabel `chatbot_usage` di Supabase.
- Jika limit tercapai, tampilkan pesan: "Kamu telah mencapai batas chat hari ini. Batas akan reset besok pukul 00.00 WIB."

#### Riwayat Percakapan
- Simpan riwayat chat per sesi di `localStorage` (tidak perlu login).
- Untuk user yang login, simpan riwayat 30 hari terakhir di tabel `chatbot_sessions`.
- Maksimum context window yang dikirim ke API: **10 pesan terakhir**.

---

### 6. Skema Database Tambahan

```sql
-- Tabel riwayat sesi chat
CREATE TABLE chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  -- Format: [{role: 'user'|'model', parts: [{text: string}], timestamp: string}]
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel penggunaan harian (rate limiting)
CREATE TABLE chatbot_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- RLS: user hanya bisa akses datanya sendiri
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own chat sessions"
  ON chatbot_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access own usage data"
  ON chatbot_usage FOR ALL
  USING (auth.uid() = user_id);

-- Function untuk increment usage counter
CREATE OR REPLACE FUNCTION increment_chatbot_usage(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO chatbot_usage (user_id, date, message_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET message_count = chatbot_usage.message_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 7. Implementasi API Route (Lengkap)

```typescript
// src/app/api/chatbot/message/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Kamu adalah BizBot, asisten konsultan bisnis virtual dari platform BisnisMulai.

Tugasmu adalah membantu pengguna yang ingin memulai atau mengembangkan bisnis mereka di Indonesia. Kamu memiliki pengalaman 10 tahun sebagai konsultan bisnis dan berbicara dalam Bahasa Indonesia yang profesional, jelas, dan suportif.

ATURAN YANG WAJIB DIIKUTI:
1. Hanya jawab pertanyaan yang berkaitan dengan bisnis: validasi ide, perencanaan, keuangan (HPP, harga jual, break-even, cash flow), operasional, pemasaran, legal/perizinan, dan skalabilitas bisnis.
2. Jika pertanyaan di luar topik bisnis, tolak dengan sopan: "Pertanyaan ini di luar bidang saya. Saya adalah asisten bisnis — ada yang bisa saya bantu seputar bisnis kamu?"
3. Jawaban harus spesifik, praktis, dan bisa langsung diterapkan.
4. Gunakan angka dan contoh nyata jika memungkinkan.
5. Akhiri setiap jawaban dengan satu pertanyaan lanjutan yang relevan.
6. Bahasa: Bahasa Indonesia.`

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { message, conversation_history = [], user_context } = await req.json()

    // Validasi input
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong.' }, { status: 400 })
    }

    // Rate limiting (hanya untuk user yang login)
    if (user) {
      const { data: usage } = await supabase
        .from('chatbot_usage')
        .select('message_count')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .single()

      if (usage && usage.message_count >= 30) {
        return NextResponse.json(
          { error: 'Kamu telah mencapai batas chat hari ini. Batas akan reset besok pukul 00.00 WIB.' },
          { status: 429 }
        )
      }
    }

    // Build dynamic system prompt dengan konteks user
    let dynamicPrompt = SYSTEM_PROMPT
    if (user_context) {
      const phaseNames = ['', 'Validasi Ide', 'Bangun Sistem', 'Launch & Akuisisi', 'Skala & Tumbuh']
      dynamicPrompt += `\n\nKonteks pengguna saat ini:\n- Fase bisnis aktif: Fase ${user_context.current_phase} (${phaseNames[user_context.current_phase] || '-'})\n- Jenis bisnis: ${user_context.business_type}\n- Business Health Score: ${user_context.health_score}/100\n\nSesuaikan saranmu dengan kondisi bisnis pengguna ini.`
    }

    // Inisialisasi model Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: dynamicPrompt,
    })

    // Ambil 10 pesan terakhir untuk context window
    const recentHistory = conversation_history.slice(-10)

    // Mulai chat dengan history
    const chat = model.startChat({
      history: recentHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    })

    // Kirim pesan dan tunggu respons
    const result = await chat.sendMessage(message)
    const reply = result.response.text()

    // Update rate limit counter
    if (user) {
      await supabase.rpc('increment_chatbot_usage', { p_user_id: user.id })

      // Simpan sesi chat ke database
      await supabase.from('chatbot_sessions').upsert({
        user_id: user.id,
        messages: [
          ...recentHistory,
          { role: 'user', parts: [{ text: message }], timestamp: new Date().toISOString() },
          { role: 'model', parts: [{ text: reply }], timestamp: new Date().toISOString() },
        ],
        updated_at: new Date().toISOString(),
      })
    }

    // Generate suggested questions berdasarkan topik pesan
    const suggested_questions = generateSuggestedQuestions(message)

    return NextResponse.json({ reply, suggested_questions })

  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { error: 'Maaf, terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

// Helper: generate suggested questions berdasarkan kata kunci
function generateSuggestedQuestions(message: string): string[] {
  const msg = message.toLowerCase()

  if (msg.includes('hpp') || msg.includes('harga') || msg.includes('jual')) {
    return [
      'Bagaimana cara menentukan margin keuntungan yang sehat?',
      'Apa itu biaya overhead dan bagaimana cara menghitungnya?',
      'Kapan sebaiknya saya menaikkan harga jual?',
    ]
  }
  if (msg.includes('modal') || msg.includes('cash flow') || msg.includes('keuangan')) {
    return [
      'Bagaimana cara membuat proyeksi cash flow 6 bulan?',
      'Kapan bisnis saya bisa dibilang break-even?',
      'Apa tanda-tanda bisnis saya butuh modal tambahan?',
    ]
  }
  if (msg.includes('legal') || msg.includes('pt') || msg.includes('cv') || msg.includes('izin')) {
    return [
      'Apa perbedaan PT dan CV untuk bisnis kecil?',
      'Apa itu NIB dan bagaimana cara mengurusnya?',
      'Kewajiban pajak apa yang harus saya penuhi sebagai UMKM?',
    ]
  }
  if (msg.includes('marketing') || msg.includes('pelanggan') || msg.includes('penjualan')) {
    return [
      'Bagaimana cara mendapatkan 10 pelanggan pertama?',
      'Strategi pricing mana yang cocok untuk bisnis saya?',
      'Bagaimana cara mengukur efektivitas pemasaran saya?',
    ]
  }

  // Default suggested questions
  return [
    'Bagaimana cara menghitung HPP produk saya?',
    'Apa langkah pertama untuk memvalidasi ide bisnis?',
    'Bagaimana cara membuat SOP sederhana untuk bisnis kecil?',
  ]
}
```

---

### 8. Custom Hook untuk State Management

```typescript
// src/hooks/useChatbot.ts
import { useState, useCallback } from 'react'

interface Message {
  role: 'user' | 'model'
  parts: [{ text: string }]
  timestamp: string
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export function useChatbot() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  })

  const sendMessage = useCallback(async (text: string, userContext?: object) => {
    if (!text.trim() || state.isLoading) return

    const userMessage: Message = {
      role: 'user',
      parts: [{ text }],
      timestamp: new Date().toISOString(),
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation_history: state.messages,
          user_context: userContext,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan.')
      }

      const botMessage: Message = {
        role: 'model',
        parts: [{ text: data.reply }],
        timestamp: new Date().toISOString(),
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
      }))

      return data.suggested_questions as string[]

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Terjadi kesalahan. Coba lagi.',
      }))
    }
  }, [state.messages, state.isLoading])

  const clearMessages = useCallback(() => {
    setState({ messages: [], isLoading: false, error: null })
  }, [])

  return { ...state, sendMessage, clearMessages }
}
```

---

### 9. Struktur File yang Perlu Dibuat

```
src/
  app/
    api/
      chatbot/
        message/
          route.ts              ← API endpoint handler (kode lengkap ada di atas)
  components/
    chatbot/
      ChatbotWidget.tsx         ← Floating button + container utama
      ChatWindow.tsx            ← Jendela chat (header, messages, input)
      MessageBubble.tsx         ← Komponen satu pesan (user/bot)
      TypingIndicator.tsx       ← Animasi 3 titik bergerak
      SuggestedQuestions.tsx    ← Chip pertanyaan lanjutan
      EmptyState.tsx            ← Tampilan saat chat pertama dibuka
  hooks/
    useChatbot.ts               ← Custom hook (kode lengkap ada di atas)
  types/
    chatbot.ts                  ← TypeScript interfaces
```

---

### 10. Spesifikasi UI Chatbot

#### Posisi & Trigger
- **Widget:** floating button pojok kanan bawah layar, muncul di semua halaman setelah login.
- **Animasi:** slide-up saat dibuka, slide-down saat ditutup (Framer Motion).

#### Tampilan Chat Window
- **Ukuran:** 380px lebar × 520px tinggi (desktop). Full screen di mobile.
- **Header:** nama "BizBot", subtitle "Asisten Bisnis AI • Online", tombol minimize dan close.
- **Pesan user:** rata kanan, background accent hijau (`accent.primary`).
- **Pesan BizBot:** rata kiri, background card (`background.secondary`).
- **Typing indicator:** animasi 3 titik saat menunggu respons.
- **Suggested questions:** 3 chip di bawah setiap respons BizBot.
- **Input:** textarea + tombol kirim. Enter = kirim, Shift+Enter = baris baru.

#### Pesan Sambutan (Empty State)
```
👋 Halo! Saya BizBot, asisten bisnis kamu.

Saya bisa membantu kamu dengan:
• Menghitung HPP dan harga jual produk
• Merencanakan strategi bisnis kamu
• Memahami kewajiban legal dan perizinan
• Menganalisis cash flow dan break-even

Mau mulai dari mana?
```

**Starter questions:**
1. "Bagaimana cara menghitung harga jual yang tepat?"
2. "Apa perbedaan CV dan PT untuk bisnis saya?"
3. "Bisnis saya baru mulai, dari mana harus mulai?"
4. "Bagaimana cara tahu bisnis saya sudah break-even?"

#### Dark/Light Mode
Ikuti tema aktif platform menggunakan CSS variables yang sudah ada di design system.

---

### 11. Environment Variable

Tambahkan ke `.env.local`:

```env
# Google Gemini API (GRATIS - https://aistudio.google.com)
GEMINI_API_KEY=your_api_key_here
```

> **PENTING:** Jangan beri prefix `NEXT_PUBLIC_` pada `GEMINI_API_KEY`. Key ini hanya boleh digunakan di server-side (route handler). Jika ter-expose ke browser, siapapun bisa menggunakan quota gratis kamu.

---

### 12. Checklist Implementasi

- [ ] `GEMINI_API_KEY` sudah ditambahkan ke `.env.local` dan Vercel environment variables
- [ ] Package `@google/generative-ai` sudah di-install (`npm install @google/generative-ai`)
- [ ] API route `/api/chatbot/message` berfungsi dan mengembalikan respons
- [ ] Chatbot HANYA menjawab topik bisnis (test dengan pertanyaan off-topic)
- [ ] Format history Gemini sudah benar (`role: "model"`, bukan `"assistant"`)
- [ ] Konteks user dikirim ke API jika user sudah login
- [ ] Rate limiting 30 pesan/hari berfungsi
- [ ] Riwayat chat tersimpan di localStorage dan database (user login)
- [ ] Tabel `chatbot_sessions` dan `chatbot_usage` sudah dibuat di Supabase
- [ ] RLS aktif di kedua tabel tersebut
- [ ] Function `increment_chatbot_usage` sudah dibuat di Supabase
- [ ] Widget floating button muncul di semua halaman setelah login
- [ ] Animasi buka/tutup berfungsi dengan Framer Motion
- [ ] Typing indicator muncul saat menunggu respons
- [ ] Suggested questions muncul setelah setiap respons BizBot
- [ ] Empty state dengan pesan sambutan dan 4 starter questions
- [ ] Dark/light mode mengikuti tema platform
- [ ] Fully responsive di mobile (375px ke atas)
- [ ] Error handling: tampilkan pesan ramah jika API gagal

---

*Prompt ini adalah bagian dari PRD BisnisMulai v1.0 — Fitur Chatbot Bisnis AI (Gemini API - Gratis)*
