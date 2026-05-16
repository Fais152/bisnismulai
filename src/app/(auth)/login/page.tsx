"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Email atau password salah");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Desktop teal background */
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#008080" }}
    >
      {/* Dialog box — Windows 95 style */}
      <div className="win-panel w-full max-w-sm">
        {/* Title bar */}
        <div className="win-titlebar">
          <div className="flex items-center gap-1">
            <span className="text-base">🔐</span>
            <span className="text-base font-bold leading-none">BisnisMulai — Login</span>
          </div>
          <button className="win-control-btn">✕</button>
        </div>

        {/* Dialog content */}
        <div className="p-4 bg-[#C0C0C0] dark:bg-[#1A1A1A]">
          {/* Error alert */}
          {error && (
            <div className="win-panel mb-3 p-2 flex items-center gap-2 text-[13px]">
              <span className="text-[#800000] font-bold text-lg">✕</span>
              <span className="text-[#800000]">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="label-retro">
                Email:
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                required
                className="input-retro"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label htmlFor="login-password" className="label-retro mb-0">
                  Password:
                </label>
                <Link href="/lupa-password" className="text-[11px]">
                  Lupa password?
                </Link>
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="input-retro"
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="checkbox-retro" />
              <label htmlFor="remember" className="text-[13px]">Ingat saya</label>
            </div>

            {/* Separator */}
            <div className="border-t border-[#808080]" />

            {/* Action buttons */}
            <div className="flex justify-center gap-2">
              <button
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="btn-retro btn-retro-primary min-w-[80px] disabled:opacity-60"
              >
                {loading ? "..." : "OK"}
              </button>
              <Link href="/" className="btn-retro min-w-[80px] text-center no-underline text-inherit">
                Batal
              </Link>
            </div>

            {/* Separator */}
            <div className="border-t border-[#808080]" />

            {/* Google login (visual only) */}
            <div className="flex justify-center">
              <button
                type="button"
                className="btn-retro flex items-center gap-2 text-[13px]"
                onClick={() => alert("Login dengan Google belum tersedia.")}
              >
                <span>G</span> Login dengan Google
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-[13px]">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold">
                Daftar »
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
