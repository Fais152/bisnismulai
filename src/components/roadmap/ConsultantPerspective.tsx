import { cn } from "@/lib/utils";

interface ConsultantPerspectiveProps {
  content: string;
}

export function ConsultantPerspective({ content }: ConsultantPerspectiveProps) {
  return (
    <div className="win-panel">
      <div className="win-titlebar" style={{ background: "linear-gradient(to right, #000080, #006600)" }}>
        <div className="flex items-center gap-1">
          <span className="text-base">💼</span>
          <span className="text-base font-bold leading-none">Perspektif Konsultan</span>
        </div>
      </div>
      <div className="p-3 bg-[#C0C0C0] dark:bg-[#1A1A1A] flex items-start gap-3">
        {/* Avatar placeholder */}
        <div
          className="shrink-0 w-10 h-10 flex items-center justify-center text-xl win-inset"
          style={{ background: "#C0C0C0" }}
          aria-hidden="true"
        >
          👔
        </div>
        <div
          className="flex-1 p-2 text-[13px] leading-relaxed italic"
          style={{
            boxShadow: "inset 1px 1px 0 #808080, inset 2px 2px 0 #404040",
            background: "var(--input, #FFFFFF)"
          }}
        >
          &ldquo;{content}&rdquo;
        </div>
      </div>
    </div>
  );
}
