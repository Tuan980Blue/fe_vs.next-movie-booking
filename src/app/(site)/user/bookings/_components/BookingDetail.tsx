"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getBookingDetailApi } from "@/service";
import type { BookingResponseDto } from "@/models/booking";
import { BookingStatus } from "@/models/booking";
import QrCodeBooking from "@/app/(site)/_components/QRCodeBooking";

type BookingDetailProps = {
    bookingId: string;
};

const statusConfig: Record<BookingStatus, { label: string; color: string; bgColor: string }> = {
    [BookingStatus.Pending]: {
        label: "Chờ thanh toán",
        color: "text-accent-yellow",
        bgColor: "bg-accent-yellow/10",
    },
    [BookingStatus.Confirmed]: {
        label: "Đã xác nhận",
        color: "text-primary-pink",
        bgColor: "bg-primary-pink/10",
    },
    [BookingStatus.Canceled]: {
        label: "Đã hủy",
        color: "text-accent-red",
        bgColor: "bg-accent-red/10",
    },
    [BookingStatus.Expired]: {
        label: "Hết hạn",
        color: "text-neutral-darkGray",
        bgColor: "bg-neutral-lightGray/10",
    },
    [BookingStatus.Refunding]: {
        label: "Đang hoàn tiền",
        color: "text-accent-orange",
        bgColor: "bg-accent-orange/10",
    },
    [BookingStatus.Refunded]: {
        label: "Đã hoàn tiền",
        color: "text-neutral-darkGray",
        bgColor: "bg-neutral-lightGray/10",
    },
};

export default function BookingDetail({ bookingId }: BookingDetailProps) {
    const router = useRouter();
    const [booking, setBooking] = useState<BookingResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                setLoading(true);
                setError("");
                const data = await getBookingDetailApi(bookingId);
                if (!ignore) setBooking(data);
            } catch (err) {
                if (!ignore) {
                    setError(err instanceof Error ? err.message : "Không thể tải chi tiết đặt vé");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [bookingId]);

    const formatVnd = (amount: number) =>
        (amount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    const formatTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
                <p className="mt-4 text-neutral-darkGray/70">Đang tải chi tiết đặt vé...</p>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="rounded-xl border border-red-200 bg-red-50 px-6 text-red-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                </div>
                <Link
                    href="/user/bookings"
                    className="text-sm text-red-600 underline inline-block"
                >
                    Quay lại danh sách đặt vé
                </Link>
            </motion.div>
        );
    }

    if (!booking) {
        return null;
    }

    const status = statusConfig[booking.status] || statusConfig[BookingStatus.Pending];
    const firstItem = booking.items?.[0];
    const canShowQr = booking.status === BookingStatus.Confirmed && booking.bookingQr;

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/user/bookings"
                        className="text-sm text-primary-pink hover:underline inline-flex items-center gap-2 mb-4"
                    >
                        ← Quay lại danh sách
                    </Link>
                    <h1 className="text-2xl font-bold text-neutral-darkGray">Chi tiết đặt vé</h1>
                </div>
                <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${status.bgColor} ${status.color}`}
                >
                    {status.label}
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Booking Info */}
                    <motion.div
                        className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-sm p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-pink/10 text-2xl font-black text-primary-pink">
                                {firstItem?.showtime?.movieTitle?.[0] || "🎬"}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs uppercase tracking-widest text-primary-pink font-bold mb-1">
                                    Phim
                                </p>
                                <h2 className="text-xl font-bold text-neutral-darkGray">
                                    {firstItem?.showtime?.movieTitle || "—"}
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 text-sm border-t border-neutral-lightGray/30 pt-6">
                            <div>
                                <p className="text-neutral-darkGray/70 font-medium mb-1">Mã đặt vé</p>
                                <p className="text-neutral-darkGray font-mono font-semibold">{booking.code}</p>
                            </div>
                            <div>
                                <p className="text-neutral-darkGray/70 font-medium mb-1">Ngày đặt</p>
                                <p className="text-neutral-darkGray font-semibold">
                                    {formatDate(booking.createdAt)}
                                </p>
                            </div>
                            {firstItem?.showtime && (
                                <>
                                    <div>
                                        <p className="text-neutral-darkGray/70 font-medium mb-1">Ngày chiếu</p>
                                        <p className="text-neutral-darkGray font-semibold">
                                            {formatDate(firstItem.showtime.startUtc)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-neutral-darkGray/70 font-medium mb-1">Khung giờ</p>
                                        <p className="text-neutral-darkGray font-semibold">
                                            {formatTime(firstItem.showtime.startUtc)} -{" "}
                                            {formatTime(firstItem.showtime.endUtc)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-neutral-darkGray/70 font-medium mb-1">Rạp chiếu</p>
                                        <p className="text-neutral-darkGray font-semibold">
                                            {firstItem.showtime.cinemaName || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-neutral-darkGray/70 font-medium mb-1">Phòng chiếu</p>
                                        <p className="text-neutral-darkGray font-semibold">
                                            {firstItem.showtime.roomName || "—"}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Seats */}
                    <motion.div
                        className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-sm p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-lg font-bold text-neutral-darkGray mb-4">Ghế đã chọn</h3>
                        <div className="flex flex-wrap gap-2">
                            {booking.items?.map((item) => (
                                <span
                                    key={item.id}
                                    className="inline-flex items-center rounded-lg border border-primary-pink/40 bg-primary-pink/10 px-4 py-2 text-sm font-bold text-primary-pink"
                                >
                                    {item.seat.rowLabel}
                                    {String(item.seat.seatNumber).padStart(2, "0")}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Items Detail */}
                    <motion.div
                        className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-sm p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-lg font-bold text-neutral-darkGray mb-4">Chi tiết vé</h3>
                        <div className="space-y-3">
                            {booking.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-neutral-lightGray/40 bg-neutral-lightGray/5"
                                >
                                    <div>
                                        <p className="font-semibold text-neutral-darkGray">
                                            {item.seat.rowLabel}
                                            {String(item.seat.seatNumber).padStart(2, "0")}
                                        </p>
                                        <p className="text-sm text-neutral-darkGray/70">
                                            {item.showtime.roomName} • {item.showtime.cinemaName}
                                        </p>
                                    </div>
                                    <p className="font-bold text-primary-pink">
                                        {formatVnd(item.seatPriceMinor)}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-neutral-lightGray/30 flex items-center justify-between">
                            <p className="text-lg font-bold text-neutral-darkGray">Tổng cộng</p>
                            <p className="text-2xl font-bold text-primary-pink">
                                {formatVnd(booking.totalAmountMinor)}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* QR Code */}
                    {canShowQr && (
                        <motion.div
                            className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-sm p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-lg font-bold text-neutral-darkGray mb-4">Mã QR nhận vé</h3>
                            <div className="rounded-xl bg-neutral-lightGray/5 p-4 border border-neutral-lightGray/40">
                                <QrCodeBooking bookingQr={booking.bookingQr!} />
                            </div>
                        </motion.div>
                    )}

                    {/* Customer Info */}
                    {booking.customerInfo && (
                        <motion.div
                            className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-sm p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-lg font-bold text-neutral-darkGray mb-4">Thông tin khách hàng</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-neutral-darkGray/70 font-medium mb-1">Họ tên</p>
                                    <p className="text-neutral-darkGray font-semibold">
                                        {booking.customerInfo.fullName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-neutral-darkGray/70 font-medium mb-1">Email</p>
                                    <p className="text-neutral-darkGray font-semibold">
                                        {booking.customerInfo.email}
                                    </p>
                                </div>
                                {booking.customerInfo.phone && (
                                    <div>
                                        <p className="text-neutral-darkGray/70 font-medium mb-1">Số điện thoại</p>
                                        <p className="text-neutral-darkGray font-semibold">
                                            {booking.customerInfo.phone}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

