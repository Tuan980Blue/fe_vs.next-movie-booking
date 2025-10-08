"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems: Array<{ href: string; label: string }> = [
    { href: "/user", label: "Tổng quan" },
    { href: "/user/profile", label: "Hồ sơ" },
    { href: "/user/bookings", label: "Đơn đặt vé" },
    { href: "/user/settings", label: "Cài đặt" },
  ];

  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <aside className="bg-white/10 backdrop-blur-md rounded-xl border border-white/15 p-4 md:p-5 h-fit sticky top-6">
          <div className="text-white/90 font-semibold text-lg mb-3">Tài khoản</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/user" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition border \
                  ${isActive
                      ? "bg-[#f53d7a] border-[#f53d7a] text-white shadow-[0_0_20px_rgba(245,61,122,0.35)]"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/15"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="bg-white/10 backdrop-blur-md rounded-xl border border-white/15 p-4 md:p-6">
          {children}
        </section>
      </div>
    </div>
  );
}


