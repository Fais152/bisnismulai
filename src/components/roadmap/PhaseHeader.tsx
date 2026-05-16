"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface PhaseHeaderProps {
  phaseId: number;
  title: string;
  subtitle?: string;
  status: "locked" | "active" | "completed";
  progress?: number; // 0-100
}

const STATUS_CONFIG = {
  locked: { icon: "🔒", label: "TERKUNCI", color: "#808080" },
  active: { icon: "▶️", label: "AKTIF", color: "#000080" },
  completed: { icon: "✅", label: "SELESAI", color: "#008000" },
};

export function PhaseHeader({ phaseId, title, subtitle, status, progress = 0 }: PhaseHeaderProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="win-panel mb-0">
      {/* Title bar */}
      <div className="win-titlebar">
        <div className="flex items-center gap-1">
          <span className="text-base">{cfg.icon}</span>
          <span className="text-base font-bold leading-none">
            Fase {String(phaseId).padStart(2, "0")} — {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-bold px-2 py-0.5"
            style={{
              background: "#C0C0C0",
              color: cfg.color,
              boxShadow: "inset -1px -1px 0 #808080, inset 1px 1px 0 #FFFFFF"
            }}
          >
            {cfg.label}
          </span>
          <Link href="/roadmap" className="win-control-btn no-underline text-inherit">✕</Link>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-[#C0C0C0] dark:bg-[#1A1A1A] px-4 py-2 flex flex-wrap items-center gap-4 text-[13px] border-b border-[#808080]">
        {subtitle && <span>{subtitle}</span>}
        {progress > 0 && (
          <span>Progress: <strong>{progress}%</strong></span>
        )}
      </div>
    </div>
  );
}
