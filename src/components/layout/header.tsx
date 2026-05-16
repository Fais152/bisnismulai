"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState("U");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          const email = data.user.email ?? null;
          const name = data.user.user_metadata?.full_name as string | undefined;
          setUserEmail(email);
          if (name) setUserInitial(name.charAt(0).toUpperCase());
          else if (email) setUserInitial(email.charAt(0).toUpperCase());
        }
      });
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  };

  const isDark = mounted && theme === "dark";

  return (
    <header
      className="sticky top-0 z-30 flex-shrink-0"
      style={{
        background: "var(--win-button-face, #C0C0C0)",
        borderBottom: "2px solid",
        borderBottomColor: "var(--win-shadow-dark, #404040)",
      }}
    >
      {/* ─── Toolbar Row ─── */}
      <div className="flex items-center gap-0 px-1 py-1" style={{ borderBottom: "1px solid var(--win-shadow-med, #808080)" }}>
        {/* Mobile hamburger + brand */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-mobile-menu"))}
          className="md:hidden btn-retro px-2 py-1 mr-1 text-[13px]"
          title="Menu"
        >
          ☰
        </button>
        <Link href="/dashboard" className="md:hidden btn-retro px-2 py-1 mr-2 text-[13px] no-underline text-inherit font-bold">
          🖥️ BisnisMulai
        </Link>

        {/* Nav toolbar buttons — desktop */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => window.history.back()}
            className="btn-retro px-2 py-1 text-[11px]"
            title="Kembali"
          >
            ◀ Kembali
          </button>
          <button
            onClick={() => window.history.forward()}
            className="btn-retro px-2 py-1 text-[11px]"
            title="Maju"
          >
            Maju ▶
          </button>
          <div className="w-px h-6 mx-1" style={{ background: "var(--win-shadow-med, #808080)" }} />
          <Link href="/dashboard" className="btn-retro px-2 py-1 text-[11px] no-underline text-inherit">
            🏠 Home
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right-side controls */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="btn-retro px-2 py-1 text-[11px]"
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {mounted ? (isDark ? "☀️ Day" : "🌙 Night") : "🌙 Night"}
          </button>

          {/* Notifications */}
          <button
            onClick={() => alert("Tidak ada notifikasi baru saat ini.")}
            className="btn-retro px-2 py-1 text-[11px] relative"
            title="Notifikasi"
          >
            🔔
          </button>

          {/* User avatar / dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="user-menu-btn"
              onClick={() => setDropdownOpen(v => !v)}
              className="btn-retro px-2 py-1 text-[11px] flex items-center gap-1"
              title="Akun"
            >
              <span
                className="inline-flex items-center justify-center font-bold text-[13px] text-white"
                style={{
                  width: 20, height: 20,
                  background: "#000080",
                }}
              >
                {userInitial}
              </span>
              <span className="hidden md:inline">▼</span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-0.5 z-50 win-panel"
                style={{ minWidth: 200 }}
              >
                <div className="win-titlebar text-[11px]">
                  <span>👤 Akun Pengguna</span>
                  <button onClick={() => setDropdownOpen(false)} className="win-control-btn">✕</button>
                </div>
                <div className="p-2 text-[11px] bg-[#C0C0C0] dark:bg-[#1A1A1A]">
                  <div className="win-inset px-2 py-1 mb-2 text-[11px]">
                    {userEmail ?? "Memuat..."}
                  </div>
                  <Link
                    href="/profil"
                    onClick={() => setDropdownOpen(false)}
                    className="block w-full text-left px-2 py-1 text-[13px] no-underline text-inherit hover:bg-[#000080] hover:text-white"
                  >
                    👤 Profil Saya
                  </Link>
                  <div className="border-t border-[#808080] my-1" />
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="block w-full text-left px-2 py-1 text-[13px] hover:bg-[#000080] hover:text-white disabled:opacity-50 bg-transparent border-none cursor-pointer"
                  >
                    🚪 {loggingOut ? "Keluar..." : "Keluar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Status Bar Address Row ─── */}
      <div className="hidden md:flex items-center gap-2 px-2 py-0.5 text-[11px]" style={{ background: "var(--win-button-face, #C0C0C0)" }}>
        <span className="shrink-0 text-[11px]">🖥️ BisnisMulai Explorer</span>
        <div className="flex-1" />
        <span className="win-statusbar-item">Terhubung</span>
        <span className="win-statusbar-item">
          {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </header>
  );
}
