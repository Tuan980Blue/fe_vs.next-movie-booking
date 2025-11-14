"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import type { PaymentResponseDto } from "@/models/payment";
import { PaymentStatus } from "@/models/payment";
import { BookingStatus, type BookingResponseDto } from "@/models/booking";
import { getBookingDetailApi, getPaymentDetailApi } from "@/service";

type StatusParam = "success" | "pending" | "failed";

type Props = {
    status: StatusParam;
};

const statusMeta: Record<StatusParam, { title: string; description: string; icon: string; accentClass: string }> = {
    success: {
        title: "Thanh toán thành công!",
        description: "Chúng tôi đã phát hành vé cho bạn. Kiểm tra email hoặc xem chi tiết bên dưới.",
        icon: "🎉",
        accentClass: "from-green-400 to-green-600",
    },
    pending: {
        title: "Thanh toán đang được xử lý",
        description: "Hệ thống đang xác nhận giao dịch với cổng thanh toán. Bạn có thể tải lại trang sau ít phút.",
        icon: "⏳",
        accentClass: "from-amber-400 to-amber-500",
    },
    failed: {
        title: "Thanh toán không thành công",
        description: "Giao dịch chưa hoàn tất. Vui lòng thử lại hoặc chọn phương thức khác.",
        icon: "⚠️",
        accentClass: "from-rose-500 to-red-500",
    },
};

const PaymentStatusContent = ({ status }: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentId = searchParams.get("paymentId");
    const fallbackBookingId = searchParams.get("bookingId");

    const [payment, setPayment] = useState<PaymentResponseDto | null>(null);
    const [booking, setBooking] = useState<BookingResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        let ignore = false;

        async function loadPayment() {
            if (!paymentId) {
                setError("Không tìm thấy thông tin thanh toán.");
                setLoading(false);
                return;
            }

            try {
                const data = await getPaymentDetailApi(paymentId);
                if (!ignore) {
                    setPayment(data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err instanceof Error ? err.message : "Không thể tải thông tin thanh toán.");
                    setLoading(false);
                }
            }
        }

        loadPayment();

        return () => {
            ignore = true;
        };
    }, [paymentId]);

    useEffect(() => {
        const bookingId = payment?.bookingId ?? fallbackBookingId;
        if (!bookingId) {
            setLoading(false);
            return;
        }

        let ignore = false;
        let retries = 0;
        const MAX_RETRIES = status === "success" ? 8 : 3; // Tăng retry cho success case
        const RETRY_DELAY = status === "success" ? 2000 : 3000; // Retry nhanh hơn cho success

        const loadBooking = async () => {
            try {
                console.log(`[PaymentStatus] Loading booking ${bookingId}, retry ${retries}/${MAX_RETRIES}`);
                const data = await getBookingDetailApi(bookingId);
                if (ignore) return;
                
                console.log(`[PaymentStatus] Booking loaded:`, { 
                    id: data.id, 
                    status: data.status, 
                    code: data.code,
                    itemsCount: data.items?.length 
                });
                
                setBooking(data);
                setError(""); // Clear error nếu load thành công

                const stillPending = data?.status === BookingStatus.Pending;
                if (stillPending && retries < MAX_RETRIES && status !== "failed") {
                    // Booking vẫn đang pending, retry sau
                    console.log(`[PaymentStatus] Booking still pending, will retry in ${RETRY_DELAY}ms`);
                    retries += 1;
                    setTimeout(loadBooking, RETRY_DELAY);
                    return;
                }
                
                // Booking đã confirmed hoặc không cần retry nữa -> set loading = false
                console.log(`[PaymentStatus] Booking loaded successfully, setting loading = false`);
                if (!ignore) {
                    setLoading(false);
                }
            } catch (err: any) {
                if (ignore) return;
                
                // Kiểm tra nếu là 404 (axios error có response.status)
                const is404 = err?.response?.status === 404 || 
                    (err instanceof Error && (
                        err.message.includes("404") || 
                        err.message.includes("not found") || 
                        err.message.includes("không tồn tại") ||
                        err.message.includes("Not Found")
                    ));
                
                if (is404 && status === "success" && retries < MAX_RETRIES) {
                    // Retry khi nhận 404 trong success case (booking có thể đang được confirm)
                    retries += 1;
                    setTimeout(loadBooking, RETRY_DELAY);
                    return;
                }
                
                // Chỉ set error và stop loading nếu không phải retry case
                if (retries >= MAX_RETRIES || !is404 || status !== "success") {
                    const errorMessage = err?.response?.data?.message || 
                        (err instanceof Error ? err.message : "Không thể tải thông tin vé.");
                    setError(prev => prev || errorMessage);
                    if (!ignore) {
                        setLoading(false);
                    }
                }
            }
        };

        loadBooking();

        return () => {
            ignore = true;
        };
    }, [payment, fallbackBookingId, status]);

    const bookingDetails = useMemo(() => {
        if (!booking) return null;
        const firstItem = booking.items?.[0];
        return {
            movieTitle: firstItem?.showtime?.movieTitle ?? "",
            showtime: firstItem
                ? `${new Date(firstItem.showtime.startUtc).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} - ${new Date(firstItem.showtime.endUtc).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}`
                : "",
            date: firstItem
                ? new Date(firstItem.showtime.startUtc).toLocaleDateString("vi-VN", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })
                : "",
            seats: booking.items?.map(i => `${i.seat.rowLabel}${String(i.seat.seatNumber).padStart(2, "0")}`) ?? [],
            cinema: firstItem?.showtime?.cinemaName ?? "",
            room: firstItem?.showtime?.roomName ?? "",
            totalPrice: (booking.totalAmountMinor || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            }),
            bookingCode: booking.code,
        };
    }, [booking]);

    const meta = statusMeta[status];
    const isBookingConfirmed = booking?.status === BookingStatus.Confirmed;
    const paymentStatusLabel = payment
        ? PaymentStatus[payment.status] ?? payment.status
        : null;

    return (
        <div className="min-h-screen py-8 px-4 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {!!error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                        {error}
                    </div>
                )}

                <motion.div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${meta.accentClass} px-6 py-8 text-white shadow-xl`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="absolute -top-6 -right-6 text-6xl opacity-20">{meta.icon}</div>
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                            {paymentStatusLabel ? `Trạng thái thanh toán: ${paymentStatusLabel}` : "Đang cập nhật trạng thái thanh toán..."}
                        </div>
                        <h1 className="text-2xl font-bold">{meta.title}</h1>
                        <p className="text-sm md:text-base text-white/90">{meta.description}</p>
                        {status === "pending" && (
                            <p className="text-xs text-white/80">
                                Nếu trang không tự cập nhật sau vài phút, bạn có thể kiểm tra lịch sử đặt vé hoặc liên hệ hỗ trợ.
                            </p>
                        )}
                    </div>
                </motion.div>

                {loading && (
                    <div className="rounded-2xl border border-neutral-lightGray/40 bg-white/70 px-6 py-10 text-center text-neutral-darkGray">
                        Đang tải thông tin đặt vé...
                    </div>
                )}

                {!loading && bookingDetails && (
                    <motion.div
                        className="rounded-2xl border border-white/20 bg-white/95 px-6 py-6 shadow-xl backdrop-blur"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between border-b border-neutral-lightGray/40 pb-4">
                            <div>
                                <div className="text-xs uppercase tracking-wide text-neutral-darkGray/60">Mã đặt vé</div>
                                <div className="text-lg font-bold text-neutral-darkGray">{bookingDetails.bookingCode}</div>
                            </div>
                            <span className="text-3xl" aria-hidden>🎫</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                            <div className="space-y-3">
                                <div className="text-sm font-semibold text-neutral-darkGray">Thông tin phim</div>
                                <div className="space-y-2 text-sm text-neutral-darkGray/80">
                                    <div>{bookingDetails.movieTitle}</div>
                                    <div>{bookingDetails.date}</div>
                                    <div>{bookingDetails.showtime}</div>
                                    <div>{bookingDetails.cinema}</div>
                                    <div>{bookingDetails.room}</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-sm font-semibold text-neutral-darkGray">Ghế đã chọn</div>
                                <div className="flex flex-wrap gap-2">
                                    {bookingDetails.seats.map(seat => (
                                        <span key={seat} className="rounded-lg bg-primary-pink/10 px-3 py-2 text-sm font-semibold text-primary-pink">
                                            {seat}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between rounded-xl bg-neutral-lightGray/10 px-3 py-2 text-sm text-neutral-darkGray">
                                    <span>Tổng tiền</span>
                                    <span className="font-semibold text-primary-pink">{bookingDetails.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {booking?.status === BookingStatus.Pending && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                Vé của bạn đang chờ xác nhận. Hệ thống sẽ tự động cập nhật sau khi thanh toán hoàn tất.
                            </div>
                        )}

                        {booking?.status === BookingStatus.Canceled && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                Đơn đặt vé đã bị hủy. Vui lòng thử lại quá trình thanh toán.
                            </div>
                        )}
                    </motion.div>
                )}

                <motion.div
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-lightGray/40 bg-white/80 px-6 py-6 text-sm text-neutral-darkGray shadow"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="text-center">
                        {status === "success" && isBookingConfirmed && "Bạn có thể xem lại vé trong mục đặt vé của tôi hoặc kiểm tra email để sử dụng khi vào rạp."}
                        {status === "pending" && "Chúng tôi sẽ gửi email xác nhận ngay khi giao dịch hoàn tất. Bạn cũng có thể làm mới trang này sau ít phút."}
                        {status === "failed" && "Bạn có thể quay lại bước trước để thử thanh toán lại hoặc chọn phương thức khác."}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/booking/confirm"
                            onClick={(evt) => {
                                evt.preventDefault();
                                if (booking?.id) {
                                    router.push(`/booking/confirm?bookingId=${encodeURIComponent(booking.id)}`);
                                } else {
                                    router.push("/booking/seat-selection");
                                }
                            }}
                            className="w-full sm:w-auto rounded-xl border border-primary-pink/30 bg-primary-pink px-5 py-3 text-center font-semibold text-white shadow-md transition hover:shadow-lg"
                        >
                            Thử thanh toán lại
                        </Link>
                        <Link
                            href="/user/bookings"
                            className="w-full sm:w-auto rounded-xl border border-neutral-lightGray/60 bg-white px-5 py-3 text-center font-semibold text-neutral-darkGray transition hover:border-primary-pink/40 hover:text-primary-pink"
                        >
                            Xem lịch sử đặt vé
                        </Link>
                    </div>
                </motion.div>

                {status === "success" && isBookingConfirmed && (
                    <div className="rounded-2xl border border-white/20 bg-white/90 px-6 py-5 text-center text-sm text-neutral-darkGray">
                        Vé điện tử đã được gửi tới email của bạn. Vui lòng mang theo mã đặt vé khi đến rạp.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatusContent;

