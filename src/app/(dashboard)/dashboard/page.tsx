"use client";

import { CheckCircle2, AlertTriangle, TrendingUp, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const healthScore = 85;
  const circumference = 2 * Math.PI * 20; // r=20
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, Pengusaha!</h1>
          <p className="text-muted-foreground mt-1">
            Berikut adalah ringkasan performa dan tugas Anda hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Health Score</span>
              <span className="font-bold text-foreground text-sm">Status: <span className="text-primary">Sehat</span></span>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-muted/30"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-bold">{healthScore}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alert Section */}
      <motion.div variants={item} className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex gap-4 items-start relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
        <AlertTriangle className="text-destructive h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-destructive">Perhatian: Margin Menipis</h4>
          <p className="text-sm text-destructive/90 mt-1">
            Berdasarkan input HPP terakhir, margin produk Anda turun di bawah 20%. Pertimbangkan untuk evaluasi harga jual atau tekan biaya bahan baku.
          </p>
          <Link href="/tools/hpp" className="text-sm font-medium text-destructive hover:underline mt-2 inline-flex items-center gap-1 group">
            Buka Kalkulator HPP <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Phase Progress */}
      <motion.section variants={item}>
        <h2 className="text-xl font-bold mb-4">Roadmap Saat Ini: Fase 2</h2>
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" /> Bangun Sistem Bisnis
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Selesaikan perhitungan dasar dan struktur legal sebelum melangkah ke strategi akuisisi pelanggan.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress Fase 2</span>
                  <span className="text-primary font-bold">50%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto bg-background/50 border border-border/50 rounded-xl p-4 min-w-[250px] backdrop-blur-sm">
              <h4 className="font-semibold text-sm mb-3">Checklist Tersisa:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="line-through">Hitung HPP</span>
                </li>
                <li className="flex items-center gap-2 text-foreground font-medium group/item cursor-pointer">
                  <div className="h-4 w-4 rounded-full border-2 border-primary group-hover/item:bg-primary/20 transition-colors" />
                  Buat SOP Dasar
                </li>
                <li className="flex items-center gap-2 text-foreground font-medium group/item cursor-pointer">
                  <div className="h-4 w-4 rounded-full border-2 border-primary group-hover/item:bg-primary/20 transition-colors" />
                  Tentukan Struktur Legal
                </li>
              </ul>
              <Link href="/roadmap" className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all block text-center">
                Lanjutkan Fase
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Tools */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tools Terakhir Digunakan</h2>
          <Link href="/tools" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group">
            Lihat Semua <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Kalkulator HPP", desc: "Perbarui biaya produksi Anda", updated: "2 hari yang lalu", href: "/tools/hpp" },
            { name: "Break-Even Analysis", desc: "Simulasi target penjualan", updated: "1 minggu yang lalu", href: "/tools/break-even" },
            { name: "SOP Builder", desc: "SOP Layanan Pelanggan", updated: "Belum dimulai", href: "/tools/sop" }
          ].map((tool, i) => (
            <Link href={tool.href} key={i}>
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-panel rounded-xl p-5 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] transition-all h-full cursor-pointer group"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{tool.desc}</p>
                <div className="text-xs text-muted-foreground/80 font-medium">
                  {tool.updated}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
