import { ChecklistItem as IChecklistItem } from "@/hooks/useRoadmapStore";
import { ChecklistItem } from "./ChecklistItem";

interface GateChecklistProps {
  items: IChecklistItem[];
  gateMet: boolean;
  gateRequirement: string;
  onToggle: (itemId: string, completed: boolean) => void;
  disabled?: boolean;
}

export function GateChecklist({ items, gateMet, gateRequirement, onToggle, disabled }: GateChecklistProps) {
  if (!items || items.length === 0) return null;
  
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  
  return (
    <div className="win-panel mb-4">
      {/* Title bar */}
      <div className="win-titlebar">
        <div className="flex items-center gap-1">
          <span className="text-base">🔒</span>
          <span className="text-base font-bold leading-none">Gate Checklist</span>
        </div>
        <span className="text-[13px] font-bold">
          {completedCount}/{totalCount} selesai
        </span>
      </div>

      {/* Items */}
      <div
        className="p-2 space-y-1"
        style={{ background: "var(--input, #FFFFFF)" }}
      >
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={(completed) => onToggle(item.id, completed)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Status bar — gate requirement */}
      <div className="win-statusbar text-[13px]">
        <span className="win-statusbar-item">
          Syarat buka fase berikutnya:
        </span>
        <span
          className="win-statusbar-item font-bold"
          style={{ color: gateMet ? "#008000" : "#800000" }}
        >
          {gateMet ? "✓ " : "✕ "}{gateRequirement}
        </span>
      </div>
    </div>
  );
}
