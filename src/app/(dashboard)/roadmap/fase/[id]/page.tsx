"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRoadmapStore, Phase } from "@/hooks/useRoadmapStore";
import { PhaseNav } from "@/components/roadmap/PhaseNav";
import { PhaseHeader } from "@/components/roadmap/PhaseHeader";
import { FatalTrapBox } from "@/components/roadmap/FatalTrapBox";
import { TaskGrid } from "@/components/roadmap/TaskGrid";
import { GateChecklist } from "@/components/roadmap/GateChecklist";
import { ConsultantPerspective } from "@/components/roadmap/ConsultantPerspective";
import { ToolRecommendation } from "@/components/roadmap/ToolRecommendation";
import { LockedPhaseOverlay } from "@/components/roadmap/LockedPhaseOverlay";
import { PhaseGateModal } from "@/components/roadmap/PhaseGateModal";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const phaseContentMap: Record<number, { trap: string; consultant: string; tools: { slug: string; name: string }[] }> = {
  1: {
    trap: "Terlalu lama di fase 'planning' tanpa eksekusi. Banyak yang menghabiskan berbulan-bulan membuat business plan sempurna sebelum berbicara dengan satu pun calon pelanggan. Itu bukan persiapan — itu prokrastinasi terselubung.",
    consultant: "Pertanyaan yang harus bisa dijawab sebelum lanjut: Jika bisnis ini tidak menghasilkan dalam 6 bulan pertama, apakah kamu akan menyesal sudah memulainya? Jika jawabannya 'tidak' — lanjut. Jika 'ya' — kamu perlu motivasi yang lebih kuat.",
    tools: []
  },
  2: {
    trap: "Bertanya 'apakah kamu suka produk ini?' kepada teman dan keluarga. Mereka akan bilang ya karena tidak ingin menyakiti perasaanmu. Yang harus ditanya: 'Masalah apa yang kamu hadapi sekarang terkait ini?' dan 'Apakah kamu pernah mencoba solusi lain?'",
    consultant: "Tolok ukur validasi: jika 30% dari orang yang di-pitch bersedia membayar di muka, ide itu layak dilanjutkan. Di bawah itu, perlu pivot atau ubah penawaran. Angka ini keras, tapi inilah yang memisahkan ide dari bisnis nyata.",
    tools: [{ slug: "kompetitor", name: "Analisis Kompetitor" }]
  },
  3: {
    trap: "Menetapkan harga berdasarkan feeling atau 'lihat harga kompetitor'. Tanpa menghitung HPP dan margin minimum, bisa berjualan ratusan unit tapi tetap rugi. Ini terjadi lebih sering dari yang dikira.",
    consultant: "Aturan yang selalu diberikan ke klien baru: jangan pernah bayar biaya bisnis dari rekening pribadi, dan jangan pernah pakai uang bisnis untuk kebutuhan pribadi. Pemisahan ini adalah perbedaan antara orang yang punya bisnis dan orang yang punya hobi yang menghasilkan uang.",
    tools: [
      { slug: "hpp", name: "Kalkulator HPP" },
      { slug: "sop", name: "SOP Builder" }
    ]
  },
  4: {
    trap: "Menghabiskan semua energi untuk tampil sempurna — website sempurna, logo sempurna, feed Instagram sempurna — sebelum ada satu pun penjualan. Pelanggan pertama tidak peduli kamu punya logo bagus. Mereka peduli apakah produkmu menyelesaikan masalah mereka.",
    consultant: "Yang membedakan launch yang berhasil dari yang gagal: obsesi pada pelanggan, bukan pada produk. Setiap hari, pertanyaannya harus 'bagaimana saya bisa melayani lebih baik?' bukan 'bagaimana produk saya terlihat lebih bagus?'",
    tools: [
      { slug: "break-even", name: "Break-Even Analysis" }
    ]
  },
  5: {
    trap: "Founder terlalu jadi 'pusat' semua hal. Ketika founder adalah satu-satunya yang bisa handle produksi, CS, keuangan, dan pemasaran — bisnis itu bukan bisnis, itu self-employment. Saat sakit atau pergi liburan, semua berhenti.",
    consultant: "Target di fase ini: bisnis harus bisa berjalan normal selama founder sakit 2 minggu. Jika tidak bisa, belum punya bisnis yang sesungguhnya — masih punya pekerjaan yang diciptakan sendiri.",
    tools: [
      { slug: "cashflow", name: "Cash Flow Projector" }
    ]
  },
  6: {
    trap: "Scale sebelum sistem stabil. Menambah kapasitas produksi, membuka cabang baru, atau menambah lini produk ketika proses utama masih kacau hanya akan memperbesar masalah yang sudah ada.",
    consultant: "Satu hal yang selalu disampaikan sebelum klien masuk ke fase skala: kamu harus bisa menjawab pertanyaan ini dengan data, bukan dengan keyakinan — mengapa pelanggan membeli dari kamu, bukan dari kompetitor? Jika jawabannya 'karena produk saya lebih bagus', itu bukan jawaban bisnis. Itu jawaban harapan.",
    tools: []
  }
};

export default function PhasePage() {
  const params = useParams();
  const router = useRouter();
  const phaseId = parseInt(params.id as string);
  
  const { 
    phases, 
    setPhaseDetail, 
    toggleChecklistItem, 
    toggleTask, 
    completePhase,
    isGateModalOpen,
    closeGateModal,
    pendingUnlockPhase
  } = useRoadmapStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingPhase, setCompletingPhase] = useState(false);

  useEffect(() => {
    if (isNaN(phaseId) || phaseId < 1 || phaseId > 6) {
      router.replace("/roadmap");
      return;
    }

    const fetchPhase = async () => {
      try {
        // Also fetch overall roadmap if not loaded to populate PhaseNav
        if (phases.length === 0) {
          const resMap = await fetch("/api/roadmap");
          if (resMap.ok) {
            const dataMap = await resMap.json();
            useRoadmapStore.getState().setRoadmapData(dataMap);
          }
        }

        const res = await fetch(`/api/roadmap/phase/${phaseId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Gagal memuat data fase");
        }
        
        setPhaseDetail(phaseId, data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhase();
  }, [phaseId, phases.length, router, setPhaseDetail]);

  const phaseDetail = phases.find(p => p.phase_number === phaseId);
  const isLocked = phaseDetail?.status === "locked";
  const content = phaseContentMap[phaseId];

  const totalItems = (phaseDetail?.tasks?.length || 0) + (phaseDetail?.checklist_items?.length || 0);
  const completedItems = (phaseDetail?.tasks?.filter(t => t.completed)?.length || 0) + (phaseDetail?.checklist_items?.filter(c => c.completed)?.length || 0);
  const phaseProgressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleCompletePhase = async () => {
    setCompletingPhase(true);
    await completePhase(phaseId);
    setCompletingPhase(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !phaseDetail) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-500/10 text-red-600 rounded-2xl flex flex-col items-center">
        <p className="font-bold mb-4">{error || "Data fase tidak ditemukan"}</p>
        <Link href="/roadmap" className="bg-background px-4 py-2 rounded-lg border hover:bg-secondary">
          Kembali ke Roadmap
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto relative pb-20">
      <Link href="/roadmap" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Overview
      </Link>

      <PhaseNav phases={phases} currentPhaseId={phaseId} />

      <div className="relative">
        {isLocked && <LockedPhaseOverlay phaseNumber={phaseId} />}

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={isLocked ? "pointer-events-none" : ""}
        >
          <PhaseHeader 
            phaseId={phaseDetail.phase_number}
            title={phaseDetail.name}
            subtitle={phaseDetail.tagline}
            status={phaseDetail.status}
            progress={phaseProgressPct}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FatalTrapBox content={content.trap} />
              
              <TaskGrid 
                phaseId={phaseId}
                tasks={phaseDetail.tasks || []}
                onToggle={(taskId, completed) => toggleTask(phaseId, taskId, completed)}
                disabled={isLocked}
              />
              
              <GateChecklist 
                items={phaseDetail.checklist_items || []}
                gateMet={phaseDetail.gate_met || false}
                gateRequirement={phaseDetail.gate_requirement || ""}
                onToggle={(itemId, completed) => toggleChecklistItem(phaseId, itemId, completed)}
                disabled={isLocked}
              />

              {phaseDetail.status === "active" && phaseId < 6 && (
                <button
                  onClick={handleCompletePhase}
                  disabled={!phaseDetail.gate_met || completingPhase}
                  className="btn-retro btn-retro-primary w-full mt-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {completingPhase ? (
                    <span>Memproses...</span>
                  ) : (
                    "✓ Selesaikan Fase Ini »"
                  )}
                </button>
              )}
            </div>

            <div className="space-y-6">
              <ToolRecommendation tools={content.tools} />
              <ConsultantPerspective content={content.consultant} />
            </div>
          </div>
        </motion.div>
      </div>

      <PhaseGateModal 
        isOpen={isGateModalOpen}
        onClose={closeGateModal}
        completedPhase={phaseId}
        nextPhase={pendingUnlockPhase || (phaseId + 1)}
      />
    </div>
  );
}
