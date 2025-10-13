
"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminOnly } from "@/components/RoleGuard";

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <AdminOnly fallback={
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Không có quyền truy cập</h1>
                <p className="text-gray-600">Bạn cần quyền admin để xem trang này.</p>
            </div>
        }>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Chào mừng trở lại, {user?.fullName || 'Admin'}!</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                                <p className="text-2xl font-bold text-gray-900">1,234</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">👥</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-green-600 font-medium">+12%</span>
                            <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
                        </div>
                    </div>

                    {/* Total Movies */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng phim</p>
                                <p className="text-2xl font-bold text-gray-900">89</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🎬</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-green-600 font-medium">+5</span>
                            <span className="text-sm text-gray-500 ml-2">phim mới</span>
                        </div>
                    </div>

                    {/* Total Bookings */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đơn đặt vé</p>
                                <p className="text-2xl font-bold text-gray-900">5,678</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🎫</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-green-600 font-medium">+23%</span>
                            <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                                <p className="text-2xl font-bold text-gray-900">₫2.4M</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-green-600 font-medium">+18%</span>
                            <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Hoạt động gần đây</h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-lg">👤</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">Người dùng mới đăng ký</p>
                                <p className="text-sm text-gray-600">john.doe@example.com vừa đăng ký tài khoản</p>
                            </div>
                            <span className="text-sm text-gray-500">5 phút trước</span>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-lg">🎫</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">Đơn đặt vé mới</p>
                                <p className="text-sm text-gray-600">Đơn đặt vé #12345 cho phim Avengers</p>
                            </div>
                            <span className="text-sm text-gray-500">15 phút trước</span>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-lg">🎬</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">Phim mới được thêm</p>
                                <p className="text-sm text-gray-600">Phim Spider-Man: No Way Home đã được thêm vào hệ thống</p>
                            </div>
                            <span className="text-sm text-gray-500">1 giờ trước</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                            <div className="text-center">
                                <span className="text-2xl mb-2 block">👥</span>
                                <p className="font-medium text-blue-800">Quản lý người dùng</p>
                                <p className="text-sm text-blue-600">Xem và chỉnh sửa thông tin người dùng</p>
                            </div>
                        </button>

                        <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                            <div className="text-center">
                                <span className="text-2xl mb-2 block">🎬</span>
                                <p className="font-medium text-purple-800">Quản lý phim</p>
                                <p className="text-sm text-purple-600">Thêm, sửa, xóa phim trong hệ thống</p>
                            </div>
                        </button>

                        <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                            <div className="text-center">
                                <span className="text-2xl mb-2 block">📊</span>
                                <p className="font-medium text-green-800">Báo cáo thống kê</p>
                                <p className="text-sm text-green-600">Xem báo cáo chi tiết về doanh thu</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </AdminOnly>
    );
}
