import { CheckCircle2, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, Pengusaha!</h1>
          <p className="text-muted-foreground mt-1">
            Berikut adalah ringkasan performa dan tugas Anda hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border/50 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="text-sm">Health Score</div>
            <div className="font-bold text-primary text-xl">85</div>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex gap-4 items-start">
        <AlertTriangle className="text-warning h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-warning">Perhatian: Margin Menipis</h4>
          <p className="text-sm text-warning/90 mt-1">
            Berdasarkan input HPP terakhir, margin produk Anda turun di bawah 20%. Pertimbangkan untuk evaluasi harga jual atau tekan biaya bahan baku.
          </p>
          <Link href="/tools/hpp" className="text-sm font-medium text-warning hover:underline mt-2 inline-block">
            Buka Kalkulator HPP &rarr;
          </Link>
        </div>
      </div>

      {/* Phase Progress */}
      <section>
        <h2 className="text-xl font-bold mb-4">Roadmap Saat Ini: Fase 2</h2>
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">Bangun Sistem Bisnis</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Selesaikan perhitungan dasar dan struktur legal sebelum melangkah ke strategi akuisisi pelanggan.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress Fase 2</span>
                  <span className="text-primary font-bold">50%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2 rounded-full" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto bg-background/50 border border-border/50 rounded-xl p-4 min-w-[250px]">
              <h4 className="font-semibold text-sm mb-3">Checklist Tersisa:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="line-through">Hitung HPP</span>
                </li>
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <div className="h-4 w-4 rounded-full border-2 border-primary" />
                  Buat SOP Dasar
                </li>
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <div className="h-4 w-4 rounded-full border-2 border-primary" />
                  Tentukan Struktur Legal
                </li>
              </ul>
              <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Lanjutkan Fase
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tools */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tools Terakhir Digunakan</h2>
          <Link href="/tools" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Kalkulator HPP", desc: "Perbarui biaya produksi Anda", updated: "2 hari yang lalu" },
            { name: "Break-Even Analysis", desc: "Simulasi target penjualan", updated: "1 minggu yang lalu" },
            { name: "SOP Builder", desc: "SOP Layanan Pelanggan", updated: "Belum dimulai" }
          ].map((tool, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-colors group cursor-pointer">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{tool.desc}</p>
              <div className="text-xs text-muted-foreground/80 font-medium">
                {tool.updated}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
