"use client";

import Link from "next/link";
import { TrendingUp, Menu, Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex md:hidden items-center gap-2">
        <button className="text-muted-foreground hover:text-foreground">
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

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/80">
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

        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center cursor-pointer hover:ring-2 ring-primary/50 transition-all">
          <span className="text-sm font-medium text-primary">A</span>
        </div>
      </div>
    </header>
  );
}
