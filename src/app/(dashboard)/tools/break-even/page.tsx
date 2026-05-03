"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Plus, Trash2, Save, Info, Target,
  DollarSign, Package, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from "recharts";

interface CostItem {
  id: string;
  name: string;
  amount: number;
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export default function BreakEvenPage() {
  const [fixedCosts, setFixedCosts] = useState<CostItem[]>([
    { id: "1", name: "Sewa Tempat", amount: 2000000 },
    { id: "2", name: "Gaji Karyawan", amount: 3000000 },
  ]);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(15000);
  const [sellingPrice, setSellingPrice] = useState<number>(35000);
  const [targetProfit, setTargetProfit] = useState<number>(5000000);
  const [isSaving, setIsSaving] = useState(false);

  // Core Calculations
  const totalFixedCost = useMemo(
    () => fixedCosts.reduce((acc, c) => acc + (c.amount || 0), 0),
    [fixedCosts]
  );

  const contributionMargin = sellingPrice - variableCostPerUnit;
  const contributionMarginRatio =
    sellingPrice > 0 ? contributionMargin / sellingPrice : 0;

  const bepUnits =
    contributionMargin > 0 ? Math.ceil(totalFixedCost / contributionMargin) : 0;
  const bepRevenue = bepUnits * sellingPrice;

  const targetUnits =
    contributionMargin > 0
      ? Math.ceil((totalFixedCost + targetProfit) / contributionMargin)
      : 0;
  const targetRevenue = targetUnits * sellingPrice;

  // Chart Data
  const chartData = useMemo(() => {
    if (sellingPrice <= 0) return [];
    const maxUnits = Math.max(bepUnits * 2, 10);
    const step = Math.max(1, Math.floor(maxUnits / 10));
    const data = [];
    for (let u = 0; u <= maxUnits; u += step) {
      data.push({
        unit: u,
        "Pendapatan": u * sellingPrice,
        "Total Biaya": totalFixedCost + u * variableCostPerUnit,
        "Biaya Tetap": totalFixedCost,
      });
    }
    return data;
  }, [bepUnits, sellingPrice, variableCostPerUnit, totalFixedCost]);

  const addFixed = () =>
    setFixedCosts((p) => [...p, { id: Math.random().toString(36).slice(2), name: "", amount: 0 }]);

  const removeFixed = (id: string) =>
    setFixedCosts((p) => p.filter((c) => c.id !== id));

  const updateFixed = (id: string, field: "name" | "amount", value: string | number) =>
    setFixedCosts((p) =>
      p.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/tools/break-even", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fixedCosts, variableCostPerUnit, sellingPrice, targetProfit,
          bepUnits, bepRevenue, targetUnits, targetRevenue,
        }),
      });
      alert("Analisis Break-Even berhasil disimpan!");
    } catch {
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  // Load saved data
  useEffect(() => {
    fetch("/api/tools/break-even")
      .then((r) => r.json())
      .then(({ data }) => {
        if (!data) return;
        if (data.fixedCosts) setFixedCosts(data.fixedCosts);
        if (data.variableCostPerUnit) setVariableCostPerUnit(data.variableCostPerUnit);
        if (data.sellingPrice) setSellingPrice(data.sellingPrice);
        if (data.targetProfit) setTargetProfit(data.targetProfit);
      })
      .catch(() => {});
  }, []);

  const isValid = sellingPrice > variableCostPerUnit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20 space-y-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Break-Even Analysis</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Break-Even Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Temukan berapa unit yang harus terjual agar bisnis Anda mulai menghasilkan keuntungan.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !isValid}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Menyimpan..." : "Simpan Analisis"}
        </button>
      </div>

      {!isValid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-2xl px-5 py-4"
        >
          <Info className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">
            <strong>Harga jual harus lebih besar dari biaya variabel per unit.</strong> Pastikan margin kontribusi bernilai positif agar break-even bisa dihitung.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== LEFT: Inputs ===== */}
        <div className="lg:col-span-2 space-y-6">

          {/* Fixed Costs */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Biaya Tetap (per Bulan)
              </h2>
              <span className="text-sm font-semibold text-primary">{formatRupiah(totalFixedCost)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Biaya yang tidak berubah berapa pun jumlah produk yang dibuat (sewa, gaji tetap, dll).
            </p>
            <div className="space-y-3">
              <AnimatePresence>
                {fixedCosts.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="text"
                      placeholder="Nama Biaya (cth: Sewa Tempat)"
                      value={c.name}
                      onChange={(e) => updateFixed(c.id, "name", e.target.value)}
                      className="flex-1 bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">Rp</span>
                      <input
                        type="text"
                        value={c.amount ? c.amount.toLocaleString("id-ID") : ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          updateFixed(c.id, "amount", val ? parseInt(val, 10) : 0);
                        }}
                        className="w-36 bg-background border border-border/50 rounded-xl pl-8 pr-3 py-2 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={() => removeFixed(c.id)}
                      disabled={fixedCosts.length === 1}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button onClick={addFixed} className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:opacity-80 transition-opacity">
              <Plus className="h-4 w-4" /> Tambah Biaya Tetap
            </button>
          </div>

          {/* Variable + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-base font-bold mb-1 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Biaya Variabel / Unit
              </h2>
              <p className="text-xs text-muted-foreground mb-4">Biaya yang berubah setiap kali ada 1 unit diproduksi (bahan baku, ongkir, dll).</p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">Rp</span>
                <input
                  type="text"
                  value={variableCostPerUnit ? variableCostPerUnit.toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setVariableCostPerUnit(val ? parseInt(val, 10) : 0);
                  }}
                  className="w-full bg-background border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
                />
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-base font-bold mb-1 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Harga Jual / Unit
              </h2>
              <p className="text-xs text-muted-foreground mb-4">Harga yang dibayar pelanggan untuk setiap unit produk.</p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">Rp</span>
                <input
                  type="text"
                  value={sellingPrice ? sellingPrice.toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setSellingPrice(val ? parseInt(val, 10) : 0);
                  }}
                  className="w-full bg-background border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Target Profit */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-base font-bold mb-1 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> Target Profit Bulanan
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Keuntungan bersih yang ingin Anda capai setiap bulan. Sistem akan menghitung berapa unit yang harus terjual.
            </p>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">Rp</span>
              <input
                type="text"
                value={targetProfit ? targetProfit.toLocaleString("id-ID") : ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setTargetProfit(val ? parseInt(val, 10) : 0);
                }}
                className="w-full bg-background border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* Chart */}
          {isValid && chartData.length > 0 && (
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-base font-bold mb-4">Grafik Break-Even</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="unit" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v} unit`} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                    <Tooltip
                      contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                      formatter={(value: any) => formatRupiah(Number(value))}
                    />
                    <Legend />
                    <ReferenceLine
                      x={bepUnits}
                      stroke="#F59E0B"
                      strokeDasharray="5 5"
                      label={{ value: `BEP: ${bepUnits} unit`, fill: "#F59E0B", fontSize: 11 }}
                    />
                    <Area type="monotone" dataKey="Pendapatan" stroke="#3B82F6" fill="url(#gradRevenue)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Total Biaya" stroke="#EF4444" fill="url(#gradCost)" strokeWidth={2} />
                    <Line type="monotone" dataKey="Biaya Tetap" stroke="#9CA3AF" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* ===== RIGHT: Results ===== */}
        <div className="space-y-5 sticky top-24">
          {/* BEP Card */}
          <motion.div
            className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden"
            initial={{ scale: 0.96 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <p className="text-primary-foreground/80 text-sm mb-1 relative z-10">Titik Impas (BEP)</p>
            <div className="text-4xl font-bold mb-1 relative z-10">
              {isValid ? bepUnits.toLocaleString("id-ID") : "—"}
            </div>
            <p className="text-primary-foreground/80 text-sm relative z-10">unit / bulan</p>

            <div className="mt-5 pt-4 border-t border-white/20 relative z-10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-primary-foreground/80">Omzet BEP</span>
                <span className="font-semibold">{isValid ? formatRupiah(bepRevenue) : "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-foreground/80">Margin Kontribusi</span>
                <span className="font-semibold">{isValid ? formatRupiah(contributionMargin) : "—"}/unit</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-foreground/80">Rasio CM</span>
                <span className="font-semibold">{isValid ? `${(contributionMarginRatio * 100).toFixed(1)}%` : "—"}</span>
              </div>
            </div>
          </motion.div>

          {/* Target Profit Card */}
          <div className="glass-panel rounded-2xl p-6 border border-primary/20">
            <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Untuk Capai Target Profit
            </p>
            <div className="space-y-3">
              <div className="bg-background/60 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Harus menjual</p>
                <p className="text-2xl font-bold text-primary">
                  {isValid ? targetUnits.toLocaleString("id-ID") : "—"}
                  <span className="text-base font-normal text-muted-foreground"> unit</span>
                </p>
              </div>
              <div className="bg-background/60 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Target Omzet</p>
                <p className="text-lg font-bold">{isValid ? formatRupiah(targetRevenue) : "—"}</p>
              </div>
              <div className="bg-background/60 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Unit Tambahan Setelah BEP</p>
                <p className="text-lg font-bold text-emerald-400">
                  +{isValid ? (targetUnits - bepUnits).toLocaleString("id-ID") : "—"} unit
                </p>
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="glass-panel rounded-2xl p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Margin Kontribusi = Harga Jual − Biaya Variabel/Unit. Semakin besar nilainya, semakin cepat bisnis Anda mencapai titik impas.
            </p>
          </div>

          <Link href="/tools/hpp" className="flex items-center justify-between glass-panel rounded-2xl p-4 hover:border-primary/40 transition-all group">
            <div>
              <p className="text-sm font-semibold group-hover:text-primary transition-colors">Kalkulator HPP</p>
              <p className="text-xs text-muted-foreground">Hitung biaya variabel dari HPP Anda</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
