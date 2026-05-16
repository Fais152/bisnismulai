"use client";

import { cn } from "@/lib/utils";

interface RetroProgressProps {
  value: number; // 0-100
  className?: string;
  label?: string;
  showPercent?: boolean;
}

export function RetroProgress({ value, className, label, showPercent = true }: RetroProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-[11px]">{label}</span>}
          {showPercent && <span className="text-[11px]">{clamped}%</span>}
        </div>
      )}
      <div className="progress-retro">
        <div
          className="progress-retro-fill"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
