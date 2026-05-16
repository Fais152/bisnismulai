"use client";

import { ChecklistItem as IChecklistItem } from "@/hooks/useRoadmapStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface ChecklistItemProps {
  item: IChecklistItem;
  onToggle: (completed: boolean) => void;
  disabled?: boolean;
}

export function ChecklistItem({ item, onToggle, disabled }: ChecklistItemProps) {
  const { completed, label, tool_required, tool_filled } = item;
  const [showWarning, setShowWarning] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    if (!completed && tool_required && !tool_filled) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    onToggle(!completed);
  };

  return (
    <div className="relative mb-1">
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 p-2 text-[13px] select-none",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          completed ? "bg-[#C0C0C0] dark:bg-[#333333]" : "bg-white dark:bg-black hover:bg-[#000080] hover:text-white"
        )}
        style={{
          boxShadow: completed
            ? "inset 1px 1px 0 #808080, inset 2px 2px 0 #404040"
            : "inset -1px -1px 0 #808080, inset 1px 1px 0 #FFFFFF, inset -2px -2px 0 #404040, inset 2px 2px 0 #DFDFDF"
        }}
      >
        <input
          type="checkbox"
          readOnly
          checked={completed}
          className="checkbox-retro shrink-0"
          aria-label={label}
        />
        <span className={cn("flex-1 leading-snug", completed && "line-through text-[#808080]")}>
          {label}
        </span>
        {tool_required && (
          <span
            className="shrink-0 text-[11px] px-1.5 py-0.5 font-bold"
            style={{
              background: tool_filled ? "#008000" : "#808000",
              color: "#FFFFFF",
              boxShadow: "inset -1px -1px 0 #404040, inset 1px 1px 0 rgba(255,255,255,0.3)"
            }}
          >
            {tool_filled ? "✓ Tool" : "⚠ Tool"}
          </span>
        )}
      </div>

      {/* Warning popup — Windows 95 dialog style */}
      {showWarning && tool_required && (
        <div className="absolute top-full left-0 right-0 z-10 mt-0.5 win-panel">
          <div className="win-titlebar text-[11px]" style={{ background: "linear-gradient(to right, #808000, #a0a000)" }}>
            <span>⚠ Tool Diperlukan</span>
          </div>
          <div className="p-2 text-[13px] bg-[#FFFFE1]">
            <p className="mb-2 text-black">Selesaikan dulu tool yang dibutuhkan untuk checklist ini!</p>
            <Link
              href={`/tools/${tool_required}`}
              className="btn-retro text-[11px] inline-block no-underline text-inherit"
            >
              Buka Tool »
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
