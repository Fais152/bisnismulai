"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  LayoutDashboard, 
  Map, 
  Calculator, 
  FileText, 
  Bot,
  Settings,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Roadmap Fase", href: "/roadmap", icon: Map },
  { name: "Tools & Kalkulator", href: "/tools", icon: Calculator },
  { name: "SOP & Legal", href: "/legal", icon: FileText },
  { name: "BizBot AI", href: "/konsultasi", icon: Bot },
];

function NavContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <Link href="/dashboard" className="flex items-center gap-2 group" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">BisnisMulai</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground mb-4 px-2 uppercase tracking-wider">Menu Utama</div>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(37,99,235,0.2)]" 
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/40">
        <Link
          href="/profil"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
            pathname === "/profil"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <Settings className={cn("h-5 w-5", pathname === "/profil" ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
          Pengaturan Profil
        </Link>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Listen to header hamburger button
  useEffect(() => {
    const handleToggle = () => setMobileOpen(prev => !prev);
    window.addEventListener('toggle-mobile-menu', handleToggle);
    return () => window.removeEventListener('toggle-mobile-menu', handleToggle);
  }, []);

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/40 glass h-screen sticky top-0 z-40">
        <NavContent pathname={pathname} />
      </aside>

      {/* ===== Mobile Hamburger Button (Removed) ===== */}
      {/* Handled by Header.tsx via custom event */}

      {/* ===== Mobile Drawer ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 glass border-r border-border/40 z-50 flex flex-col"
            >
              <NavContent pathname={pathname} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
