"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan saat pendaftaran");
      window.location.href = "/onboarding";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#008080" }}
    >
      <div className="win-panel w-full max-w-sm">
        {/* Title bar */}
        <div className="win-titlebar">
          <div className="flex items-center gap-1">
            <span className="text-base">📝</span>
            <span className="text-base font-bold leading-none">BisnisMulai — Daftar Akun</span>
          </div>
          <button className="win-control-btn">✕</button>
        </div>

        {/* Form */}
        <div className="p-4 bg-[#C0C0C0] dark:bg-[#1A1A1A]">
          {error && (
            <div className="win-panel mb-3 p-2 flex items-center gap-2 text-[13px]">
              <span className="text-[#800000] font-bold text-lg">✕</span>
              <span className="text-[#800000]">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="reg-name" className="label-retro">Nama Lengkap:</label>
              <input id="reg-name" name="name" type="text" placeholder="Nama Anda" required className="input-retro" />
            </div>
            <div>
              <label htmlFor="reg-email" className="label-retro">Email:</label>
              <input id="reg-email" name="email" type="email" placeholder="nama@email.com" required className="input-retro" />
            </div>
            <div>
              <label htmlFor="reg-password" className="label-retro">Password:</label>
              <input id="reg-password" name="password" type="password" placeholder="Min. 8 karakter" minLength={8} required className="input-retro" />
            </div>

            <div className="border-t border-[#808080]" />

            <div className="flex justify-center gap-2">
              <button
                type="submit"
                disabled={loading}
                id="register-submit-btn"
                className="btn-retro btn-retro-primary min-w-[80px] disabled:opacity-60"
              >
                {loading ? "..." : "Daftar"}
              </button>
              <Link href="/login" className="btn-retro min-w-[80px] text-center no-underline text-inherit">
                Batal
              </Link>
            </div>

            <p className="text-center text-[13px]">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold">
                Login »
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
