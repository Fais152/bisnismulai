"use client";

import Link from "next/link";
import { TrendingUp, Menu, Bell, Search, Sun, Moon, LogOut, User, Settings } from "lucide-react";
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
    // Fetch session from Supabase via client
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          const email = data.user.email ?? null;
          const name = data.user.user_metadata?.full_name as string | undefined;
          setUserEmail(email);
          if (name) {
            setUserInitial(name.charAt(0).toUpperCase());
          } else if (email) {
            setUserInitial(email.charAt(0).toUpperCase());
          }
        }
      });
    });
  }, []);

  // Close dropdown on outside click
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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 glass px-6">
      <div className="flex md:hidden items-center gap-2">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-menu'))}
          className="text-muted-foreground hover:text-foreground p-2 -ml-2"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-bold">BisnisMulai</span>
        </Link>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <form className="hidden md:flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Cari alat atau panduan..."
            className="w-64 rounded-full bg-secondary/50 pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </form>

        <button onClick={() => alert("Tidak ada notifikasi baru saat ini.")} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/80">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/80"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* User Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:ring-2 ring-primary/50 transition-all"
          >
            <span className="text-sm font-medium text-primary">{userInitial}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border/50 bg-card shadow-lg shadow-black/20 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-border/40">
                <p className="text-xs text-muted-foreground">Masuk sebagai</p>
                <p className="text-sm font-medium truncate">{userEmail ?? "Memuat..."}</p>
              </div>
              <div className="p-1">
                <Link
                  href="/profil"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary/80 text-foreground transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" /> Profil Saya
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    alert("Menu Pengaturan khusus sedang dalam pengembangan. Silakan gunakan menu Profil.");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary/80 text-foreground transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" /> Pengaturan
                </button>
                <div className="my-1 border-t border-border/40" />
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" /> {loggingOut ? "Keluar..." : "Keluar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
