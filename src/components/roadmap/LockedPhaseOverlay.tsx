import Link from "next/link";

interface LockedPhaseOverlayProps {
  phaseNumber: number;
}

export function LockedPhaseOverlay({ phaseNumber }: LockedPhaseOverlayProps) {
  const prevPhase = phaseNumber - 1;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center"
      style={{ background: "rgba(192,192,192,0.85)" }}
    >
      <div className="win-panel max-w-sm w-full">
        {/* Title bar */}
        <div className="win-titlebar" style={{ background: "#808080" }}>
          <div className="flex items-center gap-1">
            <span className="text-base">🔒</span>
            <span className="text-base font-bold leading-none">Akses Ditolak</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-[#C0C0C0] dark:bg-[#1A1A1A]">
          <div
            className="mx-auto w-14 h-14 flex items-center justify-center text-3xl mb-4 win-inset"
            style={{ background: "#C0C0C0" }}
          >
            🔒
          </div>

          <h3
            className="text-2xl mb-3 font-bold"
            style={{ fontFamily: "var(--font-vt323), 'VT323', monospace" }}
          >
            Fase Terkunci
          </h3>
          <p className="text-[13px] mb-6 leading-relaxed">
            Selesaikan minimal persyaratan Gate Checklist di Fase {prevPhase} terlebih dahulu untuk membuka kunci fase ini.
          </p>

          <div className="border-t border-[#808080] mb-4" />

          <Link
            href={`/roadmap/fase/${prevPhase}`}
            className="btn-retro btn-retro-primary inline-block no-underline text-inherit w-full text-center"
          >
            ◀ Lihat Fase {prevPhase}
          </Link>
        </div>
      </div>
    </div>
  );
}
