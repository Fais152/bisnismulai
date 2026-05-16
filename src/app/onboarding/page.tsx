"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Window } from "@/components/retro/Window";
import { RetroProgress } from "@/components/retro/RetroProgress";

const STEPS = [
  { id: "type", title: "Jenis Bisnis" },
  { id: "stage", title: "Status Bisnis" },
  { id: "capital", title: "Modal Awal" },
  { id: "target", title: "Target Omzet" },
  { id: "confirm", title: "Selesai" },
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
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan profil");
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

  const progressPct = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#008080" }}>
      <Window
        title="🖥️ BisnisMulai — Setup Wizard"
        icon="⚙️"
        className="w-full max-w-xl"
        statusBar={`Langkah ${currentStep + 1} dari ${STEPS.length} | ${progressPct}% Selesai`}
      >
        <div className="flex h-[350px] bg-[#C0C0C0] dark:bg-[#1A1A1A]">
          {/* Left Wizard Banner */}
          <div className="hidden sm:block w-40 bg-[#000080] text-white p-4 relative shrink-0">
            <h2 className="text-2xl font-bold font-heading leading-tight absolute bottom-4">
              Bisnis<br />Mulai<br />Setup
            </h2>
            <div className="text-4xl">🚀</div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-4 flex flex-col relative">
            <div className="flex-1">
              {currentStep === 0 && (
                <>
                  <h3 className="font-bold text-lg mb-2">Apa kategori bisnis Anda?</h3>
                  <p className="text-[13px] mb-4">Pilih kategori yang paling menggambarkan ide bisnis Anda.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: "produk_fisik", label: "Produk Fisik", desc: "Makanan kemasan, pakaian" },
                      { id: "jasa", label: "Jasa / Layanan", desc: "Konsultan, desain, dll." },
                      { id: "digital", label: "Produk Digital", desc: "E-book, template, dll." },
                      { id: "fnb", label: "F&B (Kuliner)", desc: "Restoran, warung, booth" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, businessType: type.id })}
                        className={`text-left p-2 text-[13px] win-inset cursor-pointer ${
                          formData.businessType === type.id 
                            ? "bg-[#000080] text-white" 
                            : "bg-white text-black hover:bg-[#0000A0] hover:text-white"
                        }`}
                      >
                        <div className="font-bold">{type.label}</div>
                        <div className="text-[11px] opacity-80">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <h3 className="font-bold text-lg mb-2">Status bisnis saat ini?</h3>
                  <p className="text-[13px] mb-4">Ini membantu kami menyesuaikan roadmap Anda.</p>
                  
                  <div className="space-y-2">
                    {[
                      { id: "ide", label: "Baru Berupa Ide", desc: "Belum ada produk/pelanggan." },
                      { id: "ada_produk", label: "Sudah Ada Produk", desc: "Produk siap, belum jualan aktif." },
                      { id: "sudah_berjualan", label: "Sudah Berjualan", desc: "Sudah ada transaksi." },
                    ].map((stage) => (
                      <label
                        key={stage.id}
                        className="flex items-center gap-2 text-[13px] p-2 win-inset bg-white text-black cursor-pointer hover:bg-[#E0E0E0]"
                      >
                        <input
                          type="radio"
                          name="stage"
                          checked={formData.businessStage === stage.id}
                          onChange={() => setFormData({ ...formData, businessStage: stage.id })}
                          className="checkbox-retro rounded-full"
                        />
                        <div>
                          <div className="font-bold">{stage.label}</div>
                          <div className="text-[11px] text-[#444]">{stage.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h3 className="font-bold text-lg mb-2">Estimasi modal awal?</h3>
                  <p className="text-[13px] mb-4">Data untuk Break-Even dan Proyeksi Cash Flow.</p>
                  
                  <div className="space-y-2">
                    <label className="label-retro">Nominal Modal (Rupiah):</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px]">Rp</span>
                      <input
                        type="number"
                        value={formData.initialCapital}
                        onChange={(e) => setFormData({ ...formData, initialCapital: e.target.value })}
                        placeholder="10000000"
                        className="input-retro text-base font-bold w-full max-w-[200px]"
                      />
                    </div>
                    <p className="text-[11px] text-[#444] dark:text-[#888]">
                      Tanpa titik/koma. Contoh: 10000000 untuk 10 Juta.
                    </p>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <h3 className="font-bold text-lg mb-2">Target omzet per bulan?</h3>
                  <p className="text-[13px] mb-4">Target ideal yang ingin dicapai di tahun pertama.</p>
                  
                  <div className="space-y-2">
                    <label className="label-retro">Target Omzet (Rupiah):</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px]">Rp</span>
                      <input
                        type="number"
                        value={formData.targetRevenue}
                        onChange={(e) => setFormData({ ...formData, targetRevenue: e.target.value })}
                        placeholder="50000000"
                        className="input-retro text-base font-bold w-full max-w-[200px]"
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="font-bold text-xl mb-2">Semua Sudah Siap!</h3>
                  <p className="text-[13px] mb-4 max-w-[250px] mx-auto">
                    Profil Anda telah lengkap. Kami telah menyiapkan roadmap khusus untuk Anda.
                  </p>
                  <div className="win-inset bg-white text-black p-2 text-[13px] w-full max-w-[250px] mx-auto text-left space-y-1">
                    <div><b>Kategori:</b> {formData.businessType.replace('_', ' ')}</div>
                    <div><b>Status:</b> {formData.businessStage.replace('_', ' ')}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#808080] mt-auto flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
                className="btn-retro disabled:opacity-50 min-w-[75px]"
              >
                &lt; Back
              </button>
              
              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="btn-retro btn-retro-primary disabled:opacity-50 min-w-[75px]"
                >
                  Next &gt;
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-retro btn-retro-primary disabled:opacity-50 min-w-[100px]"
                >
                  {loading ? "..." : "Finish"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}
