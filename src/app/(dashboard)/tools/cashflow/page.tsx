"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart2, Save, Info, ArrowUpRight, ArrowDownRight,
  Wallet, TrendingUp, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, Cell
} from "recharts";

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export default function CashflowPage() {
  const [initialBalance, setInitialBalance] = useState<number>(10000000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(15000000);
  const [revenueGrowth, setRevenueGrowth] = useState<number>(5); // 5% per month
  const [monthlyFixedCost, setMonthlyFixedCost] = useState<number>(8000000);
  const [variableCostMargin, setVariableCostMargin] = useState<number>(40); // 40% of revenue

  const [isSaving, setIsSaving] = useState(false);

  // Generate 12 months projection
  const chartData = useMemo(() => {
    const data = [];
    let currentBalance = initialBalance;
    let currentRevenue = monthlyRevenue;

    for (let i = 1; i <= 12; i++) {
      const variableCost = currentRevenue * (variableCostMargin / 100);
      const totalOutflow = monthlyFixedCost + variableCost;
      const netCashflow = currentRevenue - totalOutflow;
      
      currentBalance += netCashflow;

      data.push({
        month: `Bulan ${i}`,
        Pemasukan: currentRevenue,
        Pengeluaran: totalOutflow,
        "Net Cashflow": netCashflow,
        "Saldo Akhir": currentBalance,
      });

      // Apply growth for next month
      currentRevenue = currentRevenue * (1 + revenueGrowth / 100);
    }
    return data;
  }, [initialBalance, monthlyRevenue, revenueGrowth, monthlyFixedCost, variableCostMargin]);

  const hasNegativeBalance = chartData.some((d) => d["Saldo Akhir"] < 0);
  const firstNegativeMonth = chartData.find((d) => d["Saldo Akhir"] < 0)?.month;
  
  // Total metrics
  const totalRevenue12m = chartData.reduce((acc, curr) => acc + curr.Pemasukan, 0);
  const totalOutflow12m = chartData.reduce((acc, curr) => acc + curr.Pengeluaran, 0);
  const finalBalance = chartData[11]?.["Saldo Akhir"] ?? 0;

  useEffect(() => {
    fetch("/api/tools/cashflow")
      .then((r) => r.json())
      .then(({ data }) => {
        if (!data) return;
        if (data.initialBalance !== undefined) setInitialBalance(data.initialBalance);
        if (data.monthlyRevenue !== undefined) setMonthlyRevenue(data.monthlyRevenue);
        if (data.revenueGrowth !== undefined) setRevenueGrowth(data.revenueGrowth);
        if (data.monthlyFixedCost !== undefined) setMonthlyFixedCost(data.monthlyFixedCost);
        if (data.variableCostMargin !== undefined) setVariableCostMargin(data.variableCostMargin);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/tools/cashflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialBalance, monthlyRevenue, revenueGrowth, 
          monthlyFixedCost, variableCostMargin
        }),
      });
      alert("Proyeksi Cashflow berhasil disimpan!");
    } catch {
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
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
        <span className="text-foreground font-medium">Proyeksi Cashflow</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart2 className="h-8 w-8 text-primary" />
            Proyeksi Cashflow 12 Bulan
          </h1>
          <p className="text-muted-foreground mt-2">
            Simulasikan arus kas bisnis Anda untuk memastikan Anda tidak kehabisan modal (runway).
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Menyimpan..." : "Simpan Proyeksi"}
        </button>
      </div>

      {hasNegativeBalance && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-2xl px-5 py-4"
        >
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-destructive">Peringatan: Saldo Kas Negatif!</p>
            <p className="text-sm text-destructive mt-1">
              Berdasarkan proyeksi, kas Anda akan habis pada <strong>{firstNegativeMonth}</strong>. Pertimbangkan untuk menekan biaya tetap, meningkatkan margin, atau mencari tambahan modal awal.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* INPUTS PANEL */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h2 className="font-bold border-b border-border/50 pb-2 mb-2">Kas & Pendapatan</h2>
            
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Saldo Kas Awal</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-muted-foreground">Rp</span>
                <input
                  type="text"
                  value={initialBalance ? initialBalance.toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setInitialBalance(val ? parseInt(val, 10) : 0);
                  }}
                  className="w-full bg-background border border-border/50 rounded-xl pl-8 pr-3 py-2 text-sm focus:ring-2 ring-primary/40 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Asumsi Omzet (Bulan 1)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-muted-foreground">Rp</span>
                <input
                  type="text"
                  value={monthlyRevenue ? monthlyRevenue.toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setMonthlyRevenue(val ? parseInt(val, 10) : 0);
                  }}
                  className="w-full bg-background border border-border/50 rounded-xl pl-8 pr-3 py-2 text-sm focus:ring-2 ring-primary/40 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Pertumbuhan Omzet Bulanan</label>
              <div className="relative">
                <input
                  type="number"
                  value={revenueGrowth || ""}
                  onChange={(e) => setRevenueGrowth(parseFloat(e.target.value) || 0)}
                  className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-sm focus:ring-2 ring-primary/40 outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h2 className="font-bold border-b border-border/50 pb-2 mb-2">Pengeluaran</h2>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Biaya Tetap Bulanan</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-muted-foreground">Rp</span>
                <input
                  type="text"
                  value={monthlyFixedCost ? monthlyFixedCost.toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setMonthlyFixedCost(val ? parseInt(val, 10) : 0);
                  }}
                  className="w-full bg-background border border-border/50 rounded-xl pl-8 pr-3 py-2 text-sm focus:ring-2 ring-primary/40 outline-none"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">Sewa, gaji, dll.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Rasio Biaya Variabel (HPP)</label>
              <div className="relative">
                <input
                  type="number"
                  value={variableCostMargin || ""}
                  onChange={(e) => setVariableCostMargin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-sm focus:ring-2 ring-primary/40 outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-muted-foreground">%</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">Persentase dari omzet yang dipakai untuk bahan/modal produk.</p>
            </div>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="lg:col-span-3 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> Total Omzet (12 Bln)</p>
              <p className="text-2xl font-bold text-foreground">{formatRupiah(totalRevenue12m)}</p>
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5"><ArrowDownRight className="h-4 w-4" /> Total Keluar (12 Bln)</p>
              <p className="text-2xl font-bold text-foreground">{formatRupiah(totalOutflow12m)}</p>
            </div>
            <div className={`glass-panel rounded-2xl p-5 border ${finalBalance < 0 ? 'border-destructive/50 bg-destructive/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5"><Wallet className="h-4 w-4" /> Saldo Akhir Tahun</p>
              <p className={`text-2xl font-bold ${finalBalance < 0 ? 'text-destructive' : 'text-emerald-500'}`}>{formatRupiah(finalBalance)}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-6">Grafik Proyeksi Cashflow</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} width={50} />
                  <Tooltip
                    contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                    formatter={(value: any) => formatRupiah(Number(value))}
                  />
                  <Legend />
                  <ReferenceLine y={0} stroke="#EF4444" strokeWidth={1} />
                  
                  <Bar dataKey="Net Cashflow" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry["Net Cashflow"] >= 0 ? "#10B981" : "#EF4444"} fillOpacity={0.7} />
                    ))}
                  </Bar>
                  <Line type="monotone" dataKey="Saldo Akhir" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: "#3B82F6" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-lg font-bold mb-4">Rincian Bulanan</h2>
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Bulan</th>
                  <th className="px-4 py-3">Pemasukan</th>
                  <th className="px-4 py-3">Pengeluaran</th>
                  <th className="px-4 py-3">Net Cashflow</th>
                  <th className="px-4 py-3 rounded-r-xl">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-secondary/10">
                    <td className="px-4 py-3 font-medium">{row.month}</td>
                    <td className="px-4 py-3 text-emerald-400">{formatRupiah(row.Pemasukan)}</td>
                    <td className="px-4 py-3 text-rose-400">{formatRupiah(row.Pengeluaran)}</td>
                    <td className={`px-4 py-3 font-medium ${row["Net Cashflow"] >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatRupiah(row["Net Cashflow"])}
                    </td>
                    <td className={`px-4 py-3 font-bold ${row["Saldo Akhir"] >= 0 ? 'text-primary' : 'text-rose-500'}`}>
                      {formatRupiah(row["Saldo Akhir"])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
