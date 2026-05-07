import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `Kamu adalah BizBot, asisten konsultan bisnis virtual dari platform BisnisMulai.

Tugasmu adalah membantu pengguna yang ingin memulai atau mengembangkan bisnis mereka di Indonesia. Kamu memiliki pengalaman 10 tahun sebagai konsultan bisnis dan berbicara dalam Bahasa Indonesia yang profesional, jelas, dan suportif.

ATURAN YANG WAJIB DIIKUTI:
1. Hanya jawab pertanyaan yang berkaitan dengan bisnis: validasi ide, perencanaan, keuangan (HPP, harga jual, break-even, cash flow), operasional, pemasaran, legal/perizinan, dan skalabilitas bisnis.
2. Jika pertanyaan di luar topik bisnis, tolak dengan sopan: "Pertanyaan ini di luar bidang saya. Saya adalah asisten bisnis — ada yang bisa saya bantu seputar bisnis kamu?"
3. Jawaban harus spesifik, praktis, dan bisa langsung diterapkan — bukan teori abstrak.
4. Jika pertanyaan membutuhkan data spesifik dari user (misalnya berapa HPP-nya), tanyakan dulu sebelum memberikan saran.
5. Jangan pernah memberikan saran yang bisa merugikan user secara finansial — selalu sertakan konteks risiko jika relevan.
6. Gunakan angka dan contoh nyata dalam jawaban jika memungkinkan (misalnya: "Jika HPP kamu Rp 20.000 dan target margin 40%, maka harga jual minimal adalah Rp 33.333").
7. Jika user sedang dalam fase tertentu (diketahui dari konteks), sesuaikan saran dengan fase tersebut.
8. Panjang jawaban: ringkas untuk pertanyaan sederhana (2-4 kalimat), detail untuk pertanyaan kompleks (dengan poin-poin terstruktur).
9. Akhiri setiap jawaban dengan satu pertanyaan lanjutan yang relevan untuk menggali kebutuhan user lebih dalam, KECUALI jika jawaban sudah sangat lengkap.
10. Bahasa: Bahasa Indonesia. Jangan campur dengan bahasa Inggris kecuali untuk istilah teknis bisnis yang umum (break-even, cash flow, margin, dll).`;

const PHASE_NAMES = ["", "Validasi Ide", "Bangun Sistem", "Launch & Akuisisi", "Skala & Tumbuh"];

function generateSuggestedQuestions(message: string): string[] {
  const msg = message.toLowerCase();

  if (msg.includes("hpp") || msg.includes("harga") || msg.includes("jual")) {
    return [
      "Bagaimana cara menentukan margin keuntungan yang sehat?",
      "Apa itu biaya overhead dan bagaimana cara menghitungnya?",
      "Kapan sebaiknya saya menaikkan harga jual?",
    ];
  }
  if (msg.includes("modal") || msg.includes("cash flow") || msg.includes("keuangan")) {
    return [
      "Bagaimana cara membuat proyeksi cash flow 6 bulan?",
      "Kapan bisnis saya bisa dibilang break-even?",
      "Apa tanda-tanda bisnis saya butuh modal tambahan?",
    ];
  }
  if (msg.includes("legal") || msg.includes("pt") || msg.includes("cv") || msg.includes("izin") || msg.includes("nib")) {
    return [
      "Apa perbedaan PT dan CV untuk bisnis kecil?",
      "Apa itu NIB dan bagaimana cara mengurusnya?",
      "Kewajiban pajak apa yang harus saya penuhi sebagai UMKM?",
    ];
  }
  if (msg.includes("marketing") || msg.includes("pelanggan") || msg.includes("penjualan") || msg.includes("promosi")) {
    return [
      "Bagaimana cara mendapatkan 10 pelanggan pertama?",
      "Strategi pricing mana yang cocok untuk bisnis saya?",
      "Bagaimana cara mengukur efektivitas pemasaran saya?",
    ];
  }
  if (msg.includes("sop") || msg.includes("operasional") || msg.includes("sistem")) {
    return [
      "Bagaimana cara membuat SOP sederhana untuk bisnis kecil?",
      "Apa tools gratis untuk manajemen operasional bisnis?",
      "Kapan saya perlu rekrut karyawan pertama?",
    ];
  }

  return [
    "Bagaimana cara menghitung HPP produk saya?",
    "Apa langkah pertama untuk memvalidasi ide bisnis?",
    "Bagaimana cara membuat SOP sederhana untuk bisnis kecil?",
  ];
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { message, conversation_history = [], user_context } = await req.json();

    // Validasi input
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    // Rate limiting (hanya untuk user yang login)
    if (user) {
      const today = new Date().toISOString().split("T")[0];
      const { data: usage } = await supabase
        .from("chatbot_usage")
        .select("message_count")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (usage && usage.message_count >= 30) {
        return NextResponse.json(
          { error: "Kamu telah mencapai batas chat hari ini. Batas akan reset besok pukul 00.00 WIB." },
          { status: 429 }
        );
      }
    }

    // Build dynamic system prompt dengan konteks user
    let dynamicPrompt = SYSTEM_PROMPT;
    if (user_context) {
      dynamicPrompt += `\n\nKonteks pengguna saat ini:\n- Fase bisnis aktif: Fase ${user_context.current_phase} (${PHASE_NAMES[user_context.current_phase] || "-"})\n- Jenis bisnis: ${user_context.business_type}\n- Business Health Score: ${user_context.health_score}/100\n\nSesuaikan saranmu dengan kondisi bisnis pengguna ini.`;
    }

    // Inisialisasi model Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: dynamicPrompt,
    });

    // Ambil 10 pesan terakhir untuk context window
    const recentHistory = conversation_history.slice(-10);

    // Mulai chat dengan history
    const chat = model.startChat({
      history: recentHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    // Kirim pesan dan tunggu respons dari Gemini
    const geminiResult = await chat.sendMessage(message);
    const reply = geminiResult.response.text();

    // Simpan ke DB secara non-blocking (jangan crash jika tabel belum ada)
    if (user) {
      try {
        await supabase.rpc("increment_chatbot_usage", { p_user_id: user.id });

        const { data: existing } = await supabase
          .from("chatbot_sessions")
          .select("id")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const newMessages = [
          ...recentHistory,
          { role: "user", parts: [{ text: message }], timestamp: new Date().toISOString() },
          { role: "model", parts: [{ text: reply }], timestamp: new Date().toISOString() },
        ];

        if (existing?.id) {
          await supabase
            .from("chatbot_sessions")
            .update({ messages: newMessages, updated_at: new Date().toISOString() })
            .eq("id", existing.id);
        } else {
          await supabase.from("chatbot_sessions").insert({
            user_id: user.id,
            messages: newMessages,
          });
        }
      } catch (dbErr) {
        console.warn("Chatbot DB save warning (non-fatal):", dbErr);
      }
    }

    const suggested_questions = generateSuggestedQuestions(message);
    return NextResponse.json({ reply, suggested_questions });

  } catch (error: any) {
    const errMsg = error?.message ?? String(error);
    console.error("Chatbot error detail:", errMsg);

    // Handle Gemini quota exceeded (429)
    if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Too Many Requests')) {
      return NextResponse.json(
        { error: "⚠️ Batas penggunaan API AI sedang tercapai. Silakan coba lagi dalam beberapa menit, atau tunggu hingga pukul 07.00 WIB besok untuk reset harian." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Maaf, terjadi kesalahan teknis. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
