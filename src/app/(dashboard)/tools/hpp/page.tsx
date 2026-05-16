"use client";

import { useState, useEffect } from "react";
import { Window } from "@/components/retro/Window";
import { RetroAlert } from "@/components/retro/RetroAlert";

interface Bahan { id: string; nama: string; qty: number; satuan: string; hargaSat: number; }
interface Produk { id: string; nama: string; kategori: string; targetMargin: number; bahan: Bahan[]; packaging: number; tenagaKerja: number; overhead: number; }

const KATEGORI = ["Makanan", "Minuman", "Fashion/Pakaian", "Kerajinan", "Jasa", "Digital", "Lainnya"];
const SATUAN = ["gram", "kg", "ml", "liter", "pcs", "buah", "ikat", "porsi", "cup", "bungkus"];

const uid = () => Math.random().toString(36).slice(2);
const newBahan = (): Bahan => ({ id: uid(), nama: "", qty: 1, satuan: "gram", hargaSat: 0 });
const newProduk = (): Produk => ({ id: uid(), nama: "Produk Baru", kategori: "Makanan", targetMargin: 40, bahan: [newBahan()], packaging: 0, tenagaKerja: 0, overhead: 0 });

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const parseRp = (v: string) => parseInt(v.replace(/[^0-9]/g, ""), 10) || 0;

function calcProduk(p: Produk) {
  const totalBahan = p.bahan.reduce((s, b) => s + b.qty * b.hargaSat, 0);
  const hpp = totalBahan + p.packaging + p.tenagaKerja + p.overhead;
  const hargaJual = hpp * (1 + p.targetMargin / 100);
  return { totalBahan, hpp, hargaJual, profit: hargaJual - hpp };
}

export default function HppPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const active = produkList.find(p => p.id === activeId) ?? null;

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

  const updateActive = (updater: (p: Produk) => Produk) => {
    setProdukList(list => list.map(p => p.id === activeId ? updater(p) : p));
  };

  const setField = <K extends keyof Produk>(key: K, val: Produk[K]) =>
    updateActive(p => ({ ...p, [key]: val }));

  const setBahanField = (bahanId: string, key: keyof Bahan, val: string | number) =>
    updateActive(p => ({ ...p, bahan: p.bahan.map(b => b.id === bahanId ? { ...b, [key]: val } : b) }));

  const addBahan = () => updateActive(p => ({ ...p, bahan: [...p.bahan, newBahan()] }));
  const removeBahan = (bahanId: string) => updateActive(p => ({ ...p, bahan: p.bahan.filter(b => b.id !== bahanId) }));

  const addProduk = () => {
    const p = newProduk();
    setProdukList(prev => [...prev, p]);
    setActiveId(p.id);
  };

  const deleteProduk = (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    setProdukList(prev => {
      const next = prev.filter(p => p.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  };

  const handleSave = async () => {
    if (!active) return;
    if (!active.nama.trim()) { showToast("⚠️ Nama produk kosong!"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/tools/hpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produkList }),
      });
      if (!res.ok) throw new Error();
      showToast("✅ Disimpan!");
    } catch {
      showToast("❌ Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const calc = active ? calcProduk(active) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {toast && (
        <RetroAlert variant={toast.includes("❌") ? "error" : "success"} className="mb-4">
          {toast}
        </RetroAlert>
      )}

      <Window
        title="💰 Kalkulator HPP & Harga Jual"
        icon="💰"
        menuBar={
          <>
            <span className="menubar-item" onClick={handleSave}>File (Simpan)</span>
            <span className="menubar-item" onClick={addProduk}>Produk Baru</span>
          </>
        }
        statusBar={`Total: ${produkList.length} Produk | Status: ${saving ? "Menyimpan..." : "Ready"}`}
      >
        <div className="flex flex-col md:flex-row h-full min-h-[500px] bg-[#C0C0C0] dark:bg-[#1A1A1A]">
          {/* Sidebar / ListBox */}
          <div className="w-full md:w-64 shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-[#808080]">
            <div className="p-2 border-b border-[#808080] flex justify-between items-center bg-[#C0C0C0] dark:bg-[#1A1A1A]">
              <span className="label-retro mb-0 font-bold">Daftar Produk:</span>
              <button onClick={addProduk} className="btn-retro px-2 py-0 text-[11px]" title="Tambah Produk Baru">+</button>
            </div>
            <div className="flex-1 p-2 bg-[#FFFFFF] dark:bg-[#000000] win-inset overflow-y-auto">
              {produkList.length === 0 ? (
                <div className="text-[13px] text-[#808080] italic p-2">Belum ada produk.</div>
              ) : (
                <ul className="space-y-0.5">
                  {produkList.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => setActiveId(p.id)}
                      className={`text-[13px] px-2 py-1 cursor-pointer select-none flex justify-between group ${
                        activeId === p.id ? "bg-[#000080] text-[#FFFFFF]" : "hover:bg-[#000080] hover:text-[#FFFFFF]"
                      }`}
                    >
                      <span className="truncate">{p.nama || "Tanpa Nama"}</span>
                      {produkList.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProduk(p.id); }}
                          className={`text-[11px] px-1 ${activeId === p.id ? "text-white hover:bg-red-600" : "text-[#800000] opacity-0 group-hover:opacity-100"}`}
                          title="Hapus"
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1 flex flex-col">
            {!active || !calc ? (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-[#808080] text-[13px]">
                <div>
                  <div className="text-4xl mb-2">📁</div>
                  <p>Pilih produk di samping atau buat produk baru.</p>
                  <button onClick={addProduk} className="btn-retro mt-4">Buat Produk Baru</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full">
                {/* Form Toolbar */}
                <div className="p-2 border-b border-[#808080] bg-[#C0C0C0] dark:bg-[#1A1A1A] flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xl leading-none">📦</span>
                    <input
                      value={active.nama}
                      onChange={(e) => setField("nama", e.target.value)}
                      placeholder="Nama Produk (Misal: Kopi Susu Aren)"
                      className="input-retro text-[13px] font-bold w-full max-w-sm"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-retro btn-retro-primary shrink-0"
                  >
                    💾 {saving ? "..." : "Simpan"}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Inputs */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-retro font-bold">Kategori:</label>
                        <select
                          value={active.kategori}
                          onChange={(e) => setField("kategori", e.target.value)}
                          className="input-retro bg-white"
                        >
                          {KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label-retro font-bold text-[#000080]">Target Margin Profit (%):</label>
                        <input
                          type="number"
                          value={active.targetMargin || ""}
                          onChange={(e) => setField("targetMargin", Number(e.target.value))}
                          className="input-retro"
                        />
                      </div>
                    </div>

                    {/* Bahan Baku */}
                    <div className="win-panel p-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="label-retro font-bold">1. Bahan Baku</span>
                        <button onClick={addBahan} className="btn-retro text-[11px] px-2 py-0.5">+ Tambah Bahan</button>
                      </div>

                      <div className="overflow-x-auto win-inset bg-white dark:bg-black p-1">
                        <table className="w-full text-left border-collapse" style={{ minWidth: 400 }}>
                          <thead>
                            <tr className="bg-[#C0C0C0] dark:bg-[#333333] text-[11px]">
                              <th className="font-normal border border-[#808080] px-1 py-0.5">Nama Bahan</th>
                              <th className="font-normal border border-[#808080] px-1 py-0.5 w-16">Qty</th>
                              <th className="font-normal border border-[#808080] px-1 py-0.5 w-20">Satuan</th>
                              <th className="font-normal border border-[#808080] px-1 py-0.5 w-28">Harga / Satuan</th>
                              <th className="font-normal border border-[#808080] px-1 py-0.5 w-8 text-center">X</th>
                            </tr>
                          </thead>
                          <tbody>
                            {active.bahan.map((b) => (
                              <tr key={b.id} className="text-[13px]">
                                <td className="p-0.5">
                                  <input value={b.nama} onChange={(e) => setBahanField(b.id, "nama", e.target.value)} placeholder="Contoh: Susu" className="w-full p-1 border-none focus:outline-none bg-transparent" />
                                </td>
                                <td className="p-0.5 border-l border-[#DFDFDF] dark:border-[#404040]">
                                  <input type="number" value={b.qty || ""} onChange={(e) => setBahanField(b.id, "qty", Number(e.target.value))} className="w-full p-1 border-none focus:outline-none bg-transparent" />
                                </td>
                                <td className="p-0.5 border-l border-[#DFDFDF] dark:border-[#404040]">
                                  <select value={b.satuan} onChange={(e) => setBahanField(b.id, "satuan", e.target.value)} className="w-full p-1 border-none focus:outline-none bg-transparent">
                                    {SATUAN.map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </td>
                                <td className="p-0.5 border-l border-[#DFDFDF] dark:border-[#404040] relative">
                                  <span className="absolute left-1 top-1 text-[#808080] text-[11px]">Rp</span>
                                  <input value={b.hargaSat || ""} onChange={(e) => setBahanField(b.id, "hargaSat", parseRp(e.target.value))} className="w-full p-1 pl-5 border-none focus:outline-none bg-transparent" />
                                </td>
                                <td className="p-0.5 border-l border-[#DFDFDF] dark:border-[#404040] text-center">
                                  <button onClick={() => removeBahan(b.id)} className="text-[#800000] font-bold px-1 hover:bg-[#800000] hover:text-white" title="Hapus">✕</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-right text-[11px] font-bold mt-1 text-[#000080]">
                        Subtotal Bahan: {fmt(calc.totalBahan)}
                      </div>
                    </div>

                    {/* Biaya Lainnya */}
                    <div className="win-panel p-2">
                      <span className="label-retro font-bold mb-2">2. Biaya Lainnya (Per Porsi/Unit)</span>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[13px]">
                          <span className="w-32 shrink-0">Kemasan:</span>
                          <span className="shrink-0 text-[#808080]">Rp</span>
                          <input type="text" value={active.packaging || ""} onChange={(e) => setField("packaging", parseRp(e.target.value))} className="input-retro flex-1" />
                        </div>
                        <div className="flex items-center gap-2 text-[13px]">
                          <span className="w-32 shrink-0">Tenaga Kerja:</span>
                          <span className="shrink-0 text-[#808080]">Rp</span>
                          <input type="text" value={active.tenagaKerja || ""} onChange={(e) => setField("tenagaKerja", parseRp(e.target.value))} className="input-retro flex-1" />
                        </div>
                        <div className="flex items-center gap-2 text-[13px]">
                          <span className="w-32 shrink-0">Overhead (Listrik dll):</span>
                          <span className="shrink-0 text-[#808080]">Rp</span>
                          <input type="text" value={active.overhead || ""} onChange={(e) => setField("overhead", parseRp(e.target.value))} className="input-retro flex-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Result */}
                  <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
                    <div className="win-panel p-0 bg-[#008080] text-white">
                      <div className="win-titlebar bg-[#000080]">
                        <span>🧾 Hasil Perhitungan</span>
                      </div>
                      <div className="p-3">
                        <div className="mb-4">
                          <span className="text-[11px] uppercase block mb-1">Total Modal (HPP):</span>
                          <span className="text-xl font-bold font-mono">{fmt(calc.hpp)}</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-[11px] uppercase block mb-1 text-[#FFFF00]">Harga Jual Saran:</span>
                          <span className="text-2xl font-bold font-mono text-[#FFFF00] bg-black px-2 py-1 inline-block border border-white/20">
                            {fmt(calc.hargaJual)}
                          </span>
                        </div>
                        <div className="win-inset bg-white text-black p-2 text-[13px]">
                          <div className="flex justify-between border-b border-dashed border-[#808080] pb-1 mb-1">
                            <span>Profit / Unit:</span>
                            <span className="font-bold text-[#008000]">{fmt(calc.profit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Margin:</span>
                            <span className="font-bold">{active.targetMargin}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <RetroAlert variant="info" title="Info HPP">
                      Harga jual disarankan sudah termasuk margin profit bersih {active.targetMargin}% per transaksi. Sesuaikan dengan daya beli target pasar Anda.
                    </RetroAlert>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Window>
    </div>
  );
}
