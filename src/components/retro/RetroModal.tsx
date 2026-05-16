"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { RetroButton } from "./RetroButton";

interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string; // ⚠ ℹ ✕ ?
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function RetroModal({
  isOpen,
  onClose,
  title,
  icon = "ℹ",
  children,
  actions,
  className,
}: RetroModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Windows 95 dialog: no dark overlay — content behind just shows normally */
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={cn(
          "win-panel pointer-events-auto min-w-[280px] max-w-md w-full mx-4",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="retro-modal-title"
      >
        {/* Title bar */}
        <div className="win-titlebar">
          <div className="flex items-center gap-1">
            <span className="text-base">{icon}</span>
            <span id="retro-modal-title" className="text-base font-bold leading-none">{title}</span>
          </div>
          <button onClick={onClose} className="win-control-btn">✕</button>
        </div>

        {/* Content */}
        <div className="p-4 bg-[var(--card)] text-[13px] leading-relaxed">
          {/* Icon + message area */}
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl leading-none shrink-0">{icon}</span>
            <div className="flex-1">{children}</div>
          </div>

          {/* Separator */}
          <div className="border-t border-[var(--win-shadow-med)] mb-3" />

          {/* Action buttons */}
          <div className="flex justify-center gap-2">
            {actions ?? (
              <RetroButton variant="primary" onClick={onClose}>
                OK
              </RetroButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
