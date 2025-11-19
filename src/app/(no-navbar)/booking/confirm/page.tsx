
"use client"

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getBookingDetailApi, createPaymentApi } from '@/service';
import type { BookingResponseDto } from '@/models/booking';
import { BookingStatus, PaymentProvider } from "@/models";
import { PaymentStatus } from "@/models/payment";

const ConfirmBookingContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [booking, setBooking] = useState<BookingResponseDto | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(PaymentProvider.VnPay);
    const [timeLeft, setTimeLeft] = useState<number>(5 * 60);

    useEffect(() => {
        let ignore = false;
        async function load() {
            if (!bookingId) {
                router.back();
                return;
            }
            try {
                setLoading(true);
                setError('');
                const data = await getBookingDetailApi(bookingId);
                if (!ignore) setBooking(data);
            } catch (e: unknown) {
                if (!ignore) setError(e instanceof Error ? e.message : 'Không thể tải đơn giữ chỗ');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true; };
    }, [bookingId, router]);

    const formatVnd = (amount: number) =>
        (amount || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const items = booking?.items || [];
    const total = useMemo(
        () => booking?.totalAmountMinor || items.reduce((s, it) => s + (it.seatPriceMinor || 0), 0),
        [booking, items]
    );
    const customerInfo = booking?.customerInfo || {
        fullName: booking?.user?.fullName || 'Khách hàng',
        email: booking?.user?.email || '-',
        phone: undefined,
    };
    const seatNames = items
        .map(it => `${it.seat.rowLabel}${String(it.seat.seatNumber).padStart(2, '0')}`)
        .join(', ');
    const showtime = items[0]?.showtime;
    const formattedShowtime = showtime
        ? new Intl.DateTimeFormat('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(showtime.startUtc))
        : '-';
    const formattedHoldTime = useMemo(() => {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }, [timeLeft]);
    const loyaltyPoints = 735; // Placeholder – awaiting real loyalty integration

    const startPayment = async (provider: PaymentProvider) => {
        if (!booking?.id || submitting) return;

        if (provider !== PaymentProvider.VnPay) {
            setError('Phương thức thanh toán này đang được phát triển. Vui lòng chọn VNPay.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            // Backend sẽ xử lý VNPay callback và redirect về /booking/payment/{status}
            // Không cần set returnUrl vì backend đã config sẵn vnp_ReturnUrl trong appsettings.json
            // Nếu muốn set, phải set là backend endpoint: /api/payments/vnpay-return
            const payment = await createPaymentApi({
                bookingId: booking.id,
                provider,
                // returnUrl: không cần set, backend sẽ dùng config vnp_ReturnUrl
            });
            if (payment?.paymentUrl) {
                window.location.href = payment.paymentUrl;
                return;
            }
            const statusPath =
                payment.status === PaymentStatus.Succeeded
                    ? 'success'
                    : payment.status === PaymentStatus.Pending
                        ? 'pending'
                        : 'failed';
            router.push(`/booking/payment/${statusPath}?paymentId=${encodeURIComponent(payment.id)}&bookingId=${encodeURIComponent(booking.id)}`);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Không thể khởi tạo thanh toán.');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (!booking || booking.status !== BookingStatus.Pending) return;
        setTimeLeft(5 * 60);
    }, [booking?.id, booking?.status]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleSubmit = () => {
        if (!selectedProvider) {
            setError('Vui lòng chọn phương thức thanh toán.');
            return;
        }
        startPayment(selectedProvider);
    };

    return (
        <div className="py-8 px-4 lg:px-8 min-h-screen">
            <div className="mx-auto">
                {loading && (
                    <div className="rounded-xl p-4 bg-white/70">Đang tải...</div>
                )}

                {!loading && error && (
                    <motion.div
                        className="rounded-xl p-4 bg-red-50 border border-red-200 text-red-800"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-lg">⚠️</span>
                            <div className="flex-1">
                                <p className="font-medium">{error}</p>
                                {bookingId && (
                                    <Link
                                        href={`/booking/seat-selection?id=${encodeURIComponent(bookingId)}`}
                                        className="text-sm text-red-600 underline mt-2 inline-block"
                                    >
                                        Quay lại chọn ghế
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {!loading && !error && booking && booking.status !== BookingStatus.Pending && (
                    <motion.div
                        className="rounded-xl p-4 bg-amber-50 border border-amber-200 text-amber-800 mb-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-lg">ℹ️</span>
                            <div className="flex-1">
                                <p className="font-medium">
                                    {booking.status === BookingStatus.Confirmed
                                        ? 'Đơn đặt vé này đã được xác nhận.'
                                        : booking.status === BookingStatus.Canceled
                                            ? 'Đơn đặt vé này đã bị hủy.'
                                            : booking.status === BookingStatus.Expired
                                                ? 'Đơn đặt vé này đã hết hạn.'
                                                : 'Đơn đặt vé không còn ở trạng thái chờ thanh toán.'}
                                </p>
                                <Link
                                    href="/user/my-bookings"
                                    className="text-sm text-amber-600 underline mt-2 inline-block"
                                >
                                    Xem lịch sử đặt vé
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!loading && !error && booking && booking.status === BookingStatus.Pending && (
                    <motion.div
                        className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(320px,_1fr)]"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-neutral-lightGray/30 overflow-hidden">
                            <div className="px-6 py-5 border-b border-neutral-lightGray/30 bg-primary-pink text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-wide">Thông tin vé</p>
                                        {booking.code && <p className="text-xs text-white/90 mt-0.5">Mã giữ chỗ: {booking.code}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-white/90">Thời gian còn lại</p>
                                        <p className="text-2xl font-bold">{formattedHoldTime}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-6 space-y-6">
                                <section className="space-y-1">
                                    <p className="text-sm font-semibold text-neutral-darkGray">Thông tin vé</p>
                                    <div className="rounded-xl border border-neutral-lightGray/40 bg-neutral-lightGray/5 p-4 text-sm text-neutral-darkGray space-y-1">
                                        <div className="text-lg font-bold text-neutral-black">{showtime?.movieTitle}</div>
                                        <div>{formattedShowtime}</div>
                                        <div>Phòng chiếu: {showtime?.roomName || '-'}</div>
                                        <div>Ghế đã chọn: <span className="font-semibold">{seatNames || '-'}</span></div>
                                    </div>
                                </section>

                                <section className="space-y-2">
                                    <p className="text-sm font-semibold text-neutral-darkGray">Thông tin đặt vé</p>
                                    <div className="grid gap-3 lg:grid-cols-2 text-sm text-neutral-darkGray">
                                        <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-4">
                                            <p className="text-xs text-neutral-darkGray/70 uppercase tracking-wide">Họ tên</p>
                                            <p className="font-medium">{customerInfo.fullName}</p>
                                        </div>
                                        <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-4">
                                            <p className="text-xs text-neutral-darkGray/70 uppercase tracking-wide">Số điện thoại</p>
                                            <p className="font-medium">{customerInfo.phone || '—'}</p>
                                        </div>
                                        <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-4 lg:col-span-2">
                                            <p className="text-xs text-neutral-darkGray/70 uppercase tracking-wide">Email</p>
                                            <p className="font-medium break-all">{customerInfo.email}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-2">
                                    <p className="text-sm font-semibold text-neutral-darkGray">Chi tiết ghế</p>
                                    <div className="rounded-xl border border-neutral-lightGray/40 divide-y divide-neutral-lightGray/30 overflow-hidden">
                                        {items.map(it => (
                                            <div key={it.id} className="flex flex-col gap-2 md:flex-row md:items-center justify-between px-4 py-3 bg-white text-sm">
                                                <div>
                                                    <p className="font-semibold text-neutral-black">{it.showtime.movieTitle}</p>
                                                    <p className="text-neutral-darkGray/70">{it.showtime.roomName} • {it.showtime.cinemaName}</p>
                                                    <p className="text-neutral-darkGray/70">Ghế: {it.seat.rowLabel}{String(it.seat.seatNumber).padStart(2, '0')}</p>
                                                </div>
                                                <p className="font-semibold text-neutral-black">{formatVnd(it.seatPriceMinor)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-2">
                                    <p className="text-sm font-semibold text-neutral-darkGray">Thông tin combo bắp nước</p>
                                    <div className="rounded-xl border border-dashed border-neutral-lightGray/70 bg-neutral-lightGray/10 p-4 text-sm text-neutral-darkGray/80">
                                        Hiện chưa thêm combo bắp nước. Bạn có thể quay lại bước trước để chọn thêm.
                                    </div>
                                </section>

                                <section className="space-y-2">
                                    <p className="text-sm font-semibold text-neutral-darkGray">Lưu ý</p>
                                    <ul className="list-disc pl-6 text-sm text-neutral-darkGray/90 space-y-1">
                                        <li>Vé đã mua không thể đổi hoặc trả lại.</li>
                                        <li>Khi cần, vui lòng xuất trình giấy tờ tùy thân để kiểm tra độ tuổi.</li>
                                        <li>Chỉ cần lưu lại mã giữ chỗ hoặc email xác nhận để soát vé.</li>
                                        <li>Nếu có combo online bạn sẽ được ưu tiên xếp hàng ở quầy bắp nước.</li>
                                    </ul>
                                </section>
                            </div>
                        </div>

                        <aside className="lg:sticky lg:top-22 rounded-2xl bg-white shadow-xl ring-1 ring-neutral-lightGray/30 overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                                <button
                                    type="button"
                                    className="w-full rounded-xl bg-primary-pink text-white text-sm font-semibold py-3 transition-colors hover:bg-primary-pink/90"
                                >
                                    Sử dụng Coupon hoặc Voucher
                                </button>

                                <div className="text-right text-neutral-darkGray">
                                    <p className="text-sm">Tổng cộng</p>
                                    <p className="text-3xl font-bold text-primary-pink">{formatVnd(total)}</p>
                                    <p className="text-xs text-neutral-darkGray/70">Vé ghế: {formatVnd(total)}</p>
                                </div>

                                <div className="rounded-xl border border-neutral-lightGray/40 p-4 text-sm text-neutral-darkGray space-y-1">
                                    <p className="font-semibold text-primary-pink">★ Dùng điểm để đổi vé và bắp nước</p>
                                    <p>Bạn đang có <span className="font-semibold">{loyaltyPoints}</span> điểm.</p>
                                    <p className="text-neutral-darkGray/70">Bạn chưa chọn quà đổi</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-neutral-darkGray">Chọn phương thức thanh toán</p>
                                    <div className="space-y-2">
                                        <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${selectedProvider === PaymentProvider.VnPay ? 'border-primary-pink bg-primary-pink/5' : 'border-neutral-lightGray/60'}`}>
                                            <input
                                                type="radio"
                                                name="payment-provider"
                                                value="vnpay"
                                                checked={selectedProvider === PaymentProvider.VnPay}
                                                onChange={() => setSelectedProvider(PaymentProvider.VnPay)}
                                                className="accent-primary-pink"
                                            />
                                            <div>
                                                <p className="font-medium text-neutral-darkGray">Thanh toán qua VNPay</p>
                                                <p className="text-xs text-neutral-darkGray/70">Thẻ nội địa / Thẻ quốc tế / QR code</p>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 rounded-xl border border-neutral-lightGray/60 bg-neutral-lightGray/10 px-4 py-3 text-sm opacity-60">
                                            <input type="radio" disabled className="accent-neutral-lightGray"/>
                                            <div>
                                                <p className="font-medium text-neutral-darkGray">Ví điện tử MoMo</p>
                                                <p className="text-xs text-neutral-darkGray/70">Sắp ra mắt</p>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 rounded-xl border border-neutral-lightGray/60 bg-neutral-lightGray/10 px-4 py-3 text-sm opacity-60">
                                            <input type="radio" disabled className="accent-neutral-lightGray"/>
                                            <div>
                                                <p className="font-medium text-neutral-darkGray">Ví ShopeePay</p>
                                                <p className="text-xs text-neutral-darkGray/70">Sắp ra mắt</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-neutral-lightGray/60 bg-neutral-lightGray/10 p-4 text-xs text-neutral-darkGray/80 space-y-1">
                                    <p className="font-semibold text-neutral-darkGray">Điều khoản thanh toán trực tuyến</p>
                                    <p>Vui lòng kiểm tra kỹ thông tin đặt vé trước khi thanh toán.</p>
                                    <p>Không hoàn tiền cho các đơn đã thanh toán thành công.</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 p-4 md:p-6 border-t border-neutral-lightGray/40 bg-white">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                    className={`w-full rounded-xl py-3 text-center text-white text-sm font-semibold transition ${
                                        submitting ? 'bg-neutral-lightGray cursor-not-allowed' : 'bg-primary-pink hover:bg-primary-pink/90'
                                    }`}
                                >
                                    {submitting ? 'Đang xử lý...' : 'Thanh toán'}
                                </button>
                            </div>
                        </aside>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const ConfirmBookingPage = () => {
    return (
        <Suspense fallback={<div className="py-8 px-4 lg:px-8 min-h-screen">Đang tải thông tin đặt vé...</div>}>
            <ConfirmBookingContent/>
        </Suspense>
    );
};

export default ConfirmBookingPage; 