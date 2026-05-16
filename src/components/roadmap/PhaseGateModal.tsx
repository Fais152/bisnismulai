"use client";

import { useRouter } from "next/navigation";

interface PhaseGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedPhase: number;
  nextPhase: number;
}

export function PhaseGateModal({ isOpen, onClose, completedPhase, nextPhase }: PhaseGateModalProps) {
  const router = useRouter();

  const handleNext = () => {
    onClose();
    router.push(`/roadmap/fase/${nextPhase}`);
  };

  if (!isOpen) return null;

  return (
    /* Windows 95 style: no dark overlay, dialog just appears */
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="win-panel pointer-events-auto w-full max-w-sm mx-4 text-center">
        {/* Title bar */}
        <div className="win-titlebar" style={{ background: "linear-gradient(to right, #008000, #00A000)" }}>
          <div className="flex items-center gap-1">
            <span className="text-base">✅</span>
            <span className="text-base font-bold leading-none">Fase {completedPhase} Selesai!</span>
          </div>
          <button onClick={onClose} className="win-control-btn">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 bg-[#C0C0C0] dark:bg-[#1A1A1A]">
          {/* Success icon */}
          <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center text-4xl win-inset"
            style={{ background: "#008000" }}>
            ✓
          </div>

          <h2
            className="text-2xl mb-3 font-bold"
            style={{ fontFamily: "var(--font-vt323), 'VT323', monospace" }}
          >
            🎉 Selamat! Fase {completedPhase} Selesai!
          </h2>
          <p className="text-[13px] mb-6 leading-relaxed">
            Kamu telah menyelesaikan semua persyaratan checklist di fase ini.
            Fase {nextPhase} sekarang telah terbuka!
          </p>

          <div className="border-t border-[#808080] mb-4" />

          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              onClick={handleNext}
              className="btn-retro btn-retro-primary flex-1"
            >
              Lanjut ke Fase {nextPhase} »
            </button>
            <button
              onClick={onClose}
              className="btn-retro flex-1"
            >
              Tetap di Sini
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="win-statusbar text-[11px]">
          <span className="win-statusbar-item">✓ Fase {completedPhase} selesai</span>
          <span className="win-statusbar-item">Fase {nextPhase} tersedia</span>
        </div>
      </div>
    </div>
  );
}
