"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Calculator, TrendingUp, FileText, BarChart2, ChevronRight, Sparkles } from "lucide-react";

const tools = [
  {
    slug: "hpp",
    name: "Kalkulator HPP",
    description: "Hitung Harga Pokok Penjualan dan tentukan harga jual yang tepat agar bisnis Anda tidak merugi.",
    icon: Calculator,
    href: "/tools/hpp",
    status: "available",
    tags: ["Keuangan", "Produksi"],
  },
  {
    slug: "break-even",
    name: "Break-Even Analysis",
    description: "Cari tahu berapa unit yang harus terjual agar bisnis Anda mulai balik modal.",
    icon: TrendingUp,
    href: "/tools/break-even",
    status: "available",
    tags: ["Keuangan", "Perencanaan"],
  },
  {
    slug: "cashflow",
    name: "Proyeksi Cashflow",
    description: "Buat simulasi arus kas bulanan selama 12 bulan ke depan dengan berbagai skenario.",
    icon: BarChart2,
    href: "/tools/cashflow",
    status: "available",
    tags: ["Keuangan", "Proyeksi"],
  },
  {
    slug: "sop",
    name: "SOP Builder",
    description: "Buat Standar Operasional Prosedur yang terstruktur untuk setiap aspek bisnis Anda.",
    icon: FileText,
    href: "/tools/sop",
    status: "available",
    tags: ["Operasional", "Dokumentasi"],
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemAnim: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

export default function ToolsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemAnim}>
        <h1 className="text-3xl font-bold tracking-tight">Tools &amp; Kalkulator</h1>
        <p className="text-muted-foreground mt-2">
          Alat bantu bisnis yang dirancang khusus untuk membantu Anda mengambil keputusan finansial yang tepat.
        </p>
      </motion.div>

      {/* Available Tools */}
      <motion.section variants={itemAnim}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tersedia Sekarang</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools
            .filter((t) => t.status === "available")
            .map((tool) => (
              <Link href={tool.href} key={tool.slug}>
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-panel rounded-2xl p-6 border border-primary/20 hover:border-primary/60 hover:shadow-[0_8px_30px_rgba(37,99,235,0.15)] transition-all cursor-pointer group h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{tool.description}</p>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Link>
            ))}
        </div>
      </motion.section>

      {/* Coming Soon */}
      <motion.section variants={itemAnim}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> Segera Hadir
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools
            .filter((t) => t.status === "coming_soon")
            .map((tool) => (
              <div
                key={tool.slug}
                className="glass-panel rounded-2xl p-6 opacity-60 cursor-not-allowed h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <tool.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{tool.description}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
