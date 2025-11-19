"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getMyBookingsApi } from "@/service";
import type { BookingListItemDto, BookingSearchDto } from "@/models/booking";
import { BookingStatus } from "@/models/booking";
import BookingCard from "./BookingCard";

type BookingListProps = {
    initialBookings?: BookingListItemDto[];
    initialTotal?: number;
};

export default function BookingList({ initialBookings = [], initialTotal = 0 }: BookingListProps) {
    const [bookings, setBookings] = useState<BookingListItemDto[]>(initialBookings);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(initialTotal);
    const pageSize = 10;

    const loadBookings = async (params: BookingSearchDto) => {
        setLoading(true);
        setError("");
        try {
            const result = await getMyBookingsApi({
                ...params,
                page: params.page || page,
                pageSize,
            });
            setBookings(result.items);
            setTotalItems(result.totalItems);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không thể tải danh sách đặt vé");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params: BookingSearchDto = {
            page,
            pageSize,
        };
        if (statusFilter !== "all") {
            params.status = statusFilter;
        }
        loadBookings(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, page]);

    const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

    const statusOptions: Array<{ value: BookingStatus | "all"; label: string }> = [
        { value: "all", label: "Tất cả" },
        { value: BookingStatus.Pending, label: "Chờ thanh toán" },
        { value: BookingStatus.Confirmed, label: "Đã xác nhận" },
        { value: BookingStatus.Canceled, label: "Đã hủy" },
        { value: BookingStatus.Expired, label: "Hết hạn" },
    ];

    return (
        <div className="space-y-6">
            {/* Filter */}
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-neutral-darkGray">Lọc theo trạng thái:</span>
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => {
                            setStatusFilter(option.value);
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            statusFilter === option.value
                                ? "bg-primary-pink text-white"
                                : "bg-white border border-neutral-lightGray/40 text-neutral-darkGray hover:bg-neutral-lightGray/10"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <motion.div
                    className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>{error}</span>
                    </div>
                </motion.div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
                    <p className="mt-4 text-neutral-darkGray/70">Đang tải danh sách đặt vé...</p>
                </div>
            )}

            {/* Bookings List */}
            {!loading && !error && (
                <>
                    {bookings.length === 0 ? (
                        <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-12 text-center">
                            <div className="text-6xl mb-4">🎬</div>
                            <h3 className="text-xl font-bold text-neutral-darkGray mb-2">
                                Chưa có đơn đặt vé nào
                            </h3>
                            <p className="text-neutral-darkGray/70">
                                {statusFilter !== "all"
                                    ? "Không có đơn đặt vé nào với trạng thái này."
                                    : "Bắt đầu đặt vé để xem lịch sử đặt vé của bạn."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking, index) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <BookingCard booking={booking} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg border border-neutral-lightGray/40 bg-white text-neutral-darkGray font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-lightGray/10 transition-colors"
                            >
                                Trước
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                page === pageNum
                                                    ? "bg-primary-pink text-white"
                                                    : "bg-white border border-neutral-lightGray/40 text-neutral-darkGray hover:bg-neutral-lightGray/10"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-lg border border-neutral-lightGray/40 bg-white text-neutral-darkGray font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-lightGray/10 transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

