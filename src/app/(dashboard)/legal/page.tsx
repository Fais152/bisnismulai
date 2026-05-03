"use client";

import { motion, Variants } from "framer-motion";
import { FileText, Download, ExternalLink, ChevronRight, ShieldCheck, Landmark, Scroll } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

const sopTemplates = [
  { title: "SOP Layanan Pelanggan", desc: "Panduan standar respons terhadap pertanyaan, keluhan, dan pengembalian produk.", category: "Operasional", icon: "📞" },
  { title: "SOP Proses Produksi", desc: "Alur kerja produksi dari bahan baku hingga produk jadi siap kirim.", category: "Produksi", icon: "⚙️" },
  { title: "SOP Onboarding Karyawan", desc: "Langkah-langkah memperkenalkan dan melatih karyawan/mitra baru.", category: "SDM", icon: "🤝" },
  { title: "SOP Pengelolaan Keuangan", desc: "Prosedur pencatatan pemasukan, pengeluaran, dan rekonsiliasi bulanan.", category: "Keuangan", icon: "💰" },
];

const legalItems = [
  {
    icon: Landmark,
    title: "Struktur Badan Usaha",
    desc: "Pilih antara Usaha Perseorangan, CV, atau PT sesuai skala bisnis Anda. Masing-masing memiliki konsekuensi hukum dan pajak yang berbeda.",
    action: "Lihat Panduan",
    tag: "Penting",
    tagColor: "bg-destructive/10 text-destructive",
  },
  {
    icon: Scroll,
    title: "Izin Usaha (NIB)",
    desc: "Nomor Induk Berusaha (NIB) adalah identitas resmi usaha Anda. Daftarkan secara gratis melalui OSS (Online Single Submission).",
    action: "Buka OSS",
    tag: "Wajib",
    tagColor: "bg-destructive/10 text-destructive",
  },
  {
    icon: ShieldCheck,
    title: "Hak Kekayaan Intelektual",
    desc: "Lindungi merek, logo, dan karya intelektual bisnis Anda dengan mendaftarkan merek dagang ke Dirjen KI.",
    action: "Lihat Info",
    tag: "Disarankan",
    tagColor: "bg-primary/10 text-primary",
  },
];

export default function LegalPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-10">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">SOP &amp; Legal</h1>
        <p className="text-muted-foreground mt-2">
          Template SOP siap pakai dan panduan aspek hukum untuk bisnis Anda.
        </p>
      </motion.div>

      {/* SOP Section */}
      <motion.section variants={item}>
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Template SOP
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Template siap pakai, bisa langsung disesuaikan dengan bisnis Anda.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sopTemplates.map((sop, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="glass-panel rounded-2xl p-5 cursor-pointer group hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)] transition-all"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{sop.icon}</span>
                <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">{sop.category}</span>
              </div>
              <h3 className="font-bold mt-3 group-hover:text-primary transition-colors">{sop.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{sop.desc}</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => alert("Fitur unduh template PDF/Word segera hadir!")} className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                  <Download className="h-3.5 w-3.5" /> Unduh Template
                </button>
                <a href="/tools/sop" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" /> Buka di SOP Builder
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Legal Section */}
      <motion.section variants={item}>
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Aspek Hukum &amp; Legalitas
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Pastikan bisnis Anda beroperasi secara legal sejak awal.
        </p>
        <div className="space-y-4">
          {legalItems.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4 }}
              className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 group cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${item.tagColor}`}>{item.tag}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <button onClick={() => alert("Membuka tautan eksternal...")} className="flex items-center gap-1.5 text-sm font-medium text-primary shrink-0 group-hover:underline">
                {item.action} <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
