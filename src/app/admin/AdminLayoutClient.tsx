"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminOnly } from "@/context/RoleGuard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import SidebarAdmin from "@/app/admin/_components/SidebarAdmin";
import AdminSkeleton from "@/app/admin/_components/AdminSkeleton";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        return <AdminSkeleton />;
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    if (!user.roles?.some(role => role.toLowerCase() === 'admin')) {
        return null;
    }

    return (
        <AdminOnly fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Không có quyền truy cập</h1>
                    <p className="text-gray-600">Bạn cần quyền admin để truy cập trang này.</p>
                </div>
            </div>
        }>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                {/* Sidebar */}
                <SidebarAdmin 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                />

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                    {/* Mobile Header */}
                    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                        <div className="w-10"></div> {/* Spacer for centering */}
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </AdminOnly>
    );
}
