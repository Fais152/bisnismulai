import { cn } from "@/lib/utils";

interface FatalTrapBoxProps {
  content: string;
}

export function FatalTrapBox({ content }: FatalTrapBoxProps) {
  return (
    <div className="win-panel">
      {/* Error-style title bar */}
      <div className="win-titlebar" style={{ background: "linear-gradient(to right, #800000, #B00000)" }}>
        <div className="flex items-center gap-1">
          <span className="text-base">⚠</span>
          <span className="text-base font-bold leading-none">Fatal Trap — Hindari Ini!</span>
        </div>
      </div>
      <div className="p-3 bg-[#C0C0C0] dark:bg-[#1A1A1A] flex items-start gap-3">
        {/* System warning icon */}
        <div
          className="shrink-0 w-8 h-8 flex items-center justify-center text-lg font-bold win-inset"
          style={{ color: "#800000" }}
        >
          ⚠
        </div>
        <p className="text-[13px] leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
