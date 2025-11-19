"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BookingListItemDto } from "@/models/booking";
import { BookingStatus } from "@/models/booking";

type BookingCardProps = {
    booking: BookingListItemDto;
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

export default function BookingCard({ booking }: BookingCardProps) {
    const status = statusConfig[booking.status] || statusConfig[BookingStatus.Pending];
    const formatVnd = (amount: number) =>
        (amount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("vi-VN", {
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

    const formatShowtime = (dateString?: string) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <Link href={`/user/bookings/${booking.id}`}>
            <motion.div
                className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-neutral-darkGray">
                                    {booking.movieTitle || "Phim chưa xác định"}
                                </h3>
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.bgColor} ${status.color}`}
                                >
                                    {status.label}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-darkGray/70 font-mono font-semibold">
                                Mã vé: {booking.code}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary-pink">
                                {formatVnd(booking.totalAmountMinor)}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 text-sm border-t border-neutral-lightGray/30 pt-4">
                        <div>
                            <p className="text-neutral-darkGray/70 font-medium mb-1">Ngày chiếu</p>
                            <p className="text-neutral-darkGray font-semibold">
                                {formatShowtime(booking.startUtc)}
                            </p>
                        </div>
                        <div>
                            <p className="text-neutral-darkGray/70 font-medium mb-1">Rạp chiếu</p>
                            <p className="text-neutral-darkGray font-semibold">
                                {booking.cinemaName || "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-neutral-darkGray/70 font-medium mb-1">Số ghế</p>
                            <p className="text-neutral-darkGray font-semibold">
                                {booking.seatsCount} ghế
                            </p>
                        </div>
                        <div>
                            <p className="text-neutral-darkGray/70 font-medium mb-1">Ngày đặt</p>
                            <p className="text-neutral-darkGray font-semibold">
                                {formatDate(booking.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

