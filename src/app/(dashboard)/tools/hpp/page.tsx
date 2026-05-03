"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Plus, Trash2, ArrowRight, Save, DollarSign } from "lucide-react";
import Link from "next/link";

interface CostItem {
  id: string;
  name: string;
  cost: number;
}

export default function HppCalculatorPage() {
  const [bahanBaku, setBahanBaku] = useState<CostItem[]>([{ id: "1", name: "", cost: 0 }]);
  const [tenagaKerja, setTenagaKerja] = useState<CostItem[]>([{ id: "1", name: "", cost: 0 }]);
  const [overhead, setOverhead] = useState<CostItem[]>([{ id: "1", name: "", cost: 0 }]);
  const [margin, setMargin] = useState<number>(20);
  const [unitProduksi, setUnitProduksi] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  // Calculations
  const totalBahanBaku = bahanBaku.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalTenagaKerja = tenagaKerja.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalOverhead = overhead.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  
  const totalHPP = totalBahanBaku + totalTenagaKerja + totalOverhead;
  const hppPerUnit = unitProduksi > 0 ? totalHPP / unitProduksi : 0;
  const hargaJual = hppPerUnit * (1 + margin / 100);
  const profitPerUnit = hargaJual - hppPerUnit;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const addItem = (setter: React.Dispatch<React.SetStateAction<CostItem[]>>) => {
    setter((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), name: "", cost: 0 }]);
  };

  const removeItem = (id: string, setter: React.Dispatch<React.SetStateAction<CostItem[]>>) => {
    setter((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: "name" | "cost", value: string | number, setter: React.Dispatch<React.SetStateAction<CostItem[]>>) => {
    setter((prev) => prev.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  useEffect(() => {
    // Load saved data on mount
    const loadData = async () => {
      try {
        const res = await fetch("/api/tools/hpp");
        if (res.ok) {
          const { data } = await res.json();
          if (data) {
            if (data.bahanBaku) setBahanBaku(data.bahanBaku);
            if (data.tenagaKerja) setTenagaKerja(data.tenagaKerja);
            if (data.overhead) setOverhead(data.overhead);
            if (data.margin) setMargin(data.margin);
            if (data.unitProduksi) setUnitProduksi(data.unitProduksi);
          }
        }
      } catch (err) {
        console.error("Failed to load HPP data", err);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        bahanBaku,
        tenagaKerja,
        overhead,
        margin,
        unitProduksi,
        totalHPP,
        hppPerUnit,
        hargaJual
      };
      const res = await fetch("/api/tools/hpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error("Gagal menyimpan");
      alert("Data HPP berhasil disimpan dan terhubung dengan Roadmap Anda!");
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderCostSection = (
    title: string, 
    items: CostItem[], 
    setter: React.Dispatch<React.SetStateAction<CostItem[]>>, 
    total: number
  ) => (
    <div className="glass-panel p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <div className="text-sm font-semibold text-primary">{formatRupiah(total)}</div>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                placeholder="Nama Komponen (cth: Tepung Terigu)"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value, setter)}
                className="flex-1 bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-primary/50 outline-none transition-all"
              />
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">Rp</span>
                <input
                  type="text"
                  placeholder="0"
                  value={item.cost ? item.cost.toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    updateItem(item.id, "cost", val ? parseInt(val, 10) : 0, setter);
                  }}
                  className="w-32 md:w-40 bg-background border border-border/50 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 ring-primary/50 outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => removeItem(item.id, setter)}
                disabled={items.length === 1}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <button 
        onClick={() => addItem(setter)}
        className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
      >
        <Plus className="h-4 w-4" /> Tambah Baris
      </button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Kalkulator HPP</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            Kalkulator HPP & Harga Jual
          </h1>
          <p className="text-muted-foreground mt-2">
            Hitung harga pokok produksi Anda dengan akurat agar tidak rugi dalam menentukan harga jual.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 hover:shadow-lg transition-all disabled:opacity-70"
        >
          {isSaving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Calculator className="h-4 w-4" />
            </motion.div>
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Menyimpan..." : "Simpan Analisis"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Konfigurasi Dasar */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Target Produksi (Unit)</label>
              <input
                type="text"
                value={unitProduksi ? unitProduksi.toLocaleString("id-ID") : ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setUnitProduksi(Math.max(1, parseInt(val, 10) || 1));
                }}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-primary/50 outline-none transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1">Estimasi jumlah produk yang dihasilkan dalam 1 kali proses.</p>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Target Margin Profit (%)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={margin}
                  onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-primary/50 outline-none transition-all"
                />
                <span className="absolute right-4 top-2.5 text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Keuntungan bersih yang ingin didapatkan per unit.</p>
            </div>
          </div>

          {renderCostSection("1. Biaya Bahan Baku", bahanBaku, setBahanBaku, totalBahanBaku)}
          {renderCostSection("2. Biaya Tenaga Kerja Langsung", tenagaKerja, setTenagaKerja, totalTenagaKerja)}
          {renderCostSection("3. Biaya Overhead (Listrik, Sewa, dsb)", overhead, setOverhead, totalOverhead)}
        </div>

        {/* Kolom Kanan: Hasil Kalkulasi */}
        <div className="relative">
          <div className="sticky top-24 space-y-6">
            <motion.div 
              className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl shadow-primary/20 overflow-hidden relative"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              
              <h3 className="text-primary-foreground/80 font-medium text-sm mb-1 relative z-10">Total HPP Keseluruhan</h3>
              <div className="text-3xl font-bold tracking-tight mb-6 relative z-10">{formatRupiah(totalHPP)}</div>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-xs text-primary-foreground/80 mb-1 uppercase tracking-wider">HPP per Unit</div>
                  <div className="text-xl font-bold">{formatRupiah(hppPerUnit)}</div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                  <div className="text-xs text-primary-foreground/90 mb-1 uppercase tracking-wider font-semibold">Rekomendasi Harga Jual</div>
                  <div className="text-2xl font-bold text-white">{formatRupiah(hargaJual)}</div>
                  <div className="text-xs text-primary-foreground/80 mt-2 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Profit: {formatRupiah(profitPerUnit)}/unit
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="glass-panel rounded-2xl p-6">
              <h4 className="font-semibold text-sm mb-4">Analisis Komposisi Biaya</h4>
              
              <div className="space-y-4">
                {[
                  { label: "Bahan Baku", value: totalBahanBaku, color: "bg-blue-500" },
                  { label: "Tenaga Kerja", value: totalTenagaKerja, color: "bg-purple-500" },
                  { label: "Overhead", value: totalOverhead, color: "bg-orange-500" },
                ].map((item, i) => {
                  const percent = totalHPP > 0 ? (item.value / totalHPP) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{percent.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${item.color} rounded-full`} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </motion.div>
  );
}
