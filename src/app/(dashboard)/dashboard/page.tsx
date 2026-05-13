"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, TrendingUp, ArrowRight, Activity, Circle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

interface DashboardData {
  currentPhase: number;
  userName: string;
  toolStatus: {
    hpp: boolean;
    breakEven: boolean;
    sop: boolean;
    cashflow: boolean;
    hppMarginLow: boolean; // true jika ada produk dengan margin < 20%
  };
  loading: boolean;
}

const PHASE_TITLES = [
  "", // index 0 unused
  "Validasi Ide & Riset Pasar",
  "Bangun Sistem Bisnis",
  "Akuisisi Pelanggan Pertama",
  "Optimasi & Skalabilitas",
];

const PHASE_CHECKLISTS: Record<number, { label: string; toolKey?: keyof DashboardData["toolStatus"] | null; href?: string }[]> = {
  1: [
    { label: "Identifikasi masalah yang ingin diselesaikan" },
    { label: "Riset kompetitor (minimal 3 kompetitor)" },
    { label: "Tentukan target pelanggan (buyer persona)" },
    { label: "Lakukan 5 wawancara calon pelanggan" },
  ],
  2: [
    { label: "Hitung HPP & Harga Jual", toolKey: "hpp", href: "/tools/hpp" },
    { label: "Analisis titik impas (Break-Even)", toolKey: "breakEven", href: "/tools/break-even" },
    { label: "Buat SOP Layanan Pelanggan", toolKey: "sop", href: "/tools/sop" },
    { label: "Tentukan Struktur Legal Usaha" },
  ],
  3: [
    { label: "Buat konten pemasaran perdana" },
    { label: "Setup saluran media sosial bisnis" },
    { label: "Kampanye pre-order / soft launch" },
    { label: "Closing 10 transaksi pertama" },
  ],
  4: [
    { label: "Analisis data penjualan & feedback" },
    { label: "Proyeksi pertumbuhan (Cash Flow)", toolKey: "cashflow", href: "/tools/cashflow" },
    { label: "Optimasi produk/layanan" },
    { label: "Rekrut tim atau mitra pertama" },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    currentPhase: 1,
    userName: "Pengusaha",
    toolStatus: { hpp: false, breakEven: false, sop: false, cashflow: false, hppMarginLow: false },
    loading: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Profile
        const profileRes = await fetch("/api/user/profile", { cache: "no-store" });
        const { data: profile } = await profileRes.json();
        const currentPhase = profile?.current_phase ?? 1;
        const userName = profile?.full_name || "Pengusaha";

        // 2. Tool statuses in parallel
        const [hppRes, beRes, sopRes, cfRes] = await Promise.all([
          fetch("/api/tools/hpp", { cache: "no-store" }),
          fetch("/api/tools/break-even", { cache: "no-store" }),
          fetch("/api/tools/sop", { cache: "no-store" }),
          fetch("/api/tools/cashflow", { cache: "no-store" }),
        ]);
        const [hppJson, beJson, sopJson, cfJson] = await Promise.all([
          hppRes.json(), beRes.json(), sopRes.json(), cfRes.json(),
        ]);

        const hppDone = Array.isArray(hppJson.data?.produkList) && hppJson.data.produkList.length > 0;
        const beDone = !!(beJson.data && Object.keys(beJson.data).length > 0);
        const sopDone = !!(sopJson.data && Object.keys(sopJson.data).length > 0);
        const cfDone = !!(cfJson.data && Object.keys(cfJson.data).length > 0);

        // Check if any HPP product has low margin (< 20%)
        let hppMarginLow = false;
        if (hppDone) {
          const products = hppJson.data.produkList;
          hppMarginLow = products.some((p: any) => p.targetMargin < 20);
        }

        setData({
          currentPhase,
          userName,
          toolStatus: { hpp: hppDone, breakEven: beDone, sop: sopDone, cashflow: cfDone, hppMarginLow },
          loading: false,
        });
      } catch (e) {
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    load();
  }, []);

  const { currentPhase, userName, toolStatus, loading } = data;

  // Calculate health score (0-100) based on tool completion + phase
  const toolsCompleted = [toolStatus.hpp, toolStatus.breakEven, toolStatus.sop, toolStatus.cashflow].filter(Boolean).length;
  const healthScore = Math.min(100, Math.round(((currentPhase - 1) / 4) * 50 + (toolsCompleted / 4) * 50));
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  // Phase progress
  const checklist = PHASE_CHECKLISTS[currentPhase] ?? [];
  const completedItems = checklist.filter(c => {
    if (!c.toolKey) return false; // manual tasks not tracked here
    return toolStatus[c.toolKey as keyof typeof toolStatus];
  });
  const phaseProgressPct = checklist.length > 0
    ? Math.round((completedItems.length / checklist.length) * 100)
    : 0;

  const tools = [
    { name: "Kalkulator HPP", desc: "Hitung biaya produksi per produk", status: toolStatus.hpp, href: "/tools/hpp" },
    { name: "Break-Even Analysis", desc: "Simulasi target penjualan", status: toolStatus.breakEven, href: "/tools/break-even" },
    { name: "SOP Builder", desc: "Buat prosedur operasional standar", status: toolStatus.sop, href: "/tools/sop" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang, <span className="text-primary">{userName}</span>!
          </h1>
          <p className="text-muted-foreground mt-1">
            Berikut adalah ringkasan performa dan tugas Anda hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Health Score</span>
              <span className="font-bold text-foreground text-sm">
                Status:{" "}
                <span className={cn(
                  healthScore >= 70 ? "text-emerald-500" : healthScore >= 40 ? "text-amber-500" : "text-primary"
                )}>
                  {healthScore >= 70 ? "Sehat" : healthScore >= 40 ? "Berkembang" : "Mulai"}
                </span>
              </span>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/30" />
                <motion.circle
                  cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
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

      {/* Alert: Margin Low — only when HPP data has low margin product */}
      {toolStatus.hppMarginLow && (
        <motion.div variants={item} className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex gap-4 items-start relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
          <AlertTriangle className="text-destructive h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-destructive">Perhatian: Margin Menipis</h4>
            <p className="text-sm text-destructive/90 mt-1">
              Berdasarkan data HPP Anda, ada produk dengan margin di bawah 20%. Pertimbangkan untuk evaluasi harga jual atau tekan biaya bahan baku.
            </p>
            <Link href="/tools/hpp" className="text-sm font-medium text-destructive hover:underline mt-2 inline-flex items-center gap-1 group">
              Buka Kalkulator HPP <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Phase Progress — connected to real current_phase */}
      <motion.section variants={item}>
        <h2 className="text-xl font-bold mb-4">
          Roadmap Saat Ini: Fase {currentPhase}
          {currentPhase <= 4 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">— {PHASE_TITLES[currentPhase]}</span>
          )}
        </h2>
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4 w-full">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {PHASE_TITLES[currentPhase] || "Roadmap Selesai"}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {currentPhase === 1 && "Pastikan ide bisnis Anda benar-benar dibutuhkan pasar."}
                  {currentPhase === 2 && "Hitung keuangan dasar dan bangun fondasi operasional."}
                  {currentPhase === 3 && "Dapatkan 10 pelanggan pertama dengan strategi organik."}
                  {currentPhase === 4 && "Perbaiki proses berdasarkan feedback dan skalakan bisnis."}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress Fase {currentPhase}</span>
                  <span className="text-primary font-bold">{phaseProgressPct}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${phaseProgressPct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto bg-background/50 border border-border/50 rounded-xl p-4 min-w-[250px] backdrop-blur-sm">
              <h4 className="font-semibold text-sm mb-3">Checklist Fase {currentPhase}:</h4>
              <ul className="space-y-2 text-sm">
                {checklist.map((c, i) => {
                  const done = c.toolKey ? !!toolStatus[c.toolKey as keyof typeof toolStatus] : false;
                  return (
                    <li key={i} className="flex items-center gap-2">
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={cn("transition-colors", done ? "text-muted-foreground line-through" : "text-foreground font-medium")}>
                        {c.href ? (
                          <Link href={c.href} className="hover:text-primary transition-colors">{c.label}</Link>
                        ) : c.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/roadmap"
                className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all block text-center"
              >
                Lihat Roadmap Lengkap
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Tools */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tools Bisnis</h2>
          <Link href="/tools" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group">
            Lihat Semua <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <Link href={tool.href} key={i}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-panel rounded-xl p-5 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] transition-all h-full cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                  {tool.status ? (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                      ✓ Selesai
                    </span>
                  ) : (
                    <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                      Belum dimulai
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
                <div className={cn("mt-3 text-xs font-medium", tool.status ? "text-emerald-500" : "text-primary")}>
                  {tool.status ? "Data tersimpan →" : "Mulai sekarang →"}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
