"use client";

import Link from "next/link";
import { Window } from "@/components/retro/Window";
import { cn } from "@/lib/utils";

const tools = [
  {
    slug: "hpp",
    name: "Kalkulator HPP",
    description: "Hitung Harga Pokok Penjualan dan tentukan harga jual yang tepat agar bisnis Anda tidak merugi.",
    icon: "💰",
    href: "/tools/hpp",
    status: "available",
  },
  {
    slug: "break-even",
    name: "Break-Even Analysis",
    description: "Cari tahu berapa unit yang harus terjual agar bisnis Anda mulai balik modal.",
    icon: "⚖️",
    href: "/tools/break-even",
    status: "available",
  },
  {
    slug: "cashflow",
    name: "Proyeksi Cashflow",
    description: "Buat simulasi arus kas bulanan selama 12 bulan ke depan dengan berbagai skenario.",
    icon: "📈",
    href: "/tools/cashflow",
    status: "available",
  },
  {
    slug: "sop",
    name: "SOP Builder",
    description: "Buat Standar Operasional Prosedur yang terstruktur untuk setiap aspek bisnis Anda.",
    icon: "📋",
    href: "/tools/sop",
    status: "available",
  },
];

export default function ToolsPage() {
  const availableTools = tools.filter((t) => t.status === "available");
  const comingSoonTools = tools.filter((t) => t.status === "coming_soon");

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Window
        title="🧰 Tools & Kalkulator"
        icon="🧰"
        statusBar={`${availableTools.length} tool tersedia`}
      >
        <div className="p-4 bg-[#C0C0C0] dark:bg-[#1A1A1A]">
          <p className="text-[13px] mb-4">
            Alat bantu bisnis yang dirancang khusus untuk membantu Anda mengambil keputusan finansial yang tepat.
          </p>

          <div className="label-retro font-bold mb-2">Tersedia Sekarang:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availableTools.map((tool) => (
              <div key={tool.slug} className="win-panel flex flex-col h-full">
                <div className="win-titlebar" style={{ background: "linear-gradient(to right, #000080, #4040B0)" }}>
                  <div className="flex items-center gap-1">
                    <span className="text-base">{tool.icon}</span>
                    <span className="text-base font-bold leading-none">{tool.name}</span>
                  </div>
                </div>
                <div className="p-3 bg-[#C0C0C0] dark:bg-[#1A1A1A] flex flex-col flex-1">
                  <p className="text-[13px] mb-4 flex-1">
                    {tool.description}
                  </p>
                  <Link href={tool.href} className="btn-retro text-center no-underline text-inherit w-full">
                    Buka Tool »
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {comingSoonTools.length > 0 && (
            <>
              <div className="label-retro font-bold mb-2">Segera Hadir:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comingSoonTools.map((tool) => (
                  <div key={tool.slug} className="win-panel flex flex-col h-full opacity-60">
                    <div className="win-titlebar" style={{ background: "#808080" }}>
                      <div className="flex items-center gap-1">
                        <span className="text-base">{tool.icon}</span>
                        <span className="text-base font-bold leading-none">{tool.name}</span>
                      </div>
                      <span className="text-[11px] font-bold bg-[#C0C0C0] text-[#000000] px-1 win-inset">
                        Segera
                      </span>
                    </div>
                    <div className="p-3 bg-[#C0C0C0] dark:bg-[#1A1A1A] flex flex-col flex-1">
                      <p className="text-[13px] mb-4 flex-1">
                        {tool.description}
                      </p>
                      <button disabled className="btn-retro w-full">Dalam Pengembangan</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Window>
    </div>
  );
}
