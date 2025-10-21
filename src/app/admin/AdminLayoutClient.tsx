"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminOnly } from "@/context/RoleGuard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user)) {
            router.push('/auth?redirect=' + encodeURIComponent(pathname));
            return;
        }

        if (!isLoading && user && !user.roles?.some(role => role.toLowerCase() === 'admin')) {
            router.push('/403');
            return;
        }
    }, [isAuthenticated, user, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    if (!user.roles?.some(role => role.toLowerCase() === 'admin')) {
        return null;
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: "📊" },
        { href: "/admin/movies", label: "Quản lý phim", icon: "🎬" },
        { href: "/admin/users", label: "Quản lý người dùng", icon: "👥" },
    ];

    return (
        <AdminOnly fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Không có quyền truy cập</h1>
                    <p className="text-gray-600">Bạn cần quyền admin để truy cập trang này.</p>
                </div>
            </div>
        }>
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 text-white shadow-lg">
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <span className="mr-2">🎭</span>
                            Admin Panel
                        </h2>
                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || 
                                    (item.href !== "/admin" && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-primary-pink text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    
                    {/* User Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-pink rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    {user.fullName?.charAt(0) || user.email?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user.fullName || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </AdminOnly>
    );
}
