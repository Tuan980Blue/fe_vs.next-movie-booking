"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { CreditCard, LayoutDashboard, Settings, User2 } from "lucide-react";

type NavItem = {
    href: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
    {
        href: "/user",
        label: "Tổng quan",
        description: "Thống kê nhanh & trạng thái tài khoản",
        icon: LayoutDashboard,
    },
    {
        href: "/user/profile",
        label: "Hồ sơ",
        description: "Thông tin cá nhân & phương thức liên hệ",
        icon: User2,
    },
    {
        href: "/user/bookings",
        label: "Đơn đặt vé",
        description: "Lịch sử đặt vé & vé sắp tới",
        icon: CreditCard,
    },
    {
        href: "/user/settings",
        label: "Cài đặt",
        description: "Bảo mật, thông báo & ưu tiên",
        icon: Settings,
    },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen mb-10 text-neutral-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
                <section className="rounded-3xl border-b-2 border-b-yellow-500 p-2 lg:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-yellow">
                                Cinema Booking
                            </p>
                            <h1 className=" font-semibold text-neutral-white">
                                Trung tâm tài khoản
                            </h1>
                            <p className="text-neutral-white/70 italic">
                                Quản lý thông tin cá nhân, kiểm tra lịch sử đặt vé và tùy chỉnh trải nghiệm đặt vé của bạn với hệ
                                thống màu sắc nhất quán từ brand identity.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-primary-pink/20 bg-primary-purple/40 px-6 py-4 text-right">
                            <p className="text-sm uppercase tracking-wide text-neutral-white/70">Trạng thái</p>
                            <p className="font-bold text-green-500">Active</p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-neutral-white/15 p-5 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                            <nav className="space-y-3">
                                {navItems.map((item) => {
                                    const isActive =
                                        pathname === item.href || (item.href !== "/user" && pathname.startsWith(item.href));
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`group flex items-start gap-4 rounded-2xl border px-4 py-3 transition-all ${
                                                isActive
                                                    ? "border-primary-pink/70 bg-gradient-to-r from-primary-pink/10 via-primary-pink/5 to-transparent text-neutral-white shadow-[0_12px_24px_rgba(236,72,153,0.25)]"
                                                    : "border-neutral-white/10 bg-primary-purple/30 text-neutral-white/70 hover:border-primary-pink/40 hover:bg-primary-purple/50"
                                            }`}
                                        >
                      <span
                          className={`mt-1 rounded-xl p-2 text-primary-pink/80 transition group-hover:text-primary-pink ${
                              isActive ? "text-primary-pink" : ""
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                                            <div>
                                                <p className="text-sm font-semibold">{item.label}</p>
                                                <p className="text-xs text-neutral-white/60">{item.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    <section className="rounded-3xl">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}