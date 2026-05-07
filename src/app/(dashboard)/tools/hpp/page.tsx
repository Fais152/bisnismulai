"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Save, Calculator, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────
interface Bahan {
  id: string;
  nama: string;
  qty: number;
  satuan: string;
  hargaSat: number;
}

interface Produk {
  id: string;
  nama: string;
  kategori: string;
  targetMargin: number;
  bahan: Bahan[];
  packaging: number;
  tenagaKerja: number;
  overhead: number;
}

const KATEGORI = ["Makanan", "Minuman", "Fashion/Pakaian", "Kerajinan", "Jasa", "Digital", "Lainnya"];
const SATUAN   = ["gram", "kg", "ml", "liter", "pcs", "buah", "ikat", "porsi", "cup", "bungkus"];

// ── Custom Select (dark-mode safe) ────────────────────────────
function CustomSelect({ value, onChange, options, className }: {
  value: string; onChange: (v: string) => void;
  options: string[]; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-1 bg-background border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none text-left"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1 w-full bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-48 overflow-y-auto py-1">
              {options.map(opt => (
                <button
                  key={opt} type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors",
                    opt === value && "text-primary font-medium bg-primary/5"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const newBahan = (): Bahan => ({
  id: Math.random().toString(36).slice(2),
  nama: "", qty: 1, satuan: "gram", hargaSat: 0,
});

const newProduk = (): Produk => ({
  id: Math.random().toString(36).slice(2),
  nama: "", kategori: "Makanan", targetMargin: 40,
  bahan: [newBahan()], packaging: 0, tenagaKerja: 0, overhead: 0,
});

// ── Helpers ───────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const parseRupiah = (val: string) => parseInt(val.replace(/[^0-9]/g, ""), 10) || 0;

// ── Calculation ───────────────────────────────────────────────
function calcProduk(p: Produk) {
  const totalBahan = p.bahan.reduce((s, b) => s + b.qty * b.hargaSat, 0);
  const hpp        = totalBahan + p.packaging + p.tenagaKerja + p.overhead;
  const hargaJual  = hpp * (1 + p.targetMargin / 100);
  const profit     = hargaJual - hpp;
  return { totalBahan, hpp, hargaJual, profit };
}

// ── Component ─────────────────────────────────────────────────
export default function HppPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [activeId, setActiveId]     = useState<string | null>(null);
  const [isNew, setIsNew]           = useState(false);
  const [draft, setDraft]           = useState<Produk | null>(null);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState("");

  // Load
  useEffect(() => {
    fetch("/api/tools/hpp")
      .then(r => r.json())
      .then(({ data }) => {
        if (data?.produkList?.length) {
          setProdukList(data.produkList);
          setActiveId(data.produkList[0].id);
          setDraft(data.produkList[0]);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Save all to DB
  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const updated = produkList.map(p => p.id === draft.id ? draft : p);
    try {
      const res = await fetch("/api/tools/hpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produkList: updated }),
      });
      if (!res.ok) throw new Error();
      setProdukList(updated);
      showToast("✅ Data HPP berhasil disimpan!");
    } catch {
      showToast("❌ Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  // Add new product
  const handleNewProduk = () => {
    const p = newProduk();
    setProdukList(prev => [...prev, p]);
    setActiveId(p.id);
    setDraft(p);
    setIsNew(true);
  };

  // Select product
  const selectProduk = (p: Produk) => {
    setActiveId(p.id);
    setDraft({ ...p });
    setIsNew(false);
  };

  // Delete product
  const deleteProduk = (id: string) => {
    const updated = produkList.filter(p => p.id !== id);
    setProdukList(updated);
    if (activeId === id) {
      setActiveId(updated[0]?.id ?? null);
      setDraft(updated[0] ?? null);
    }
  };

  // Draft updaters
  const setField = <K extends keyof Produk>(key: K, val: Produk[K]) =>
    setDraft(d => d ? { ...d, [key]: val } : d);

  const setBahanField = (id: string, key: keyof Bahan, val: string | number) =>
    setDraft(d => d ? {
      ...d,
      bahan: d.bahan.map(b => b.id === id ? { ...b, [key]: val } : b),
    } : d);

  const addBahan    = () => setDraft(d => d ? { ...d, bahan: [...d.bahan, newBahan()] } : d);
  const removeBahan = (id: string) => setDraft(d => d ? { ...d, bahan: d.bahan.filter(b => b.id !== id) } : d);

  const calc = draft ? calcProduk(draft) : null;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex gap-0 rounded-2xl overflow-hidden border border-border/40 shadow-xl">

      {/* ── LEFT SIDEBAR: Product List ── */}
      <div className="w-64 shrink-0 bg-card/80 border-r border-border/40 flex flex-col">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Produk</p>
            <p className="font-bold text-sm mt-0.5">({produkList.length})</p>
          </div>
          <button
            onClick={handleNewProduk}
            className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="h-3.5 w-3.5" /> Baru
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
          {produkList.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8 px-4">
              Belum ada produk. Klik "+ Baru" untuk mulai.
            </p>
          )}
          {produkList.map(p => {
            const c = calcProduk(p);
            return (
              <button
                key={p.id}
                onClick={() => selectProduk(p)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl transition-all group",
                  activeId === p.id
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-secondary/60"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{p.nama || "Produk Baru"}</span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteProduk(p.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{fmt(c.hpp)} HPP</p>
                <p className="text-xs text-primary font-medium">{p.targetMargin}% margin</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: Form & Result ── */}
      {!draft ? (
        <div className="flex-1 flex items-center justify-center bg-background/40">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Pilih produk di kiri atau buat produk baru</p>
            <button
              onClick={handleNewProduk}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium mx-auto hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" /> Tambah Produk Baru
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden bg-background/40">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-card/50">
            <h2 className="font-bold text-lg">{isNew ? "Tambah Produk Baru" : "Edit Produk"}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (isNew) { deleteProduk(draft.id); setDraft(null); }
                  else { selectProduk(produkList.find(p => p.id === activeId)!); }
                  setIsNew(false);
                }}
                className="px-4 py-2 text-sm border border-border/50 rounded-xl hover:bg-secondary transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !draft.nama.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
              >
                <Save className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Nama Produk</label>
                  <input
                    value={draft.nama}
                    onChange={e => setField("nama", e.target.value)}
                    placeholder="Cth: Nasi Goreng"
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Kategori</label>
                  <CustomSelect
                    value={draft.kategori}
                    onChange={v => setField("kategori", v)}
                    options={KATEGORI}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Target Margin (%)</label>
                  <input
                    type="number" min={0} max={1000}
                    value={draft.targetMargin}
                    onChange={e => setField("targetMargin", parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none"
                  />
                </div>
              </div>

              {/* Bahan Baku Table */}
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between bg-card/50">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Komposisi Bahan Baku</h3>
                  <button
                    onClick={addBahan}
                    className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 bg-primary/5 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" /> Bahan
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30 bg-secondary/30">
                        <th className="text-left text-xs text-muted-foreground font-medium px-4 py-2.5 min-w-[150px]">NAMA BAHAN</th>
                        <th className="text-right text-xs text-muted-foreground font-medium px-3 py-2.5 w-20 min-w-[80px]">QTY</th>
                        <th className="text-left text-xs text-muted-foreground font-medium px-3 py-2.5 w-28 min-w-[110px]">SATUAN</th>
                        <th className="text-right text-xs text-muted-foreground font-medium px-3 py-2.5 w-32 min-w-[120px]">HARGA/SAT</th>
                        <th className="text-right text-xs text-muted-foreground font-medium px-4 py-2.5 w-32 min-w-[120px]">TOTAL</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {draft.bahan.length === 0 && (
                        <tr><td colSpan={6} className="text-center text-muted-foreground py-8 text-sm">Belum ada bahan baku. Klik '+ Bahan'.</td></tr>
                      )}
                      <AnimatePresence>
                        {draft.bahan.map(b => (
                          <motion.tr
                            key={b.id}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="border-b border-border/20 hover:bg-secondary/20 transition-colors"
                          >
                            <td className="px-4 py-2">
                              <input
                                value={b.nama}
                                onChange={e => setBahanField(b.id, "nama", e.target.value)}
                                placeholder="Nama bahan..."
                                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/50"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number" min={0} step="0.1"
                                value={b.qty}
                                onChange={e => setBahanField(b.id, "qty", parseFloat(e.target.value) || 0)}
                                className="w-full bg-transparent outline-none text-sm text-right"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <CustomSelect
                                value={b.satuan}
                                onChange={v => setBahanField(b.id, "satuan", v)}
                                options={SATUAN}
                                className="min-w-[100px]"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Rp</span>
                                <input
                                  value={b.hargaSat ? b.hargaSat.toLocaleString("id-ID") : ""}
                                  onChange={e => setBahanField(b.id, "hargaSat", parseRupiah(e.target.value))}
                                  placeholder="0"
                                  className="w-full bg-transparent outline-none text-sm text-right pl-7"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right font-medium text-primary text-sm">
                              {fmt(b.qty * b.hargaSat)}
                            </td>
                            <td className="pr-3 py-2">
                              <button
                                onClick={() => removeBahan(b.id)}
                                disabled={draft.bahan.length === 1}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                    {draft.bahan.length > 0 && (
                      <tfoot>
                        <tr className="bg-secondary/30">
                          <td colSpan={4} className="px-4 py-2.5 text-xs text-muted-foreground font-medium">Total Bahan Baku</td>
                          <td className="px-4 py-2.5 text-right font-bold text-primary">{fmt(calc?.totalBahan ?? 0)}</td>
                          <td />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              {/* Additional Costs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Packaging (Rp)", field: "packaging" as const },
                  { label: "Tenaga Kerja/Porsi (Rp)", field: "tenagaKerja" as const },
                  { label: "Overhead/Porsi (Rp)", field: "overhead" as const },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Rp</span>
                      <input
                        value={draft[field] ? (draft[field] as number).toLocaleString("id-ID") : ""}
                        onChange={e => setField(field, parseRupiah(e.target.value))}
                        placeholder="0"
                        className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Auto Calculation */}
              {calc && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/20 rounded-2xl overflow-hidden"
                >
                  <div className="px-5 py-3 bg-primary/20 border-b border-primary/20">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">Kalkulasi Otomatis (Per Porsi)</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-primary/10">
                    {[
                      { label: "Total Bahan", value: fmt(calc.totalBahan), sub: "" },
                      { label: "HPP/Porsi", value: fmt(calc.hpp), sub: "" },
                      { label: "Harga Jual", value: fmt(calc.hargaJual), sub: `Margin ${draft.targetMargin}%`, highlight: true },
                      { label: "Profit/Porsi", value: fmt(calc.profit), sub: "", highlight: true },
                    ].map(({ label, value, sub, highlight }) => (
                      <div key={label} className="px-5 py-4">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className={cn("text-lg font-bold", highlight ? "text-primary" : "text-foreground")}>{value}</p>
                        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border/50 rounded-xl px-5 py-3 shadow-xl text-sm font-medium z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
