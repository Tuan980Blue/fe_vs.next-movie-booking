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
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <aside className="bg-white rounded-xl border border-neutral-lightGray/40 shadow-sm p-4 md:p-5 h-fit sticky top-20">
          <div className="text-neutral-darkGray font-semibold text-lg mb-3">Tài khoản</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/user" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-pink text-white"
                      : "bg-white border border-neutral-lightGray/40 text-neutral-darkGray hover:bg-neutral-lightGray/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="bg-white rounded-xl border border-neutral-lightGray/40 shadow-sm p-4 md:p-6">
          {children}
        </section>
      </div>
    </div>
  );
}


