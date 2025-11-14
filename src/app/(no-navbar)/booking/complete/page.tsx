
"use client"

import {motion} from "framer-motion";
import Link from "next/link";
import {Suspense, useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {getBookingDetailApi, getPaymentDetailApi} from "@/service";
import {PaymentStatus} from "@/models/payment";
import {BookingStatus} from "@/models/booking";
import type {BookingResponseDto} from "@/models/booking";

const BookingCompleteContent = () => {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState<BookingResponseDto | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const paymentId = searchParams.get('paymentId');

    useEffect(() => {
        let ignore = false;
        async function run() {
            if (!bookingId) return;
            try {
                setLoading(true);
                setError('');
                const params = Object.fromEntries(searchParams.entries());
                const hasVnpParams = Object.keys(params).some(k => k.toLowerCase().startsWith('vnp_'));
                if (hasVnpParams) {
                    const vnpTxnRef = params['vnp_TxnRef'] ?? params['vnp_txnref'];
                    const responseCode = params['vnp_ResponseCode'] ?? params['vnp_responsecode'];
                    const redirectStatus = responseCode === '00' ? 'success' : 'failed';
                    if (vnpTxnRef) {
                        router.replace(`/booking/payment/${redirectStatus}?paymentId=${encodeURIComponent(vnpTxnRef)}&bookingId=${encodeURIComponent(bookingId)}`);
                        return;
                    }
                }

                if (paymentId) {
                    // For other providers, read payment status if present
                    try {
                        const p = await getPaymentDetailApi(paymentId);
                        setPaymentStatus(p.status);
                    } catch {
                        // ignore
                    }
                }
                const data = await getBookingDetailApi(bookingId);
                if (!ignore) setBooking(data);
                if (data?.status !== undefined && data.status !== BookingStatus.Confirmed) {
                    if (!hasVnpParams && !paymentId) {
                        setError('Đang chờ xác nhận thanh toán. Vui lòng chờ trong giây lát.');
                    }
                }
            } catch (e: unknown) {
                if (!ignore) setError(e instanceof Error ? e.message : 'Không thể tải thông tin vé');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        run();
        return () => {
            ignore = true;
        };
    }, [bookingId, paymentId, searchParams, router]);

    const formatVnd = (amount: number) =>
        (amount || 0).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});

    const bookingDetails = useMemo(() => {
        const first = booking?.items?.[0];
        return {
            movieTitle: first?.showtime?.movieTitle || '',
            showtime: first ? `${new Date(first.showtime.startUtc).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            })} - ${new Date(first.showtime.endUtc).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}` : '',
            date: first ? new Date(first.showtime.startUtc).toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }) : '',
            seats: booking?.items?.map(i => `${i.seat.rowLabel}${String(i.seat.seatNumber).padStart(2, '0')}`) || [],
            cinema: first?.showtime?.cinemaName || '',
            room: first?.showtime?.roomName || '',
            totalPrice: formatVnd(booking?.totalAmountMinor || 0),
            bookingCode: booking?.code || ''
        };
    }, [booking]);

    const bookingStatus = booking?.status;
    const heroState = useMemo<"success" | "pending" | "failed">(() => {
        if (bookingStatus === BookingStatus.Confirmed) {
            return "success";
        }
        if (bookingStatus === BookingStatus.Canceled || bookingStatus === BookingStatus.Expired ||
            paymentStatus === PaymentStatus.Failed || paymentStatus === PaymentStatus.Canceled) {
            return "failed";
        }
        return "pending";
    }, [bookingStatus, paymentStatus]);

    useEffect(() => {
        if (heroState === "success") {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
        setShowConfetti(false);
        return;
    }, [heroState]);

    const heroMeta = useMemo(() => {
        switch (heroState) {
            case "success":
                return {
                    icon: "✅",
                    gradient: "from-green-400 to-green-600",
                    title: "Đặt vé thành công!",
                    message: "Cảm ơn bạn đã tin tưởng TA MEM CINEMA. Thông tin vé đã được gửi về email của bạn.",
                };
            case "failed":
                return {
                    icon: "⚠️",
                    gradient: "from-rose-500 to-red-500",
                    title: "Thanh toán chưa hoàn tất",
                    message: "Giao dịch không thành công hoặc bị hủy. Vui lòng thử thanh toán lại hoặc chọn phương thức khác.",
                };
            default:
                return {
                    icon: "⏳",
                    gradient: "from-amber-400 to-amber-500",
                    title: "Đang chờ xác nhận thanh toán",
                    message: "Hệ thống đang xác nhận giao dịch với cổng thanh toán. Bạn có thể tải lại trang sau ít phút.",
                };
        }
    }, [heroState]);

    const glowColor = useMemo(() => {
        switch (heroState) {
            case "success":
                return "rgba(34, 197, 94, 0.7)";
            case "pending":
                return "rgba(245, 158, 11, 0.7)";
            default:
                return "rgba(248, 113, 113, 0.7)";
        }
    }, [heroState]);

    return (
        <div className="min-h-screen py-8 px-4 lg:px-8">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-primary-pink rounded-full"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: -10,
                                opacity: 1
                            }}
                            animate={{
                                y: window.innerHeight + 10,
                                opacity: 0,
                                rotate: 360
                            }}
                            transition={{
                                duration: 3,
                                delay: Math.random() * 2,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                {!!error && (
                    <div className="mb-4 rounded-xl p-4 bg-red-50 text-red-600">
                        {error}
                        {bookingId && (
                            <div className="mt-2">
                                <Link href={`/booking/confirm?bookingId=${encodeURIComponent(bookingId)}`} className="underline text-red-600">
                                    Thử thanh toán lại
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                {/* Status Banner */}
                <motion.div
                    className="mb-6 text-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${heroMeta.gradient} shadow-xl mb-2`}
                        animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: [
                                `0 0 0 0 ${glowColor}`,
                                `0 0 0 10px ${glowColor.replace("0.7", "0")}`,
                                `0 0 0 0 ${glowColor.replace("0.7", "0")}`
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.span
                            className="text-3xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {heroMeta.icon}
                        </motion.span>
                    </motion.div>
                    <motion.h1
                        className="mb-2 text-xl font-bold text-gray-700 drop-shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {heroMeta.title}
                    </motion.h1>
                    <motion.p
                        className="max-w-2xl mx-auto text-sm text-pink-500"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        {heroMeta.message}
                    </motion.p>
                </motion.div>

                {/* Booking Details Card */}
                <motion.div
                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="bg-primary-pink px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <span className="text-2xl">🎫</span>
                                <span className="text-xl font-bold">Thông tin vé</span>
                            </div>
                            <div className="text-white/90 text-sm font-medium">
                                Mã đặt vé: {bookingDetails.bookingCode || '—'}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Movie Info */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-24 bg-gradient-to-br from-primary-pink/20 to-accent-orange/20 rounded-lg flex items-center justify-center text-2xl font-bold text-primary-pink">
                                        {bookingDetails.movieTitle[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-neutral-darkGray mb-2">
                                            {bookingDetails.movieTitle}
                                        </h3>
                                        <div className="space-y-2 text-sm text-neutral-lightGray">
                                            <div className="flex items-center gap-2">
                                                <span>📅</span>
                                                <span>{bookingDetails.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>⏰</span>
                                                <span>{bookingDetails.showtime}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>🏢</span>
                                                <span>{bookingDetails.cinema}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>🎬</span>
                                                <span>{bookingDetails.room}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Seat & Price Info */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-neutral-lightGray/10 to-neutral-lightGray/5 rounded-xl p-4">
                                    <h4 className="font-semibold text-neutral-darkGray mb-3">Ghế đã chọn</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {bookingDetails.seats.map((seat, index) => (
                                            <motion.span
                                                key={seat}
                                                className="px-3 py-2 bg-primary-pink/10 text-primary-pink rounded-lg font-semibold border border-primary-pink/20"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 1.1 + index * 0.1 }}
                                            >
                                                {seat}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-accent-yellow/10 to-accent-orange/10 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-neutral-darkGray">Tổng thanh toán:</span>
                                        <span className="text-2xl font-bold text-primary-pink">{bookingDetails.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col justify-center gap-4 sm:flex-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                >
                    {heroState === "success" && (
                        <>
                            <Link href="/user/my-bookings">
                                <motion.button
                                    className="w-full cursor-pointer rounded-xl bg-primary-pink px-8 py-4 text-lg font-bold text-white transition-all duration-300 sm:w-auto"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Xem vé của tôi
                                </motion.button>
                            </Link>
                            <Link href="/">
                                <motion.button
                                    className="w-full cursor-pointer rounded-xl border-2 border-white/30 bg-white px-8 py-4 text-lg font-bold text-gray-400 transition-all duration-300 backdrop-blur-sm sm:w-auto"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Về trang chủ
                                </motion.button>
                            </Link>
                        </>
                    )}
                    {heroState === "pending" && (
                        <>
                            <motion.button
                                className="w-full cursor-pointer rounded-xl bg-primary-pink px-8 py-4 text-lg font-bold text-white transition-all duration-300 sm:w-auto"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.reload()}
                            >
                                Làm mới trạng thái
                            </motion.button>
                            <Link href="/user/my-bookings">
                                <motion.button
                                    className="w-full cursor-pointer rounded-xl border border-primary-pink/30 bg-white px-8 py-4 text-lg font-bold text-primary-pink transition-all duration-300 sm:w-auto"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Xem lịch sử đặt vé
                                </motion.button>
                            </Link>
                        </>
                    )}
                    {heroState === "failed" && (
                        <>
                            <Link href={bookingId ? `/booking/confirm?bookingId=${encodeURIComponent(bookingId)}` : "/booking/seat-selection"}>
                                <motion.button
                                    className="w-full cursor-pointer rounded-xl bg-primary-pink px-8 py-4 text-lg font-bold text-white transition-all duration-300 sm:w-auto"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Thử thanh toán lại
                                </motion.button>
                            </Link>
                            <Link href="/booking/seat-selection">
                                <motion.button
                                    className="w-full cursor-pointer rounded-xl border border-red-200 bg-white px-8 py-4 text-lg font-bold text-red-500 transition-all duration-300 sm:w-auto"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Chọn suất chiếu khác
                                </motion.button>
                            </Link>
                        </>
                    )}
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    className="mt-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                        <h3 className="mb-3 font-semibold text-pink-400">📧 Thông tin quan trọng</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            {heroState === "success" && (
                                <>
                                    <p>• Vé điện tử đã được gửi về email của bạn.</p>
                                    <p>• Vui lòng đến rạp trước 15 phút để làm thủ tục.</p>
                                    <p>• Mang theo CMND/CCCD để xác thực khi lấy vé.</p>
                                </>
                            )}
                            {heroState === "pending" && (
                                <>
                                    <p>• Hệ thống sẽ tự động cập nhật khi thanh toán hoàn tất.</p>
                                    <p>• Nếu bạn đã bị trừ tiền, giao dịch sẽ được đồng bộ trong vài phút.</p>
                                    <p>• Liên hệ hotline: 1900-xxx-xxx nếu cần hỗ trợ khẩn.</p>
                                </>
                            )}
                            {heroState === "failed" && (
                                <>
                                    <p>• Giao dịch chưa thành công nên vé chưa được phát hành.</p>
                                    <p>• Nếu tiền đã trừ, vui lòng giữ lại hóa đơn và liên hệ hỗ trợ.</p>
                                    <p>• Bạn có thể thử thanh toán lại hoặc chọn phương thức khác.</p>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const BookingCompletePage = () => {
    return (
        <Suspense fallback={<div className="py-8 px-4 lg:px-8 min-h-screen">Đang tải thông tin đặt vé...</div>}>
            <BookingCompleteContent/>
        </Suspense>
    );
};

export default BookingCompletePage;
