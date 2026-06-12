"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone, Calendar, Clock, Settings, ChevronLeft, ChevronRight,
} from "lucide-react";
import Providers from "./providers";

const navItems = [
  { href: "/", label: "Calls", icon: Phone },
  { href: "/bookings", label: "Bookings", icon: Calendar },
  { href: "/availability", label: "Availability", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

function SidebarInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--background)" }}>
      <aside
        className="flex flex-col border-r transition-all duration-200"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          width: collapsed ? 64 : 220,
        }}
      >
        <div
          className="flex items-center gap-3 border-b px-4 py-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--primary)" }}
          >
            <Phone size={14} color="white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              AI Receptionist
            </span>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
                style={{
                  background: isActive ? "rgba(59,130,246,0.12)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--secondary-foreground)",
                  borderLeft: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                }}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center border-t p-3 transition-colors hover:bg-white/5"
          style={{ borderColor: "var(--border)" }}
        >
          {collapsed ? (
            <ChevronRight size={14} style={{ color: "var(--muted-foreground)" }} />
          ) : (
            <ChevronLeft size={14} style={{ color: "var(--muted-foreground)" }} />
          )}
        </button>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarInner>{children}</SidebarInner>
    </Providers>
  );
}
