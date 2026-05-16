import { TaskItem } from "@/hooks/useRoadmapStore";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  number: number;
  task: TaskItem;
  onToggle: (completed: boolean) => void;
  disabled?: boolean;
}

export function TaskCard({ number, task, onToggle, disabled }: TaskCardProps) {
  const { completed, title } = task;

  return (
    <div
      onClick={() => { if (!disabled) onToggle(!completed); }}
      className={cn(
        "flex items-start gap-3 p-3 text-[13px] cursor-pointer select-none",
        disabled ? "opacity-60 cursor-not-allowed" : "",
        completed
          ? "bg-[#C0C0C0] dark:bg-[#333333]"
          : "bg-white dark:bg-black"
      )}
      style={{
        boxShadow: disabled ? "none" : (
          completed
            ? "inset 1px 1px 0 #808080, inset 2px 2px 0 #404040"
            : "inset -1px -1px 0 #808080, inset 1px 1px 0 #FFFFFF, inset -2px -2px 0 #404040, inset 2px 2px 0 #DFDFDF"
        )
      }}
    >
      {/* Retro checkbox */}
      <input
        type="checkbox"
        readOnly
        checked={completed}
        className="checkbox-retro mt-0.5"
        aria-label={title}
      />
      <span className={cn("leading-snug", completed && "line-through text-[#808080]")}>
        {number}. {title}
      </span>
    </div>
  );
}
