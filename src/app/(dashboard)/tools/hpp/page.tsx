"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Save, Calculator, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Bahan { id: string; nama: string; qty: number; satuan: string; hargaSat: number; }
interface Produk { id: string; nama: string; kategori: string; targetMargin: number; bahan: Bahan[]; packaging: number; tenagaKerja: number; overhead: number; }

const KATEGORI = ["Makanan", "Minuman", "Fashion/Pakaian", "Kerajinan", "Jasa", "Digital", "Lainnya"];
const SATUAN = ["gram", "kg", "ml", "liter", "pcs", "buah", "ikat", "porsi", "cup", "bungkus"];

function CustomSelect({ value, onChange, options, className }: { value: string; onChange: (v: string) => void; options: string[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className={cn("relative", className)}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-1 bg-background border border-border/50 rounded-xl px-3 py-2.5 text-sm outline-none text-left">
        <span className="truncate">{value}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1 w-full min-w-[110px] bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden">
            <div className="max-h-48 overflow-y-auto py-1">
              {options.map(opt => (
                <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                  className={cn("w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors", opt === value && "text-primary font-medium bg-primary/5")}>
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

const uid = () => Math.random().toString(36).slice(2);
const newBahan = (): Bahan => ({ id: uid(), nama: "", qty: 1, satuan: "gram", hargaSat: 0 });
const newProduk = (): Produk => ({ id: uid(), nama: "", kategori: "Makanan", targetMargin: 40, bahan: [newBahan()], packaging: 0, tenagaKerja: 0, overhead: 0 });

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const parseRp = (v: string) => parseInt(v.replace(/[^0-9]/g, ""), 10) || 0;

function calcProduk(p: Produk) {
  const totalBahan = p.bahan.reduce((s, b) => s + b.qty * b.hargaSat, 0);
  const hpp = totalBahan + p.packaging + p.tenagaKerja + p.overhead;
  const hargaJual = hpp * (1 + p.targetMargin / 100);
  return { totalBahan, hpp, hargaJual, profit: hargaJual - hpp };
}

export default function HppPage() {
  // ── Single source of truth: produkList ──────────────────────
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // Derive active product directly from produkList (no separate draft state)
  const active = produkList.find(p => p.id === activeId) ?? null;

  // ── Load from DB ────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/tools/hpp", { cache: "no-store" })
      .then(r => r.json())
      .then(({ data }) => {
        if (Array.isArray(data?.produkList) && data.produkList.length > 0) {
          setProdukList(data.produkList);
          setActiveId(data.produkList[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // ── All edits go directly into produkList ───────────────────
  const updateActive = (updater: (p: Produk) => Produk) => {
    setProdukList(list => list.map(p => p.id === activeId ? updater(p) : p));
  };

  const setField = <K extends keyof Produk>(key: K, val: Produk[K]) =>
    updateActive(p => ({ ...p, [key]: val }));

  const setBahanField = (bahanId: string, key: keyof Bahan, val: string | number) =>
    updateActive(p => ({ ...p, bahan: p.bahan.map(b => b.id === bahanId ? { ...b, [key]: val } : b) }));

  const addBahan = () => updateActive(p => ({ ...p, bahan: [...p.bahan, newBahan()] }));
  const removeBahan = (bahanId: string) => updateActive(p => ({ ...p, bahan: p.bahan.filter(b => b.id !== bahanId) }));

  // ── Product CRUD ─────────────────────────────────────────────
  const addProduk = () => {
    const p = newProduk();
    setProdukList(prev => [...prev, p]);
    setActiveId(p.id);
  };

  const deleteProduk = (id: string) => {
    setProdukList(prev => {
      const next = prev.filter(p => p.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  };

  // ── Save all to DB ───────────────────────────────────────────
  // produkList is always fresh (single source of truth)
  const handleSave = async () => {
    if (!active) return;
    if (!active.nama.trim()) { showToast("⚠️ Nama produk tidak boleh kosong!"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/tools/hpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produkList }),
      });
      if (!res.ok) throw new Error();
      showToast("✅ Data HPP berhasil disimpan!");
    } catch {
      showToast("❌ Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const calc = active ? calcProduk(active) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-0 rounded-2xl overflow-hidden border border-border/40 shadow-xl flex flex-col md:flex-row">

      {/* ── Sidebar: Product List ─────────────────────────────── */}
      <div className="w-full md:w-64 shrink-0 bg-card/80 border-b md:border-b-0 md:border-r border-border/40 flex flex-col md:min-h-[600px]">
        <div className="p-4 border-b border-border/40 flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Produk</p>
            <p className="font-bold text-sm mt-0.5">({produkList.length})</p>
          </div>
          <button onClick={addProduk}
            className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shrink-0">
            <Plus className="h-3.5 w-3.5" /> Baru
          </button>
        </div>

        {/* Horizontal scroll on mobile, vertical on desktop */}
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto md:flex-1 p-2 gap-2 md:gap-0.5">
          {produkList.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6 px-4 w-full">
              Belum ada produk. Klik "+ Baru".
            </p>
          )}
          {produkList.map(p => {
            const c = calcProduk(p);
            return (
              <div key={p.id} role="button" tabIndex={0}
                onClick={() => setActiveId(p.id)}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && setActiveId(p.id)}
                className={cn(
                  "min-w-[150px] md:min-w-0 md:w-full shrink-0 text-left px-3 py-2.5 rounded-xl transition-all group cursor-pointer border",
                  activeId === p.id ? "bg-primary/10 border-primary/30" : "border-border/20 hover:bg-secondary/60 md:border-transparent"
                )}>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-medium truncate">{p.nama || "Produk Baru"}</span>
                  <button onClick={e => { e.stopPropagation(); deleteProduk(p.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive transition-all shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{fmt(c.hpp)} HPP</p>
                <p className="text-xs text-primary font-medium">{p.targetMargin}% margin</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main: Form ───────────────────────────────────────── */}
      {!active ? (
        <div className="flex-1 flex items-center justify-center bg-background/40 min-h-[400px] p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">Pilih produk atau buat produk baru</p>
            <button onClick={addProduk}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium mx-auto hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> Tambah Produk
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-background/40 min-w-0">
          {/* Form Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-border/40 flex flex-wrap items-center justify-between gap-3 bg-card/50 shrink-0">
            <h2 className="font-bold text-base sm:text-lg truncate">{active.nama || "Produk Baru"}</h2>
            <button onClick={handleSave} disabled={saving || !active.nama.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium shrink-0">
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-5">

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Nama Produk</label>
                  <input value={active.nama} onChange={e => setField("nama", e.target.value)} placeholder="Cth: Nasi Goreng"
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Kategori</label>
                  <CustomSelect value={active.kategori} onChange={v => setField("kategori", v)} options={KATEGORI} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Target Margin (%)</label>
                  <input type="number" min={0} max={1000} value={active.targetMargin}
                    onChange={e => setField("targetMargin", parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary/40" />
                </div>
              </div>

              {/* Bahan Baku */}
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between bg-card/50">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Komposisi Bahan Baku</h3>
                  <button onClick={addBahan}
                    className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 bg-primary/5 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors font-medium">
                    <Plus className="h-3.5 w-3.5" /> Bahan
                  </button>
                </div>

                {/* Mobile: Card layout */}
                <div className="sm:hidden p-3 space-y-3">
                  {active.bahan.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-4">Belum ada bahan. Klik '+ Bahan'.</p>
                  )}
                  {active.bahan.map(b => (
                    <div key={b.id} className="border border-border/30 rounded-xl p-3 space-y-2 bg-background/50">
                      <div className="flex gap-2">
                        <input value={b.nama} onChange={e => setBahanField(b.id, "nama", e.target.value)}
                          placeholder="Nama bahan..." className="flex-1 bg-transparent outline-none text-sm border-b border-border/30 pb-1" />
                        <button onClick={() => removeBahan(b.id)} disabled={active.bahan.length === 1}
                          className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">QTY</p>
                          <input type="number" min={0} step="0.1" value={b.qty}
                            onChange={e => setBahanField(b.id, "qty", parseFloat(e.target.value) || 0)}
                            className="w-full bg-background border border-border/40 rounded-lg px-2 py-1.5 text-sm outline-none" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">Satuan</p>
                          <CustomSelect value={b.satuan} onChange={v => setBahanField(b.id, "satuan", v)} options={SATUAN} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-[10px] text-muted-foreground mb-1">Harga/Satuan (Rp)</p>
                          <input value={b.hargaSat ? b.hargaSat.toLocaleString("id-ID") : ""}
                            onChange={e => setBahanField(b.id, "hargaSat", parseRp(e.target.value))}
                            placeholder="0" className="w-full bg-background border border-border/40 rounded-lg px-2 py-1.5 text-sm outline-none" />
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-muted-foreground mb-1">Total</p>
                          <p className="text-sm font-bold text-primary">{fmt(b.qty * b.hargaSat)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {active.bahan.length > 0 && (
                    <div className="flex justify-between text-sm px-1 font-medium">
                      <span className="text-muted-foreground">Total Bahan Baku</span>
                      <span className="text-primary">{fmt(calc?.totalBahan ?? 0)}</span>
                    </div>
                  )}
                </div>

                {/* Desktop: Table layout */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30 bg-secondary/30">
                        <th className="text-left text-xs text-muted-foreground font-medium px-4 py-2.5 min-w-[140px]">NAMA BAHAN</th>
                        <th className="text-right text-xs text-muted-foreground font-medium px-3 py-2.5 w-20">QTY</th>
                        <th className="text-left text-xs text-muted-foreground font-medium px-3 py-2.5 w-28">SATUAN</th>
                        <th className="text-right text-xs text-muted-foreground font-medium px-3 py-2.5 w-32">HARGA/SAT</th>
                        <th className="text-right text-xs text-muted-foreground font-medium px-4 py-2.5 w-32">TOTAL</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {active.bahan.length === 0 && (
                        <tr><td colSpan={6} className="text-center text-muted-foreground py-8 text-sm">Belum ada bahan baku. Klik '+ Bahan'.</td></tr>
                      )}
                      <AnimatePresence>
                        {active.bahan.map(b => (
                          <motion.tr key={b.id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                            <td className="px-4 py-2">
                              <input value={b.nama} onChange={e => setBahanField(b.id, "nama", e.target.value)}
                                placeholder="Nama bahan..." className="w-full bg-transparent outline-none text-sm" />
                            </td>
                            <td className="px-3 py-2">
                              <input type="number" min={0} step="0.1" value={b.qty}
                                onChange={e => setBahanField(b.id, "qty", parseFloat(e.target.value) || 0)}
                                className="w-full bg-transparent outline-none text-sm text-right" />
                            </td>
                            <td className="px-3 py-2">
                              <CustomSelect value={b.satuan} onChange={v => setBahanField(b.id, "satuan", v)} options={SATUAN} className="min-w-[100px]" />
                            </td>
                            <td className="px-3 py-2">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Rp</span>
                                <input value={b.hargaSat ? b.hargaSat.toLocaleString("id-ID") : ""}
                                  onChange={e => setBahanField(b.id, "hargaSat", parseRp(e.target.value))}
                                  placeholder="0" className="w-full bg-transparent outline-none text-sm text-right pl-6" />
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right font-medium text-primary">{fmt(b.qty * b.hargaSat)}</td>
                            <td className="pr-3 py-2">
                              <button onClick={() => removeBahan(b.id)} disabled={active.bahan.length === 1}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                    {active.bahan.length > 0 && (
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { label: "Packaging (Rp)", field: "packaging" },
                  { label: "Tenaga Kerja/Porsi (Rp)", field: "tenagaKerja" },
                  { label: "Overhead/Porsi (Rp)", field: "overhead" },
                ] as { label: string; field: keyof Produk }[]).map(({ label, field }) => (
                  <div key={field as string}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Rp</span>
                      <input
                        value={(active[field] as number) ? (active[field] as number).toLocaleString("id-ID") : ""}
                        onChange={e => setField(field, parseRp(e.target.value) as Produk[typeof field])}
                        placeholder="0"
                        className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary/40" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Auto Calculation */}
              {calc && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/20 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 bg-primary/20 border-b border-primary/20">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">Kalkulasi Otomatis (Per Porsi)</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
                    {[
                      { label: "Total Bahan", value: fmt(calc.totalBahan), highlight: false },
                      { label: "HPP/Porsi", value: fmt(calc.hpp), highlight: false },
                      { label: "Harga Jual", value: fmt(calc.hargaJual), sub: `Margin ${active.targetMargin}%`, highlight: true },
                      { label: "Profit/Porsi", value: fmt(calc.profit), highlight: true },
                    ].map(({ label, value, sub, highlight }) => (
                      <div key={label} className={cn("px-3 py-3 rounded-xl border", highlight ? "border-primary/20 bg-primary/5" : "border-border/30 bg-background/40")}>
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className={cn("text-base font-bold break-all", highlight ? "text-primary" : "text-foreground")}>{value}</p>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border/50 rounded-xl px-5 py-3 shadow-xl text-sm font-medium z-50">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
