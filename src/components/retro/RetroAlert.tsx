import { cn } from "@/lib/utils";

type AlertVariant = "info" | "warning" | "error" | "success" | "question";

const ICONS: Record<AlertVariant, string> = {
  info: "ℹ",
  warning: "⚠",
  error: "✕",
  success: "✓",
  question: "?",
};

const ICON_COLORS: Record<AlertVariant, string> = {
  info: "text-[#000080]",
  warning: "text-[#808000]",
  error: "text-[#800000]",
  success: "text-[#008000]",
  question: "text-[#000000]",
};

interface RetroAlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function RetroAlert({
  variant = "info",
  title,
  children,
  className,
}: RetroAlertProps) {
  const icon = ICONS[variant];
  const iconColor = ICON_COLORS[variant];

  return (
    <div
      className={cn(
        "win-panel p-3 flex items-start gap-3",
        className
      )}
      role="alert"
    >
      {/* System icon */}
      <div
        className={cn(
          "shrink-0 w-8 h-8 flex items-center justify-center text-lg font-bold leading-none win-inset",
          iconColor
        )}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="flex-1 text-[13px]">
        {title && (
          <div className="font-bold mb-1">{title}</div>
        )}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
