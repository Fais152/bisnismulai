import Link from "next/link";

interface ToolRecommendationProps {
  tools: { slug: string; name: string }[];
}

const TOOL_ICONS: Record<string, string> = {
  hpp: "💰",
  "break-even": "⚖️",
  sop: "📋",
  cashflow: "📈",
};

export function ToolRecommendation({ tools }: ToolRecommendationProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="win-panel mb-4">
      <div className="win-titlebar" style={{ background: "linear-gradient(to right, #000080, #4040B0)" }}>
        <div className="flex items-center gap-1">
          <span className="text-base">🔧</span>
          <span className="text-base font-bold leading-none">Tool yang Direkomendasikan</span>
        </div>
      </div>
      <div className="p-3 bg-[#C0C0C0] dark:bg-[#1A1A1A] flex flex-col sm:flex-row gap-2">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="btn-retro flex-1 text-center no-underline text-inherit text-[13px] flex items-center justify-center gap-2"
          >
            <span>{TOOL_ICONS[tool.slug] ?? "📄"}</span>
            <span>{tool.name}</span>
            <span>»</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
