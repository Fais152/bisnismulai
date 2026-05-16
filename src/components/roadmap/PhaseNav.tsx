import { cn } from "@/lib/utils";
import Link from "next/link";

interface PhaseNavProps {
  phases: { phase_number: number; name: string; status: string }[];
  currentPhaseId: number;
}

const STATUS_ICONS: Record<string, string> = {
  completed: "✅",
  active: "▶️",
  locked: "🔒",
};

export function PhaseNav({ phases, currentPhaseId }: PhaseNavProps) {
  return (
    <div className="win-panel mb-4">
      {/* Tabs row */}
      <div className="flex overflow-x-auto" style={{ borderBottom: "1px solid #808080" }}>
        {phases.map((p) => {
          const isActive = p.phase_number === currentPhaseId;
          const isLocked = p.status === "locked";
          const isDone = p.status === "completed";
          const icon = isDone ? "✅" : isLocked ? "🔒" : "▶️";

          return (
            <Link
              key={p.phase_number}
              href={isLocked ? "#" : `/roadmap/fase/${p.phase_number}`}
              onClick={(e) => { if (isLocked) e.preventDefault(); }}
              className={cn(
                "tab-retro flex-shrink-0 flex items-center gap-1.5 whitespace-nowrap no-underline text-inherit",
                isActive && "active",
                !isActive && !isLocked && "hover:bg-[#000080] hover:text-white",
                isLocked && "opacity-60 cursor-not-allowed"
              )}
            >
              <span>{icon}</span>
              <span className="text-[11px]">Fase {p.phase_number}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
