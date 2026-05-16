"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRoadmapStore } from "@/hooks/useRoadmapStore";
import { Window } from "@/components/retro/Window";
import { RetroProgress } from "@/components/retro/RetroProgress";
import { cn } from "@/lib/utils";

const STATUS_ICONS: Record<string, string> = {
  completed: "✅",
  active: "▶️",
  locked: "🔒",
};

export default function RoadmapPage() {
  const { phases, currentPhase, overallProgress, isLoading, setRoadmapData, error } = useRoadmapStore();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch("/api/roadmap");
        if (!res.ok) {
          if (res.status === 403) {
            window.location.href = "/onboarding";
            return;
          }
          throw new Error("Failed to load roadmap data");
        }
        const data = await res.json();
        setRoadmapData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoadmap();
  }, [setRoadmapData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="win-panel p-4 text-[13px]">
          <div className="win-titlebar mb-2">⌛ Memuat...</div>
          <p>Memuat data roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="win-panel p-4 text-[13px] text-center max-w-sm mx-auto">
        <div className="win-titlebar mb-4" style={{ background: "linear-gradient(to right, #800000, #B00000)" }}>
          <div className="flex items-center gap-1">
            <span className="text-base">✕</span>
            <span className="text-base font-bold leading-none">Error</span>
          </div>
        </div>
        <p className="mb-4 text-[#800000] font-bold">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-retro">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <Window
        title="🗺️ Roadmap Bisnis"
        icon="🗺️"
        statusBar={`Total Progress: ${overallProgress}% | Fase Aktif: Fase ${currentPhase}`}
      >
        <div className="p-4 bg-[#C0C0C0] dark:bg-[#1A1A1A]">
          <p className="text-[13px] mb-4">
            Perjalanan 6 fase dari memvalidasi ide hingga skala besar. Selesaikan tugas tiap fase untuk membuka fase berikutnya.
          </p>

          <div className="mb-6 max-w-lg">
            <div className="label-retro font-bold">Progress Keseluruhan:</div>
            <RetroProgress value={overallProgress} showPercent />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phases.map((phase) => {
              const isLocked = phase.status === "locked";
              const isCompleted = phase.status === "completed";
              const icon = STATUS_ICONS[phase.status] || "📄";
              const progress = phase.checklist_progress;
              const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

              return (
                <div
                  key={phase.phase_number}
                  className={cn(
                    "win-panel flex flex-col h-full",
                    isLocked && "opacity-60"
                  )}
                >
                  {/* Title bar */}
                  <div
                    className="win-titlebar"
                    style={{
                      background: isCompleted ? "linear-gradient(to right, #008000, #00C000)" : (isLocked ? "#808080" : undefined)
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-base">{icon}</span>
                      <span className="text-base font-bold leading-none">
                        Fase {phase.phase_number}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#C0C0C0] dark:bg-[#1A1A1A] flex flex-col flex-1">
                    <h3 className="font-bold text-[14px] mb-2">{phase.name}</h3>
                    <p className="text-[13px] mb-4 flex-1">
                      {phase.tagline}
                    </p>

                    {!isLocked && progress && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span>{progress.done}/{progress.total} Selesai</span>
                        </div>
                        <RetroProgress value={pct} showPercent={false} />
                      </div>
                    )}

                    {isLocked ? (
                      <div className="text-[11px] text-[#444] dark:text-[#888] font-bold mt-auto text-center p-1 win-inset">
                        🔒 Selesaikan fase sebelumnya
                      </div>
                    ) : (
                      <Link
                        href={`/roadmap/fase/${phase.phase_number}`}
                        className="btn-retro w-full text-center no-underline text-inherit mt-auto"
                      >
                        {isCompleted ? "Lihat Detail »" : "Lanjutkan »"}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Window>
    </div>
  );
}
