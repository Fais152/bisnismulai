"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Window } from "@/components/retro/Window";
import { RetroProgress } from "@/components/retro/RetroProgress";
import { RetroAlert } from "@/components/retro/RetroAlert";

interface DashboardData {
  currentPhase: number;
  userName: string;
  toolStatus: {
    hpp: boolean;
    breakEven: boolean;
    sop: boolean;
    cashflow: boolean;
    hppMarginLow: boolean;
  };
  loading: boolean;
}

const PHASE_TITLES = [
  "",
  "Validasi Ide & Riset Pasar",
  "Bangun Sistem Bisnis",
  "Akuisisi Pelanggan Pertama",
  "Optimasi & Skalabilitas",
];

const PHASE_CHECKLISTS: Record<number, { label: string; toolKey?: keyof DashboardData["toolStatus"] | null; href?: string }[]> = {
  1: [
    { label: "Identifikasi masalah yang ingin diselesaikan" },
    { label: "Riset kompetitor (minimal 3 kompetitor)" },
    { label: "Tentukan target pelanggan (buyer persona)" },
    { label: "Lakukan 5 wawancara calon pelanggan" },
  ],
  2: [
    { label: "Hitung HPP & Harga Jual", toolKey: "hpp", href: "/tools/hpp" },
    { label: "Analisis titik impas (Break-Even)", toolKey: "breakEven", href: "/tools/break-even" },
    { label: "Buat SOP Layanan Pelanggan", toolKey: "sop", href: "/tools/sop" },
    { label: "Tentukan Struktur Legal Usaha" },
  ],
  3: [
    { label: "Buat konten pemasaran perdana" },
    { label: "Setup saluran media sosial bisnis" },
    { label: "Kampanye pre-order / soft launch" },
    { label: "Closing 10 transaksi pertama" },
  ],
  4: [
    { label: "Analisis data penjualan & feedback" },
    { label: "Proyeksi pertumbuhan (Cash Flow)", toolKey: "cashflow", href: "/tools/cashflow" },
    { label: "Optimasi produk/layanan" },
    { label: "Rekrut tim atau mitra pertama" },
  ],
};

// Desktop icons definition
const desktopIcons = (toolStatus: DashboardData["toolStatus"], currentPhase: number) => [
  { icon: "📊", label: "Health Score", sub: "72 / 100", href: "/roadmap" },
  { icon: "🗺️", label: "Roadmap", sub: `Fase ${currentPhase}/4`, href: "/roadmap" },
  { icon: "💰", label: "Kalkulator HPP", sub: toolStatus.hpp ? "✓ Data ada" : "Belum dimulai", href: "/tools/hpp" },
  { icon: "⚖️", label: "Break-Even", sub: toolStatus.breakEven ? "✓ Selesai" : "Belum dimulai", href: "/tools/break-even" },
  { icon: "📋", label: "SOP Builder", sub: toolStatus.sop ? "✓ Selesai" : "Belum dimulai", href: "/tools/sop" },
  { icon: "📈", label: "Cash Flow", sub: toolStatus.cashflow ? "✓ Selesai" : "Belum dimulai", href: "/tools/cashflow" },
  { icon: "🤖", label: "BizBot AI", sub: "Konsultasi", href: "/konsultasi" },
  { icon: "👤", label: "Profil Saya", sub: "Edit data", href: "/profil" },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    currentPhase: 1,
    userName: "Pengusaha",
    toolStatus: { hpp: false, breakEven: false, sop: false, cashflow: false, hppMarginLow: false },
    loading: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const profileRes = await fetch("/api/user/profile", { cache: "no-store" });
        const { data: profile } = await profileRes.json();
        const currentPhase = profile?.current_phase ?? 1;
        const userName = profile?.full_name || "Pengusaha";

        const [hppRes, beRes, sopRes, cfRes] = await Promise.all([
          fetch("/api/tools/hpp", { cache: "no-store" }),
          fetch("/api/tools/break-even", { cache: "no-store" }),
          fetch("/api/tools/sop", { cache: "no-store" }),
          fetch("/api/tools/cashflow", { cache: "no-store" }),
        ]);
        const [hppJson, beJson, sopJson, cfJson] = await Promise.all([
          hppRes.json(), beRes.json(), sopRes.json(), cfRes.json(),
        ]);

        const hppDone = Array.isArray(hppJson.data?.produkList) && hppJson.data.produkList.length > 0;
        const beDone = !!(beJson.data && Object.keys(beJson.data).length > 0);
        const sopDone = !!(sopJson.data && Object.keys(sopJson.data).length > 0);
        const cfDone = !!(cfJson.data && Object.keys(cfJson.data).length > 0);

        let hppMarginLow = false;
        if (hppDone) {
          const products = hppJson.data.produkList;
          hppMarginLow = products.some((p: any) => p.targetMargin < 20);
        }

        setData({
          currentPhase,
          userName,
          toolStatus: { hpp: hppDone, breakEven: beDone, sop: sopDone, cashflow: cfDone, hppMarginLow },
          loading: false,
        });
      } catch (e) {
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    load();
  }, []);

  const { currentPhase, userName, toolStatus, loading } = data;

  const toolsCompleted = [toolStatus.hpp, toolStatus.breakEven, toolStatus.sop, toolStatus.cashflow].filter(Boolean).length;
  const healthScore = Math.min(100, Math.round(((currentPhase - 1) / 4) * 50 + (toolsCompleted / 4) * 50));

  const checklist = PHASE_CHECKLISTS[currentPhase] ?? [];
  const completedItems = checklist.filter(c => {
    if (!c.toolKey) return false;
    return toolStatus[c.toolKey as keyof typeof toolStatus];
  });
  const phaseProgressPct = checklist.length > 0
    ? Math.round((completedItems.length / checklist.length) * 100)
    : 0;

  const icons = desktopIcons(toolStatus, currentPhase);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="win-panel p-4 text-[13px]">
          <div className="win-titlebar mb-2">⌛ Memuat...</div>
          <p>Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alert: Margin Low */}
      {toolStatus.hppMarginLow && (
        <RetroAlert variant="warning" title="Perhatian: Margin Menipis">
          Ada produk dengan margin di bawah 20%.{" "}
          <Link href="/tools/hpp">Buka Kalkulator HPP »</Link>
        </RetroAlert>
      )}

      {/* Main Window — My Computer style */}
      <Window
        title={`📊 Dashboard — Selamat Datang, ${userName}!`}
        icon="📊"
        statusBar={`${icons.length} items | Fase aktif: ${PHASE_TITLES[currentPhase] || "Selesai"} | Health Score: ${healthScore}`}
        menuBar={
          <>
            <span className="menubar-item">File</span>
            <span className="menubar-item">Tampilan</span>
            <span className="menubar-item">Tools</span>
            <span className="menubar-item">Bantuan</span>
          </>
        }
      >
        {/* Icon Grid — My Computer style */}
        <div
          className="p-4 min-h-[300px]"
          style={{
            background: "var(--input, #FFFFFF)",
            boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #FFFFFF, inset 2px 2px 0 #404040"
          }}
        >
          <div className="flex flex-wrap gap-2">
            {icons.map((icon, i) => (
              <Link key={i} href={icon.href} className="no-underline">
                <div className="desktop-icon group">
                  <span className="desktop-icon-emoji">{icon.icon}</span>
                  <span className="desktop-icon-label group-hover:bg-[#000080] group-hover:text-white">
                    {icon.label}
                  </span>
                  <span className="text-[10px] text-[#444444] dark:text-[#808080] leading-tight">
                    {icon.sub}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Window>

      {/* Phase Progress Window */}
      <Window
        title={`🗺️ Roadmap Saat Ini — Fase ${currentPhase}: ${PHASE_TITLES[currentPhase] || "Selesai"}`}
        icon="🗺️"
        statusBar={`Progress: ${phaseProgressPct}% | ${completedItems.length} dari ${checklist.length} tugas selesai`}
      >
        <div className="p-4 bg-[#C0C0C0] dark:bg-[#1A1A1A] flex flex-col md:flex-row gap-4">
          {/* Progress bar section */}
          <div className="flex-1 space-y-3">
            <p className="text-[13px]">
              {currentPhase === 1 && "Pastikan ide bisnis Anda benar-benar dibutuhkan pasar."}
              {currentPhase === 2 && "Hitung keuangan dasar dan bangun fondasi operasional."}
              {currentPhase === 3 && "Dapatkan 10 pelanggan pertama dengan strategi organik."}
              {currentPhase === 4 && "Perbaiki proses berdasarkan feedback dan skalakan bisnis."}
            </p>

            <div>
              <div className="label-retro mb-1">Progress Fase {currentPhase}:</div>
              <RetroProgress value={phaseProgressPct} showPercent />
            </div>

            <div>
              <div className="label-retro mb-1">Health Score Bisnis:</div>
              <RetroProgress value={healthScore} showPercent label={`Status: ${healthScore >= 70 ? "Sehat" : healthScore >= 40 ? "Berkembang" : "Mulai"}`} />
            </div>

            <Link href="/roadmap" className="btn-retro btn-retro-primary inline-block no-underline text-inherit">
              Lihat Roadmap Lengkap »
            </Link>
          </div>

          {/* Checklist section */}
          <div
            className="w-full md:w-64 p-3"
            style={{
              boxShadow: "inset 1px 1px 0 #808080, inset 2px 2px 0 #404040",
              background: "var(--input, #FFFFFF)"
            }}
          >
            <div className="label-retro mb-2 font-bold">Checklist Fase {currentPhase}:</div>
            <ul className="space-y-1.5">
              {checklist.map((c, i) => {
                const done = c.toolKey ? !!toolStatus[c.toolKey as keyof typeof toolStatus] : false;
                return (
                  <li key={i} className="flex items-center gap-2 text-[13px]">
                    <input type="checkbox" readOnly checked={done} className="checkbox-retro" />
                    <span className={done ? "line-through text-[#808080]" : ""}>
                      {c.href ? (
                        <Link href={c.href}>{c.label}</Link>
                      ) : c.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Window>
    </div>
  );
}
