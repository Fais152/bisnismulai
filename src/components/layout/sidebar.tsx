"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Roadmap", href: "/roadmap", icon: "🗺️", children: [
    { name: "Fase 01 — Mental Reset", href: "/roadmap/fase/1", icon: "📄" },
    { name: "Fase 02 — Validasi Ide", href: "/roadmap/fase/2", icon: "📄" },
    { name: "Fase 03 — Bangun Fondasi", href: "/roadmap/fase/3", icon: "📄" },
    { name: "Fase 04 — Launch Pertama", href: "/roadmap/fase/4", icon: "📄" },
    { name: "Fase 05 — Stabilisasi", href: "/roadmap/fase/5", icon: "📄" },
    { name: "Fase 06 — Skala", href: "/roadmap/fase/6", icon: "📄" },
  ]},
  { name: "Tools", href: "/tools", icon: "💰", children: [
    { name: "Kalkulator HPP", href: "/tools/hpp", icon: "📄" },
    { name: "Break-Even Analysis", href: "/tools/break-even", icon: "📄" },
    { name: "SOP Builder", href: "/tools/sop", icon: "📄" },
    { name: "Cash Flow", href: "/tools/cashflow", icon: "📄" },
  ]},
  { name: "SOP & Legal", href: "/legal", icon: "📋" },
  { name: "BizBot AI", href: "/konsultasi", icon: "🤖" },
  { name: "Profil", href: "/profil", icon: "👤" },
];

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["/roadmap", "/tools"]);

  const toggleExpand = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Title bar — BisnisMulai Explorer */}
      <div className="win-titlebar">
        <div className="flex items-center gap-1">
          <span className="text-base">🖥️</span>
          <span className="text-base font-bold leading-none">BisnisMulai Explorer</span>
        </div>
        <div className="flex gap-0.5">
          <button className="win-control-btn">_</button>
          <button className="win-control-btn">□</button>
          {onClose && <button onClick={onClose} className="win-control-btn">✕</button>}
        </div>
      </div>

      {/* Menu bar */}
      <div className="menubar-retro text-[13px]">
        <span className="menubar-item">File</span>
        <span className="menubar-item">Tampilan</span>
        <span className="menubar-item">Tools</span>
        <span className="menubar-item">Bantuan</span>
      </div>

      {/* Address bar */}
      <div className="bg-[#C0C0C0] dark:bg-[#1A1A1A] border-b border-[#808080] px-2 py-1 flex items-center gap-2 text-[11px]">
        <span className="shrink-0">📍 Address:</span>
        <div className="flex-1 input-retro text-[11px] py-0.5 px-1 bg-white dark:bg-black">
          {pathname}
        </div>
      </div>

      {/* Tree navigation */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-black p-1" style={{
        boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #FFFFFF"
      }}>
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isExpanded = expandedItems.includes(item.href);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.href}>
              {/* Parent item */}
              <div
                className={`flex items-center gap-1 px-2 py-0.5 cursor-pointer text-[13px] select-none ${isActive ? "bg-[#000080] text-white" : "hover:bg-[#000080] hover:text-white dark:text-[#C0C0C0]"}`}
                onClick={() => {
                  if (hasChildren) toggleExpand(item.href);
                  else if (onClose) onClose();
                }}
              >
                {hasChildren && (
                  <span className="text-[10px] w-3 shrink-0">{isExpanded ? "▼" : "▶"}</span>
                )}
                {!hasChildren && <span className="w-3 shrink-0" />}
                <span className="text-base leading-none">{item.icon}</span>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex-1 no-underline text-inherit hover:no-underline"
                >
                  {item.name}
                </Link>
              </div>

              {/* Children */}
              {hasChildren && isExpanded && item.children!.map(child => {
                const isChildActive = pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    className="no-underline text-inherit hover:no-underline"
                  >
                    <div
                      className={`flex items-center gap-1 pl-10 pr-2 py-0.5 text-[13px] select-none cursor-pointer ${isChildActive ? "bg-[#000080] text-white" : "hover:bg-[#000080] hover:text-white dark:text-[#C0C0C0]"}`}
                    >
                      <span className="text-sm leading-none">{child.icon}</span>
                      <span>{child.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="win-statusbar text-[11px]">
        <span className="win-statusbar-item">Ready</span>
        <span className="win-statusbar-item">BisnisMulai v1.0</span>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleToggle = () => setMobileOpen(prev => !prev);
    window.addEventListener('toggle-mobile-menu', handleToggle);
    return () => window.removeEventListener('toggle-mobile-menu', handleToggle);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 z-40 bg-[#C0C0C0] dark:bg-[#1A1A1A]"
        style={{
          borderRight: '2px solid',
          borderRightColor: 'var(--win-shadow-med, #808080)'
        }}
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 w-72 z-50 flex flex-col bg-[#C0C0C0] dark:bg-[#1A1A1A]"
            style={{
              borderRight: '2px solid',
              borderRightColor: 'var(--win-shadow-med, #808080)'
            }}
          >
            <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
