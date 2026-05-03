"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "type", title: "Jenis Bisnis" },
  { id: "stage", title: "Status Bisnis" },
  { id: "capital", title: "Modal Awal" },
  { id: "target", title: "Target Omzet" },
  { id: "confirm", title: "Konfirmasi" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessType: "",
    businessStage: "",
    initialCapital: "",
    targetRevenue: "",
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // call API to save onboarding data
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan profil");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan, silakan coba lagi.");
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.businessType !== "";
      case 1: return formData.businessStage !== "";
      case 2: return formData.initialCapital !== "";
      case 3: return formData.targetRevenue !== "";
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Top Branding */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <TrendingUp className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-lg tracking-tight hidden sm:inline-block">BisnisMulai</span>
      </div>

      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium mb-2 text-muted-foreground">
            <span>Langkah {currentStep + 1} dari {STEPS.length}</span>
            <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground/60 hidden sm:flex">
            {STEPS.map((step, idx) => (
              <span key={step.id} className={cn(idx <= currentStep ? "text-primary font-medium" : "")}>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-6 sm:p-10 relative overflow-hidden min-h-[400px] flex flex-col">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          
          <div className="flex-1 relative z-10 flex flex-col">
            {/* Step 1: Business Type */}
            {currentStep === 0 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                <h2 className="text-2xl font-bold mb-2">Apa kategori bisnis Anda?</h2>
                <p className="text-muted-foreground mb-8">Pilih kategori yang paling menggambarkan ide atau bisnis yang sedang Anda jalankan.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "produk_fisik", label: "Produk Fisik", desc: "Makanan kemasan, pakaian, kerajinan, dll." },
                    { id: "jasa", label: "Jasa / Layanan", desc: "Konsultan, desain, cleaning service, dll." },
                    { id: "digital", label: "Produk Digital", desc: "E-book, software, template, kursus online." },
                    { id: "fnb", label: "F&B (Kuliner)", desc: "Restoran, cafe, warung makan, booth minuman." },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, businessType: type.id })}
                      className={cn(
                        "text-left p-4 rounded-xl border transition-all duration-200",
                        formData.businessType === type.id 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-border/50 bg-background hover:border-primary/50 hover:bg-secondary/50"
                      )}
                    >
                      <div className="font-semibold mb-1">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Stage */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                <h2 className="text-2xl font-bold mb-2">Bagaimana status bisnis Anda saat ini?</h2>
                <p className="text-muted-foreground mb-8">Ini membantu kami menyesuaikan roadmap awal Anda.</p>
                
                <div className="space-y-4">
                  {[
                    { id: "ide", label: "Baru Berupa Ide", desc: "Belum ada produk, belum ada pelanggan, sedang riset." },
                    { id: "ada_produk", label: "Sudah Ada Produk (Pre-launch)", desc: "Produk/jasa sudah siap, tapi belum mulai berjualan aktif." },
                    { id: "sudah_berjualan", label: "Sudah Berjualan", desc: "Sudah memiliki transaksi dan pelanggan." },
                  ].map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => setFormData({ ...formData, businessStage: stage.id })}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between",
                        formData.businessStage === stage.id 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-border/50 bg-background hover:border-primary/50 hover:bg-secondary/50"
                      )}
                    >
                      <div>
                        <div className="font-semibold">{stage.label}</div>
                        <div className="text-sm text-muted-foreground mt-1">{stage.desc}</div>
                      </div>
                      {formData.businessStage === stage.id && <CheckCircle2 className="text-primary h-5 w-5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Capital */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                <h2 className="text-2xl font-bold mb-2">Berapa estimasi modal awal Anda?</h2>
                <p className="text-muted-foreground mb-8">Data ini akan digunakan untuk fitur Break-Even dan Proyeksi Cash Flow.</p>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nominal Modal (Rupiah)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
                    <input
                      type="number"
                      value={formData.initialCapital}
                      onChange={(e) => setFormData({ ...formData, initialCapital: e.target.value })}
                      placeholder="10000000"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Masukkan angka saja tanpa titik atau koma (contoh: 10000000 untuk 10 Juta).
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Target */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                <h2 className="text-2xl font-bold mb-2">Berapa target omzet per bulan?</h2>
                <p className="text-muted-foreground mb-8">Ini adalah target ideal yang ingin Anda capai di tahun pertama.</p>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Omzet (Rupiah)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
                    <input
                      type="number"
                      value={formData.targetRevenue}
                      onChange={(e) => setFormData({ ...formData, targetRevenue: e.target.value })}
                      placeholder="50000000"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Mimpi yang besar dimulai dari target yang tertulis.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Semua Sudah Siap!</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Profil Anda telah lengkap. Kami telah menyusun roadmap 4 fase yang disesuaikan dengan jenis bisnis Anda. Mari mulai bangun bisnis yang menguntungkan.
                </p>

                <div className="bg-secondary/50 rounded-xl p-4 w-full text-left grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Kategori</div>
                    <div className="font-semibold capitalize">{formData.businessType.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="font-semibold capitalize">{formData.businessStage.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
              <button
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>

              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
                >
                  Lanjut <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
                >
                  {loading ? "Menyimpan..." : "Masuk ke Dashboard"} <TrendingUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
