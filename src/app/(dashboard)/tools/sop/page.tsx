"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, FileText, CheckCircle2, Copy, Info, ListChecks, Lightbulb } from "lucide-react";
import Link from "next/link";

interface SopData {
  title: string;
  objective: string;
  scope: string;
  steps: string[];
}

const emptySop: SopData = {
  title: "",
  objective: "",
  scope: "",
  steps: [""],
};

const guidances = [
  {
    title: "SOP Layanan Pelanggan",
    objective: "Memberikan standar pelayanan yang ramah, cepat, dan solutif kepada pelanggan.",
    scope: "Berlaku untuk semua admin WhatsApp, kasir, dan staf front-liner.",
    steps: [
      "Sapa pelanggan dengan ramah: 'Selamat pagi/siang, dengan [Nama Anda], ada yang bisa dibantu?'",
      "Dengarkan keluhan atau pertanyaan pelanggan tanpa memotong pembicaraan.",
      "Berikan solusi maksimal dalam waktu 5 menit. Jika butuh waktu, janjikan waktu follow-up.",
      "Tutup percakapan dengan: 'Terima kasih, semoga harinya menyenangkan!'"
    ]
  },
  {
    title: "SOP Pengemasan Barang (Packing)",
    objective: "Memastikan barang dikemas dengan aman, rapi, dan sesuai pesanan sebelum dikirim.",
    scope: "Berlaku untuk staf gudang dan admin pengiriman.",
    steps: [
      "Cetak resi dan siapkan barang sesuai pesanan (lakukan cross-check).",
      "Bungkus barang dengan bubble wrap (minimal 2 lapis untuk barang pecah belah).",
      "Masukkan ke dalam kardus, rekatkan lakban dengan pola 'H' agar kuat.",
      "Tempel resi di bagian atas kardus yang rata. Pastikan barcode terlihat jelas."
    ]
  }
];

export default function SopBuilderPage() {
  const [data, setData] = useState<SopData>(emptySop);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeGuidanceIndex, setActiveGuidanceIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/tools/sop")
      .then((r) => r.json())
      .then(({ data: savedData }) => {
        if (savedData && Object.keys(savedData).length > 0) {
          setData(savedData);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/tools/sop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Draf SOP berhasil disimpan!");
    } catch {
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  const addStep = () => setData(prev => ({ ...prev, steps: [...prev.steps, ""] }));
  const updateStep = (index: number, val: string) => {
    const newSteps = [...data.steps];
    newSteps[index] = val;
    setData(prev => ({ ...prev, steps: newSteps }));
  };
  const removeStep = (index: number) => {
    setData(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));
  };

  const copyToClipboard = () => {
    const text = `
SOP: ${data.title || "Tanpa Judul"}

1. TUJUAN
${data.objective || "-"}

2. RUANG LINGKUP
${data.scope || "-"}

3. PROSEDUR / LANGKAH-LANGKAH
${data.steps.map((s, i) => `${i + 1}. ${s || "-"}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const useGuidance = (guidance: typeof guidances[0]) => {
    if (confirm("Ganti isi draf Anda saat ini dengan template ini?")) {
      setData(guidance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20 space-y-8"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium">SOP Builder</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            SOP Builder
          </h1>
          <p className="text-muted-foreground mt-2">
            Buat Standar Operasional Prosedur untuk bisnis Anda dari kanvas kosong atau gunakan panduan.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2.5 rounded-xl font-medium hover:bg-secondary/80 transition-all"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Tersalin!" : "Salin Teks"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Menyimpan..." : "Simpan Draf"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Blank Canvas Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-8 bg-background/50 border-t-4 border-t-primary shadow-xl shadow-primary/5">
            
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Judul SOP</label>
              <input
                type="text"
                placeholder="Contoh: SOP Pelayanan Pelanggan WhatsApp"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full bg-transparent border-b-2 border-border/50 pb-2 text-2xl font-bold focus:border-primary outline-none transition-colors placeholder:text-muted"
              />
            </div>

            {/* Objective */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2 flex items-center gap-2">
                <TargetIcon /> Tujuan
              </label>
              <textarea
                rows={2}
                placeholder="Apa hasil akhir yang diharapkan dari prosedur ini?"
                value={data.objective}
                onChange={(e) => setData({ ...data, objective: e.target.value })}
                className="w-full bg-secondary/30 border border-border/50 rounded-xl p-4 text-sm focus:ring-2 ring-primary/40 outline-none transition-all resize-none"
              />
            </div>

            {/* Scope */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" /> Ruang Lingkup & Pihak Terkait
              </label>
              <textarea
                rows={2}
                placeholder="SOP ini berlaku untuk siapa saja? (Misal: Staf Gudang, Kasir)"
                value={data.scope}
                onChange={(e) => setData({ ...data, scope: e.target.value })}
                className="w-full bg-secondary/30 border border-border/50 rounded-xl p-4 text-sm focus:ring-2 ring-primary/40 outline-none transition-all resize-none"
              />
            </div>

            {/* Steps */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-4 flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> Prosedur / Langkah-langkah
              </label>
              <div className="space-y-3">
                {data.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <textarea
                      rows={2}
                      placeholder={`Langkah ke-${index + 1}...`}
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="flex-1 bg-secondary/30 border border-border/50 rounded-xl p-3 text-sm focus:ring-2 ring-primary/40 outline-none transition-all resize-none"
                    />
                    <button
                      onClick={() => removeStep(index)}
                      disabled={data.steps.length === 1}
                      className="p-2 h-8 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addStep}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                + Tambah Langkah
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Guidance / Suggestions */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-500/5">
            <h3 className="font-bold text-amber-500 flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" /> Tips Membuat SOP
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
              <li>Gunakan kalimat perintah yang jelas (contoh: "Buka kemasan", bukan "Kemasan dibuka").</li>
              <li>Satu langkah = satu tindakan. Jangan gabungkan banyak instruksi di satu nomor.</li>
              <li>Gunakan bahasa yang mudah dipahami oleh staf baru sekalipun.</li>
            </ul>
          </div>

          <h3 className="font-bold text-sm text-muted-foreground mt-6 mb-3 uppercase tracking-wider">Referensi / Template</h3>
          {guidances.map((g, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-5 hover:border-primary/30 transition-colors">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setActiveGuidanceIndex(activeGuidanceIndex === idx ? null : idx)}
              >
                <p className="font-bold text-sm">{g.title}</p>
                <span className="text-xs text-primary">{activeGuidanceIndex === idx ? "Tutup" : "Lihat"}</span>
              </div>
              
              {activeGuidanceIndex === idx && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 space-y-3 pt-3 border-t border-border/40 overflow-hidden">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">Tujuan:</span>
                    <p className="text-xs">{g.objective}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">Langkah:</span>
                    <ul className="text-xs list-decimal pl-4 space-y-1">
                      {g.steps.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                      <li className="text-muted-foreground italic">...dan {g.steps.length - 2} langkah lainnya</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => useGuidance(g)}
                    className="w-full mt-2 py-1.5 text-xs font-medium bg-secondary hover:bg-primary hover:text-white rounded-lg transition-colors"
                  >
                    Gunakan Template Ini
                  </button>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TargetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  );
}
