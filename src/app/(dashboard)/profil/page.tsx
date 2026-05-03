"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  User, Mail, Briefcase, TrendingUp, DollarSign,
  Save, Edit3, CheckCircle2, LogOut, Shield, Clock,
} from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

const businessTypes = [
  { value: "physical", label: "Produk Fisik" },
  { value: "service", label: "Jasa" },
  { value: "digital", label: "Produk Digital" },
  { value: "fnb", label: "F&B (Kuliner)" },
  { value: "retail", label: "Retail/Toko" },
  { value: "other", label: "Lainnya" },
];

const businessStages = [
  { value: "ide", label: "Baru Berupa Ide" },
  { value: "rintisan", label: "Rintisan (0-6 bulan)" },
  { value: "berkembang", label: "Berkembang (6-24 bulan)" },
  { value: "established", label: "Mapan (2+ tahun)" },
];

const formatRupiah = (n: number | null) =>
  n
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
    : "—";

interface Profile {
  id?: string;
  email?: string;
  full_name?: string;
  business_type?: string | null;
  business_stage?: string | null;
  initial_capital?: number | null;
  target_monthly_revenue?: number | null;
  onboarding_completed?: boolean;
  created_at?: string;
}

export default function ProfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    business_type: "",
    business_stage: "",
    initial_capital: "",
    target_monthly_revenue: "",
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setForm({
            full_name: data.full_name ?? "",
            business_type: data.business_type ?? "",
            business_stage: data.business_stage ?? "",
            initial_capital: data.initial_capital ? String(data.initial_capital) : "",
            target_monthly_revenue: data.target_monthly_revenue ? String(data.target_monthly_revenue) : "",
          });
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { data, message } = await res.json();
      if (data) {
        setProfile((p) => ({ ...p, ...data }));
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const businessTypeLabel = businessTypes.find((b) => b.value === profile?.business_type)?.label;
  const businessStageLabel = businessStages.find((s) => s.value === profile?.business_stage)?.label;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-8">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-muted-foreground mt-2">Kelola informasi akun dan data bisnis Anda.</p>
      </motion.div>

      {/* Success Toast */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-2xl px-5 py-3"
        >
          <CheckCircle2 className="h-5 w-5" /> Profil berhasil diperbarui!
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar & Meta */}
        <motion.div variants={item} className="space-y-4">
          {/* Avatar card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30">
              {initials}
            </div>
            <div>
              <p className="font-bold text-lg">{profile?.full_name || "—"}</p>
              <p className="text-sm text-muted-foreground">{profile?.email || "—"}</p>
            </div>
            {profile?.onboarding_completed && (
              <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-full font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Onboarding Selesai
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Bergabung sejak</p>
                <p className="font-medium">{joinDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Status Akun</p>
                <p className="font-medium text-emerald-500">Terverifikasi</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors rounded-2xl py-2.5 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" /> Keluar dari Akun
          </button>
        </motion.div>

        {/* Right — Profile Form */}
        <motion.div variants={item} className="lg:col-span-2 space-y-5">
          {/* Personal Info */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Informasi Pribadi
              </h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                >
                  <Edit3 className="h-4 w-4" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary">
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    <Save className="h-3.5 w-3.5" /> {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Nama Lengkap</label>
                {editing ? (
                  <input
                    value={form.full_name}
                    onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm py-2.5 px-4 bg-secondary/50 rounded-xl">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {profile?.full_name || "—"}
                  </div>
                )}
              </div>
              {/* Email (read-only) */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Email</label>
                <div className="flex items-center gap-2 text-sm py-2.5 px-4 bg-secondary/50 rounded-xl opacity-70">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {profile?.email || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="font-bold text-lg flex items-center gap-2 mb-5">
              <Briefcase className="h-5 w-5 text-primary" /> Informasi Bisnis
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Business Type */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Jenis Bisnis</label>
                {editing ? (
                  <select
                    value={form.business_type}
                    onChange={(e) => setForm((f) => ({ ...f, business_type: e.target.value }))}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
                  >
                    <option value="">Pilih Jenis Bisnis</option>
                    {businessTypes.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2 text-sm py-2.5 px-4 bg-secondary/50 rounded-xl">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    {businessTypeLabel || "—"}
                  </div>
                )}
              </div>

              {/* Business Stage */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Tahap Bisnis</label>
                {editing ? (
                  <select
                    value={form.business_stage}
                    onChange={(e) => setForm((f) => ({ ...f, business_stage: e.target.value }))}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
                  >
                    <option value="">Pilih Tahap Bisnis</option>
                    {businessStages.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2 text-sm py-2.5 px-4 bg-secondary/50 rounded-xl">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    {businessStageLabel || "—"}
                  </div>
                )}
              </div>

              {/* Initial Capital */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Modal Awal</label>
                {editing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">Rp</span>
                    <input
                      type="text"
                      value={form.initial_capital ? parseInt(form.initial_capital).toLocaleString("id-ID") : ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setForm((f) => ({ ...f, initial_capital: val }));
                      }}
                      className="w-full bg-background border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm py-2.5 px-4 bg-secondary/50 rounded-xl">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    {formatRupiah(profile?.initial_capital ?? null)}
                  </div>
                )}
              </div>

              {/* Target Revenue */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Target Omzet / Bulan</label>
                {editing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">Rp</span>
                    <input
                      type="text"
                      value={form.target_monthly_revenue ? parseInt(form.target_monthly_revenue).toLocaleString("id-ID") : ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setForm((f) => ({ ...f, target_monthly_revenue: val }));
                      }}
                      className="w-full bg-background border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 ring-primary/40 outline-none transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm py-2.5 px-4 bg-secondary/50 rounded-xl">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    {formatRupiah(profile?.target_monthly_revenue ?? null)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
