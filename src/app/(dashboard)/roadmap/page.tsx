"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle2, Lock, Circle, ChevronRight, Zap, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

// toolSlug = null berarti task manual (user centang sendiri)
const PHASES = [
  {
    number: 1,
    title: "Validasi Ide & Riset Pasar",
    description: "Pastikan ide bisnis Anda benar-benar dibutuhkan pasar sebelum berinvestasi lebih jauh.",
    duration: "2-4 Minggu",
    tasks: [
      { key: "p1_t1", label: "Identifikasi masalah yang ingin diselesaikan", toolSlug: null },
      { key: "p1_t2", label: "Riset kompetitor (minimal 3 kompetitor)", toolSlug: null },
      { key: "p1_t3", label: "Tentukan target pelanggan (buyer persona)", toolSlug: null },
      { key: "p1_t4", label: "Lakukan 5 wawancara calon pelanggan", toolSlug: null },
    ],
  },
  {
    number: 2,
    title: "Bangun Sistem Bisnis",
    description: "Hitung keuangan dasar dan bangun fondasi operasional sebelum mulai berjualan.",
    duration: "4-6 Minggu",
    tasks: [
      { key: "p2_t1", label: "Hitung HPP & Harga Jual (Kalkulator HPP)", toolSlug: "hpp" },
      { key: "p2_t2", label: "Analisis titik impas (Break-Even)", toolSlug: "break-even" },
      { key: "p2_t3", label: "Buat SOP Layanan Pelanggan", toolSlug: "sop" },
      { key: "p2_t4", label: "Tentukan Struktur Legal Usaha", toolSlug: null },
    ],
  },
  {
    number: 3,
    title: "Akuisisi Pelanggan Pertama",
    description: "Dapatkan 10 pelanggan pertama menggunakan strategi pemasaran organik berbiaya rendah.",
    duration: "4-8 Minggu",
    tasks: [
      { key: "p3_t1", label: "Buat konten pemasaran perdana", toolSlug: null },
      { key: "p3_t2", label: "Setup saluran media sosial bisnis", toolSlug: null },
      { key: "p3_t3", label: "Kampanye pre-order / soft launch", toolSlug: null },
      { key: "p3_t4", label: "Closing 10 transaksi pertama", toolSlug: null },
    ],
  },
  {
    number: 4,
    title: "Optimasi & Skalabilitas",
    description: "Perbaiki proses berdasarkan feedback pelanggan nyata dan mulai skalakan bisnis.",
    duration: "8-12 Minggu",
    tasks: [
      { key: "p4_t1", label: "Analisis data penjualan & feedback", toolSlug: null },
      { key: "p4_t2", label: "Proyeksi pertumbuhan (Cash Flow)", toolSlug: "cashflow" },
      { key: "p4_t3", label: "Optimasi produk/layanan", toolSlug: null },
      { key: "p4_t4", label: "Rekrut tim atau mitra pertama", toolSlug: null },
    ],
  },
];

const statusConfig = {
  completed: { icon: CheckCircle2, label: "Selesai", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  active: { icon: Zap, label: "Berjalan", color: "text-primary", bg: "bg-primary/10", border: "border-primary/40" },
  locked: { icon: Lock, label: "Terkunci", color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border/40" },
};

type ConfirmState = { open: false } | { open: true; hasIncomplete: boolean; incompleteCount: number };

export default function RoadmapPage() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [loading, setLoading] = useState(true);
  // taskDone: key → boolean (from localStorage for manual, from DB for tools)
  const [taskDone, setTaskDone] = useState<Record<string, boolean>>({});
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false });
  const [saving, setSaving] = useState(false);

  // Load phase from DB + task state from localStorage + tool completion from DB
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load user profile (current_phase)
        const profileRes = await fetch("/api/user/profile");
        const { data } = await profileRes.json();
        const phase = data?.current_phase ?? 1;
        setCurrentPhase(phase);

        // 2. Load manual task state from localStorage
        const saved = localStorage.getItem("roadmap_tasks");
        const manual: Record<string, boolean> = saved ? JSON.parse(saved) : {};

        // 3. Load tool completion from DB for tool-based tasks
        const toolSlugs = ["hpp", "break-even", "sop", "cashflow"];
        const toolDone: Record<string, boolean> = {};

        await Promise.all(
          toolSlugs.map(async (slug) => {
            try {
              const res = await fetch(`/api/tools/${slug}`, { cache: "no-store" });
              const json = await res.json();
              if (!json.data) {
                toolDone[slug] = false;
              } else if (slug === "hpp") {
                // HPP stores { produkList: [...] }
                toolDone[slug] = Array.isArray(json.data.produkList) && json.data.produkList.length > 0;
              } else {
                toolDone[slug] = Object.keys(json.data).length > 0;
              }
            } catch {
              toolDone[slug] = false;
            }
          })
        );

        // 4. Merge: for tool tasks, use toolDone; for manual tasks, use localStorage
        const merged: Record<string, boolean> = { ...manual };
        PHASES.forEach((phase) => {
          phase.tasks.forEach((task) => {
            if (task.toolSlug) {
              merged[task.key] = toolDone[task.toolSlug] ?? false;
            }
          });
        });

        setTaskDone(merged);
      } catch (e) {
        console.error("Roadmap load error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Toggle manual task (tool tasks are not manually togglable)
  const toggleTask = useCallback(
    (key: string, toolSlug: string | null, phaseNumber: number) => {
      // Only allow toggling tasks in active phase and no toolSlug
      if (phaseNumber !== currentPhase || toolSlug !== null) return;

      setTaskDone((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        // Persist to localStorage (only manual tasks)
        const manualOnly: Record<string, boolean> = {};
        PHASES.forEach((p) =>
          p.tasks.forEach((t) => {
            if (!t.toolSlug) manualOnly[t.key] = next[t.key] ?? false;
          })
        );
        localStorage.setItem("roadmap_tasks", JSON.stringify(manualOnly));
        return next;
      });
    },
    [currentPhase]
  );

  // Click "Lanjutkan Fase" — validate first
  const handleNextPhaseClick = () => {
    if (currentPhase >= 4) return;
    const activePhase = PHASES.find((p) => p.number === currentPhase);
    if (!activePhase) return;

    const incomplete = activePhase.tasks.filter((t) => !taskDone[t.key]);
    setConfirm({
      open: true,
      hasIncomplete: incomplete.length > 0,
      incompleteCount: incomplete.length,
    });
  };

  // Confirm advance phase
  const handleConfirmAdvance = async () => {
    const nextPhase = currentPhase + 1;
    setSaving(true);
    setConfirm({ open: false });
    setCurrentPhase(nextPhase);

    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_phase: nextPhase }),
      });
    } catch (e) {
      console.error("Failed to save phase:", e);
    } finally {
      setSaving(false);
    }
  };

  const dynamicPhases = PHASES.map((p) => ({
    ...p,
    status: p.number < currentPhase ? "completed" : p.number === currentPhase ? "active" : "locked",
  }));

  // Overall progress based on completed tasks across all phases
  const activePhaseData = PHASES.find((p) => p.number === currentPhase);
  const activeCompletedTasks = activePhaseData?.tasks.filter((t) => taskDone[t.key]).length ?? 0;
  const activeTotalTasks = activePhaseData?.tasks.length ?? 1;
  const phaseProgressPct = Math.round((activeCompletedTasks / activeTotalTasks) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
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
            <div className="flex-1 w-full">
              <p className="text-sm text-muted-foreground mb-1">Fase Aktif Saat Ini</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-bold text-primary">{currentPhase}</span>
                <span className="text-muted-foreground mb-1">/ 4 Fase</span>
                {saving && <span className="text-xs text-muted-foreground mb-1 animate-pulse">Menyimpan...</span>}
              </div>
              {/* Phase bar */}
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPhase - 1) / 4) * 100 + (phaseProgressPct / 100) * 25}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
              {currentPhase <= 4 && (
                <p className="text-xs text-muted-foreground">
                  Fase {currentPhase}: {activeCompletedTasks}/{activeTotalTasks} tugas selesai ({phaseProgressPct}%)
                </p>
              )}
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
            const phaseTasks = PHASES.find((p) => p.number === phase.number)!.tasks;
            const completedCount = phaseTasks.filter((t) => taskDone[t.key]).length;
            const isActive = phase.status === "active";
            const isLocked = phase.status === "locked";

            return (
              <motion.div
                key={phase.number}
                variants={item}
                className={cn(
                  "glass-panel rounded-2xl p-6 border transition-all",
                  cfg.border,
                  isLocked ? "opacity-60" : "hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)]"
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
                      {phaseTasks.map((task) => {
                        const done = taskDone[task.key] ?? false;
                        const isManualActive = isActive && task.toolSlug === null;
                        const isToolTask = task.toolSlug !== null;

                        return (
                          <div
                            key={task.key}
                            onClick={() => toggleTask(task.key, task.toolSlug, phase.number)}
                            className={cn(
                              "flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 transition-all",
                              isManualActive && "cursor-pointer hover:bg-secondary/60",
                              isToolTask && "cursor-default"
                            )}
                          >
                            {done ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className={cn("h-4 w-4 shrink-0", isLocked ? "text-muted-foreground/40" : "text-muted-foreground")} />
                            )}
                            <span className={cn(done && "line-through text-muted-foreground")}>
                              {task.label}
                            </span>
                            {isToolTask && (
                              <span className="ml-auto text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded shrink-0">
                                {done ? "✓ Tools" : "Via Tools"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress bar for active phase */}
                    {isActive && (
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                          <span>{completedCount}/{phaseTasks.length} tugas selesai</span>
                          <span className="font-medium text-primary">{Math.round((completedCount / phaseTasks.length) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            animate={{ width: `${(completedCount / phaseTasks.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Active phase hint for manual tasks */}
                    {isActive && (
                      <p className="text-xs text-muted-foreground">
                        💡 Klik task untuk menandai selesai. Task bertanda <span className="font-medium">"Via Tools"</span> otomatis terdeteksi dari data yang kamu simpan di Tools.
                      </p>
                    )}

                    {/* CTA lanjutkan fase */}
                    {isActive && currentPhase < 4 && (
                      <button
                        onClick={handleNextPhaseClick}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline group mt-1"
                      >
                        Lanjutkan Fase{" "}
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}

                    {isActive && currentPhase === 4 && (
                      <p className="text-sm font-medium text-emerald-500">🎉 Ini adalah fase terakhir! Selesaikan semua tugas untuk melengkapi roadmap bisnis kamu.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirm.open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setConfirm({ open: false })}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {confirm.open && confirm.hasIncomplete ? (
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                    )}
                    <h2 className="text-lg font-bold">
                      {confirm.open && confirm.hasIncomplete ? "Ada Task Belum Selesai" : "Lanjutkan ke Fase Berikutnya?"}
                    </h2>
                  </div>
                  <button
                    onClick={() => setConfirm({ open: false })}
                    className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="space-y-3 mb-6">
                  {confirm.open && confirm.hasIncomplete ? (
                    <>
                      <p className="text-muted-foreground text-sm">
                        Masih ada <span className="font-semibold text-amber-500">{confirm.incompleteCount} task</span> yang belum diselesaikan di fase ini.
                      </p>
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
                        ⚠️ Disarankan menyelesaikan semua task sebelum melanjutkan agar bisnis kamu lebih siap untuk fase berikutnya.
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Apakah kamu yakin ingin melanjutkan ke <strong>Fase {currentPhase + 1}</strong> meskipun belum semua task selesai?
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground text-sm">
                        Semua task di Fase {currentPhase} sudah selesai. 🎉
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Apakah kamu sudah benar-benar menyelesaikan semua tugas dan siap untuk melanjutkan ke <strong>Fase {currentPhase + 1}</strong>?
                      </p>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirm({ open: false })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border/60 text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    Kembali, Selesaikan Dulu
                  </button>
                  <button
                    onClick={handleConfirmAdvance}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      confirm.open && confirm.hasIncomplete
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                  >
                    Ya, Lanjutkan Fase {currentPhase + 1}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
