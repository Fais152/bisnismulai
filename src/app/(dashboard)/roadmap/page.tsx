"use client";

import { useState, useEffect } from "react";

import { motion, Variants } from "framer-motion";
import { CheckCircle2, Lock, Circle, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

const phases = [
  {
    number: 1,
    title: "Validasi Ide & Riset Pasar",
    description: "Pastikan ide bisnis Anda benar-benar dibutuhkan pasar sebelum berinvestasi lebih jauh.",
    status: "completed",
    tasks: [
      { label: "Identifikasi masalah yang ingin diselesaikan", done: true },
      { label: "Riset kompetitor (minimal 3 kompetitor)", done: true },
      { label: "Tentukan target pelanggan (buyer persona)", done: true },
      { label: "Lakukan 5 wawancara calon pelanggan", done: true },
    ],
    duration: "2-4 Minggu",
  },
  {
    number: 2,
    title: "Bangun Sistem Bisnis",
    description: "Hitung keuangan dasar dan bangun fondasi operasional sebelum mulai berjualan.",
    status: "active",
    tasks: [
      { label: "Hitung HPP & Harga Jual (Kalkulator HPP)", done: true },
      { label: "Analisis titik impas (Break-Even)", done: false },
      { label: "Buat SOP Layanan Pelanggan", done: false },
      { label: "Tentukan Struktur Legal Usaha", done: false },
    ],
    duration: "4-6 Minggu",
  },
  {
    number: 3,
    title: "Akuisisi Pelanggan Pertama",
    description: "Dapatkan 10 pelanggan pertama Anda menggunakan strategi pemasaran organik berbiaya rendah.",
    status: "locked",
    tasks: [
      { label: "Buat konten pemasaran perdana", done: false },
      { label: "Setup saluran media sosial bisnis", done: false },
      { label: "Kampanye pre-order / soft launch", done: false },
      { label: "Closing 10 transaksi pertama", done: false },
    ],
    duration: "4-8 Minggu",
  },
  {
    number: 4,
    title: "Optimasi & Skalabilitas",
    description: "Perbaiki proses berdasarkan feedback pelanggan nyata dan mulai skalakan bisnis.",
    status: "locked",
    tasks: [
      { label: "Analisis data penjualan & feedback", done: false },
      { label: "Optimasi produk/layanan", done: false },
      { label: "Rekrut tim atau mitra pertama", done: false },
      { label: "Proyeksi pertumbuhan 6 bulan ke depan", done: false },
    ],
    duration: "8-12 Minggu",
  },
];

const statusConfig = {
  completed: { icon: CheckCircle2, label: "Selesai", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  active: { icon: Zap, label: "Berjalan", color: "text-primary", bg: "bg-primary/10", border: "border-primary/40" },
  locked: { icon: Lock, label: "Terkunci", color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border/40" },
};

export default function RoadmapPage() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile")
      .then(r => r.json())
      .then(({ data }) => {
        if (data?.current_phase) {
          setCurrentPhase(data.current_phase);
        }
        setLoading(false);
      });
  }, []);

  const handleNextPhase = async () => {
    const nextPhase = currentPhase + 1;
    if (nextPhase > 4) return;
    
    // Optimistic update
    setCurrentPhase(nextPhase);
    
    await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_phase: nextPhase })
    });
  };

  const dynamicPhases = phases.map(p => ({
    ...p,
    status: p.number < currentPhase ? "completed" : p.number === currentPhase ? "active" : "locked"
  }));

  if (loading) return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-8">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Roadmap Fase</h1>
        <p className="text-muted-foreground mt-2">
          Panduan langkah-langkah sistematis membangun bisnis dari nol hingga siap skala.
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div variants={item} className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Progress Keseluruhan</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold text-primary">{currentPhase}</span>
              <span className="text-muted-foreground mb-1">/ 4 Fase</span>
            </div>
            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentPhase / 4) * 100}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-muted-foreground">
                <cfg.icon className={cn("h-4 w-4", cfg.color)} />
                <span>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Phases */}
      <div className="space-y-4">
        {dynamicPhases.map((phase) => {
          const cfg = statusConfig[phase.status as keyof typeof statusConfig];
          const completedTasks = phase.tasks.filter((t) => t.done).length;
          return (
            <motion.div
              key={phase.number}
              variants={item}
              className={cn(
                "glass-panel rounded-2xl p-6 border transition-all",
                cfg.border,
                phase.status === "locked" ? "opacity-60" : "hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)]"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Phase Number */}
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0", cfg.bg, cfg.color)}>
                  {phase.number}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{phase.title}</h3>
                        <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium", cfg.bg, cfg.color)}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{phase.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 bg-secondary px-3 py-1 rounded-full">
                      ⏱ {phase.duration}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {phase.tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {task.done ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className={cn("h-4 w-4 shrink-0", phase.status === "locked" ? "text-muted-foreground/40" : "text-muted-foreground")} />
                        )}
                        <span className={cn(task.done && "line-through text-muted-foreground")}>{task.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar for active */}
                  {phase.status === "active" && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>{completedTasks}/{phase.tasks.length} tugas selesai</span>
                        <span className="font-medium text-primary">{Math.round((completedTasks / phase.tasks.length) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(completedTasks / phase.tasks.length) * 100}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA for active phase */}
                  {phase.status === "active" && (
                    <button onClick={handleNextPhase} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline group">
                      Lanjutkan Fase <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
