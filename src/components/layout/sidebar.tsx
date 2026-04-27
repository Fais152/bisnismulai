"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  TrendingUp, 
  LayoutDashboard, 
  Map, 
  Calculator, 
  FileText, 
  CalendarCheck, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Roadmap Fase", href: "/roadmap", icon: Map },
  { name: "Tools & Kalkulator", href: "/tools", icon: Calculator },
  { name: "SOP & Legal", href: "/legal", icon: FileText },
  { name: "Konsultasi", href: "/konsultasi", icon: CalendarCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/40 bg-card/30 h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(29,158,117,0.4)]">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">BisnisMulai</span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground mb-4 px-2 uppercase tracking-wider">Menu Utama</div>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/40">
        <Link
          href="/profil"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all group"
        >
          <Settings className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          Pengaturan
        </Link>
      </div>
    </aside>
  );
}
