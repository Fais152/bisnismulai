"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, BarChart3, Layout, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">BisnisMulai</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#fitur" className="hover:text-primary transition-colors">Fitur</Link>
          <Link href="#roadmap" className="hover:text-primary transition-colors">Roadmap 6 Fase</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(29,158,117,0.3)] hover:shadow-[0_0_25px_rgba(29,158,117,0.5)]"
          >
            Mulai Gratis
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 z-10 relative">
        <section className="container mx-auto px-6 pt-24 pb-32 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-8 border border-border/50">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Platform Bimbingan Bisnis #1 di Indonesia
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground">
              Bangun Bisnis dari Nol, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#5DCAA5]">
                Secara Sistematis.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Panduan terstruktur berbasis 6 fase, ekosistem kalkulator bisnis, dan sistem advisory otomatis untuk membantu Anda meminimalisir kegagalan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(29,158,117,0.3)] hover:scale-105"
              >
                Mulai Perjalanan Anda <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-full font-semibold hover:bg-secondary/80 transition-all border border-border/50">
                <Play className="w-5 h-5" /> Lihat Demo
              </button>
            </div>
          </motion.div>

          {/* Stats / Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-border/30"
          >
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">10k+</div>
              <div className="text-sm text-muted-foreground">Pengusaha Pemula</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">6 Fase</div>
              <div className="text-sm text-muted-foreground">Roadmap Sistematis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">8+</div>
              <div className="text-sm text-muted-foreground">Tools Kalkulator</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Advisory Otomatis</div>
            </div>
          </motion.div>
        </section>

        {/* Features Showcase */}
        <section id="fitur" className="py-24 bg-card/30 border-y border-border/30 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Semua Tool yang Anda Butuhkan</h2>
              <p className="text-muted-foreground">Tidak perlu lagi memakai Excel yang rumit. Semuanya terintegrasi dalam satu platform cerdas.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Kalkulator HPP & Margin</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Hitung biaya produksi, overhead, dan temukan harga jual ideal Anda secara otomatis tanpa pusing rumus.
                </p>
                <Link href="#" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Pelajari <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 2 */}
              <div className="bg-card p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Layout className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Business Model Canvas</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Petakan strategi bisnis Anda dalam 9 blok interaktif yang saling terhubung dengan metrik keuangan.
                </p>
                <Link href="#" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Pelajari <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 3 */}
              <div className="bg-card p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Cash Flow Projector</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Proyeksikan arus kas 12 bulan ke depan. Sistem akan memberi peringatan jika ada potensi kehabisan dana.
                </p>
                <Link href="#" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Pelajari <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="py-24 container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Roadmap 6 Fase yang Jelas</h2>
              <p className="text-lg text-muted-foreground mb-8">Kami memandu Anda langkah demi langkah. Setiap fase memiliki checklist wajib sebelum Anda bisa lanjut ke tahap berikutnya.</p>

              <div className="space-y-6">
                {[
                  { phase: "01", title: "Mental Reset", desc: "Bongkar mindset sebelum mulai." },
                  { phase: "02", title: "Validasi Ide", desc: "Uji ide sebelum modal keluar." },
                  { phase: "03", title: "Bangun Fondasi", desc: "Sistem sebelum skala." },
                  { phase: "04", title: "Launch Pertama", desc: "Dapatkan 10 pelanggan pertama." },
                  { phase: "05", title: "Stabilisasi", desc: "Dari chaos ke sistem yang berulang." },
                  { phase: "06", title: "Skala", desc: "Tumbuh dengan sengaja, bukan kebetulan." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-sm font-bold text-foreground border border-border">
                      {item.phase}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />
              <div className="relative bg-card rounded-2xl border border-border/50 shadow-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                  <span className="font-semibold text-foreground">Health Score</span>
                  <span className="text-primary font-bold text-xl">85/100</span>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]" />
                  </div>
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <div className="flex gap-3">
                      <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/90">
                        <strong className="text-primary">Advisory:</strong> Margin produk Anda sehat di atas 30%. Siap untuk skala pemasaran.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card py-12 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="text-primary w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-foreground">BisnisMulai</span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Bimbingan sistematis untuk calon pengusaha cerdas Indonesia.
          </p>
          <div className="text-sm text-muted-foreground/60">
            © {new Date().getFullYear()} BisnisMulai. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
