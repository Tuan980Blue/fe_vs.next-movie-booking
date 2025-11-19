"use client";

import { motion } from "framer-motion";
import type { ShowtimeReadDto } from "@/models/showtime";
import type { SeatLayoutUi, SeatUi } from "@/models/seat";

type BookingSummaryProps = {
    showtime: ShowtimeReadDto | null;
    user: { fullName?: string; phone?: string; email?: string } | null;
    isAuthenticated: boolean;
    selectedSeatIds: string[];
    layout: SeatLayoutUi | null;
    basePrice: number;
    totalPrice: number;
    secondsLeft: number;
    actionLoading: boolean;
    onConfirm: () => void;
    getSeatName: (seat: SeatUi) => string;
};

export default function BookingSummary({
    showtime,
    user,
    isAuthenticated,
    selectedSeatIds,
    layout,
    basePrice,
    totalPrice,
    secondsLeft,
    actionLoading,
    onConfirm,
    getSeatName,
}: BookingSummaryProps) {
    const formatVnd = (amount: number) =>
        (amount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const toDate = (v?: string | null) => (v ? new Date(v) : null);

    const canProceed = selectedSeatIds.length > 0 && secondsLeft > 0 && !actionLoading;

    return (
        <div className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-xl overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="bg-primary-pink px-5 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <span className="text-lg">🎟️</span>
                        <span className="text-base font-bold">Thông tin đặt vé</span>
                    </div>
                </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {/* User Info */}
                {isAuthenticated && user && (
                    <div className="rounded-lg border border-neutral-lightGray/40 bg-neutral-lightGray/5 px-4 py-3">
                        <div className="text-xs text-neutral-darkGray">
                            <div className="font-medium">{user.fullName || "-"}</div>
                            <div className="text-neutral-darkGray/70 text-xs mt-0.5">
                                {user.phone || "-"} • {user.email || "-"}
                            </div>
                        </div>
                    </div>
                )}

                {/* Movie Info */}
                <div>
                    <p className="text-base font-bold text-primary-pink">{showtime?.movieTitle || "-"}</p>
                </div>

                {/* Showtime Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-darkGray">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary-pink shrink-0">
                            <path d="M7 10h10M7 14h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        <span>
                            {toDate(showtime?.startUtc)?.toLocaleDateString("vi-VN", {
                                weekday: "short",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-darkGray">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary-pink shrink-0">
                            <path
                                d="M12 6v6l4 2"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        <span>
                            {toDate(showtime?.startUtc)?.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {toDate(showtime?.endUtc)?.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                    {(showtime?.roomName || showtime?.cinemaName) && (
                        <div className="flex items-center gap-2 text-neutral-darkGray">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary-pink shrink-0">
                                <path
                                    d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            <span>
                                {showtime.roomName} • {showtime.cinemaName}
                            </span>
                        </div>
                    )}
                </div>

                <div className="h-px bg-neutral-lightGray/40" />

                {/* Selected Seats */}
                <div className="text-sm">
                    <div className="mb-2 font-medium text-neutral-darkGray">Ghế đã chọn</div>
                    {selectedSeatIds.length === 0 ? (
                        <div className="text-neutral-darkGray/70 text-xs">Chưa chọn ghế</div>
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {selectedSeatIds.map((id) => {
                                const seat = layout?.rows.flatMap((r) => r.seats).find((s) => s.id === id);
                                return (
                                    <span
                                        key={id}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary-pink/10 text-primary-pink border border-primary-pink/20 text-xs font-medium"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M6 11V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                d="M5 11h16v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                        {seat ? getSeatName(seat) : id}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="h-px bg-neutral-lightGray/40" />

                {/* Price Summary */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-neutral-darkGray/70">Giá vé (ước tính)</span>
                        <span className="font-medium text-neutral-darkGray">{formatVnd(basePrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-neutral-darkGray/70">Số lượng</span>
                        <span className="font-medium text-neutral-darkGray">{selectedSeatIds.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-neutral-lightGray/30">
                        <span className="text-neutral-darkGray">Tạm tính</span>
                        <span className="text-primary-pink">{formatVnd(totalPrice)}</span>
                    </div>
                    <p className="text-xs text-neutral-darkGray/60 italic">
                        * Giá chính xác sẽ được hiển thị ở bước xác nhận
                    </p>
                </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-lightGray/40 bg-white">
                <motion.button
                    type="button"
                    onClick={onConfirm}
                    disabled={!canProceed}
                    className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors ${
                        canProceed
                            ? "bg-primary-pink hover:bg-primary-pink/90"
                            : "bg-neutral-lightGray cursor-not-allowed opacity-50"
                    }`}
                    whileTap={canProceed ? { scale: 0.98 } : {}}
                >
                    {actionLoading ? "ĐANG XỬ LÝ..." : "ĐẶT VÉ NGAY"}
                </motion.button>
                {selectedSeatIds.length > 0 && (
                    <p className="text-xs text-center text-neutral-darkGray/70 mt-2">
                        💡 Bạn có {selectedSeatIds.length} ghế đã chọn
                    </p>
                )}
            </div>
        </div>
    );
}

