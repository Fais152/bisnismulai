"use client";

import { motion, Variants } from "framer-motion";
import { CalendarDays, Clock, Star, MessageSquare, Video } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

const consultants = [
  {
    name: "Rizky Pratama, S.E.",
    expertise: ["Keuangan Bisnis", "Perpajakan UMKM"],
    rating: 4.9,
    sessions: 127,
    available: true,
    initials: "RP",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Sari Dewi, M.M.",
    expertise: ["Strategi Pemasaran", "Branding"],
    rating: 4.8,
    sessions: 89,
    available: true,
    initials: "SD",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Budi Santoso, S.H.",
    expertise: ["Legalitas Usaha", "Kontrak Bisnis"],
    rating: 5.0,
    sessions: 64,
    available: false,
    initials: "BS",
    color: "from-orange-500 to-red-500",
  },
];

const slots = [
  { day: "Senin, 5 Mei", times: ["09.00", "11.00", "14.00"] },
  { day: "Selasa, 6 Mei", times: ["10.00", "13.00"] },
  { day: "Rabu, 7 Mei", times: ["09.00", "15.00", "16.00"] },
];

export default function KonsultasiPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-10">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Konsultasi Bisnis</h1>
        <p className="text-muted-foreground mt-2">
          Konsultasi 1-on-1 dengan mentor bisnis berpengalaman sesuai kebutuhan spesifik Anda.
        </p>
      </motion.div>

      {/* How it works */}
      <motion.div variants={item} className="glass-panel rounded-2xl p-6">
        <h2 className="font-bold mb-4">Cara Kerja</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "1", icon: "🧑‍💼", title: "Pilih Konsultan", desc: "Pilih berdasarkan keahlian yang paling sesuai kebutuhan bisnis Anda." },
            { step: "2", icon: "📅", title: "Booking Jadwal", desc: "Pilih slot waktu yang tersedia dan isi ringkasan masalah bisnis Anda." },
            { step: "3", icon: "🎯", title: "Sesi via Video", desc: "Ikuti sesi 60 menit 1-on-1 dan dapatkan rekomendasi langsung dari ahlinya." },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center gap-3">
              <span className="text-4xl">{s.icon}</span>
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Consultants */}
      <motion.section variants={item}>
        <h2 className="text-lg font-bold mb-5">Pilih Konsultan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {consultants.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-2xl p-5 flex flex-col gap-4 group hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {c.initials}
                </div>
                <div>
                  <p className="font-bold text-sm">{c.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium">{c.rating}</span>
                    <span className="text-xs text-muted-foreground">· {c.sessions} sesi</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {c.expertise.map((e) => (
                  <span key={e} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{e}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                <span className={`flex items-center gap-1.5 text-xs font-medium ${c.available ? "text-emerald-500" : "text-muted-foreground"}`}>
                  <span className={`w-2 h-2 rounded-full ${c.available ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
                  {c.available ? "Tersedia" : "Tidak Tersedia"}
                </span>
                <button
                  disabled={!c.available}
                  onClick={() => alert("Sistem Booking sedang dalam pengembangan.")}
                  className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Booking
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Jadwal Tersedia */}
      <motion.section variants={item}>
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" /> Jadwal Tersedia Minggu Ini
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {slots.map((slot, i) => (
            <div key={i} className="glass-panel rounded-2xl p-5">
              <p className="font-semibold text-sm mb-3">{slot.day}</p>
              <div className="flex flex-wrap gap-2">
                {slot.times.map((time) => (
                  <button
                    key={time}
                    onClick={() => alert("Sistem Booking sedang dalam pengembangan.")}
                    className="flex items-center gap-1.5 text-sm border border-border/50 hover:border-primary hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Clock className="h-3.5 w-3.5" /> {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Riwayat Sesi */}
      <motion.section variants={item} className="glass-panel rounded-2xl p-6">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" /> Riwayat Konsultasi
        </h2>
        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
          <Video className="h-12 w-12 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm">Belum ada sesi konsultasi yang telah selesai.</p>
          <p className="text-xs text-muted-foreground">Booking sesi pertama Anda untuk memulai!</p>
        </div>
      </motion.section>
    </motion.div>
  );
}
