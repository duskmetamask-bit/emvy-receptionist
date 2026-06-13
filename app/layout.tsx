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
    <div className="flex min-h-screen" style={{ background: "var(--canvas)" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-150"
        style={{
          background: "var(--panel)",
          width: collapsed ? 56 : 220,
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4"
          style={{
            height: 52,
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "var(--accent)",
            }}
          >
            <Phone size={12} color="white" />
          </div>
          {!collapsed && (
            <span
              className="text-sm"
              style={{
                color: "var(--text-primary)",
                fontWeight: 510,
                letterSpacing: "-0.01em",
              }}
            >
              AI Receptionist
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 transition-colors duration-100"
                style={{
                  padding: "7px 8px",
                  borderRadius: 6,
                  background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  borderLeft: isActive
                    ? "2px solid var(--accent-bright)"
                    : "2px solid transparent",
                  marginLeft: isActive ? 0 : 2,
                  fontSize: 13,
                  fontWeight: 510,
                  letterSpacing: "-0.01em",
                }}
              >
                <Icon size={14} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center transition-colors hover:bg-white/[0.03]"
          style={{
            height: 40,
            borderTop: "1px solid var(--border-subtle)",
            color: "var(--text-subtle)",
          }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {/* Main */}
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
