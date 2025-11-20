"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyBookingsApi } from "@/service";
import { BookingStatus } from "@/models/booking";

export default function UserDashboardPage() {
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingBookings: 0,
        availablePromotions: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const result = await getMyBookingsApi({ pageSize: 100 });
                const total = result.totalItems;
                const upcoming = result.items.filter(
                    (b) => b.status === BookingStatus.Confirmed && b.startUtc && new Date(b.startUtc) > new Date()
                ).length;
                setStats({
                    totalBookings: total,
                    upcomingBookings: upcoming,
                    availablePromotions: 0, // Placeholder
                });
            } catch (err) {
                console.error("Failed to load stats:", err);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    return (
        <div className="space-y-6 p-4 lg:p-8 bg-white rounded-3xl">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-darkGray">Tổng quan tài khoản</h1>
                <p className="text-neutral-darkGray/70 mt-1">Tổng hợp nhanh thông tin và hoạt động gần đây.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-6 shadow-sm">
                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Số đơn đã đặt</div>
                    <div className="text-3xl font-bold text-primary-pink">
                        {loading ? "—" : stats.totalBookings}
                    </div>
                    <Link
                        href="/user/bookings"
                        className="text-xs text-primary-pink hover:underline mt-2 inline-block"
                    >
                        Xem tất cả →
                    </Link>
                </div>
                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-6 shadow-sm">
                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Vé sắp tới</div>
                    <div className="text-3xl font-bold text-primary-pink">
                        {loading ? "—" : stats.upcomingBookings}
                    </div>
                    <Link
                        href="/user/bookings?status=confirmed"
                        className="text-xs text-primary-pink hover:underline mt-2 inline-block"
                    >
                        Xem chi tiết →
                    </Link>
                </div>
                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-6 shadow-sm">
                    <div className="text-neutral-darkGray/70 text-sm font-medium mb-2">Ưu đãi khả dụng</div>
                    <div className="text-3xl font-bold text-primary-pink">
                        {loading ? "—" : stats.availablePromotions}
                    </div>
                    <p className="text-xs text-neutral-darkGray/50 mt-2">Sắp ra mắt</p>
                </div>
            </div>

            <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-6 shadow-sm">
                <div className="text-neutral-darkGray font-semibold mb-4">Hoạt động gần đây</div>
                <div className="text-neutral-darkGray/70 text-sm">
                    {loading ? "Đang tải..." : "Chưa có dữ liệu."}
                </div>
            </div>
        </div>
    );
}


