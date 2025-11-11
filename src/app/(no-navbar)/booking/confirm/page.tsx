
"use client"

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getBookingDetailApi, createPaymentApi } from '@/service';
import type { BookingResponseDto } from '@/models/booking';
import {PaymentProvider} from "@/models";

const ConfirmBookingContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [booking, setBooking] = useState<BookingResponseDto | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

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
    const total = useMemo(() => booking?.totalAmountMinor || items.reduce((s, it) => s + (it.seatPriceMinor || 0), 0), [booking, items]);

    const startPayment = async (provider: PaymentProvider) => {
        if (!booking?.id || submitting) return;
        setSubmitting(true);
        setError('');
        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            const returnUrl = `${origin}/booking/complete?bookingId=${encodeURIComponent(booking.id)}`;
            const payment = await createPaymentApi({
                bookingId: booking.id,
                provider,
                returnUrl,
            });
            if (payment?.paymentUrl) {
                window.location.href = payment.paymentUrl;
                return;
            }
            router.push(`/booking/complete?bookingId=${encodeURIComponent(booking.id)}&paymentId=${encodeURIComponent(payment.id)}`);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Không thể khởi tạo thanh toán.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="py-8 px-4 lg:px-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-darkGray">Xác nhận đặt vé</h1>
                    {booking?.code && (
                        <p className="text-sm text-neutral-darkGray/70 mt-1">Mã giữ chỗ: {booking.code}</p>
                    )}
                </div>

                {loading && (
                    <div className="rounded-xl p-4 bg-white/70">Đang tải...</div>
                )}

                {!loading && error && (
                    <div className="rounded-xl p-4 bg-red-50 text-red-600">{error}</div>
                )}

                {!loading && !error && booking && (
                    <motion.div
                        className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="px-6 py-5 border-b border-neutral-lightGray/40 bg-gradient-to-r from-primary-pink to-pink-400 text-white">
                            <div className="flex items-center justify-between">
                                <div className="font-bold">Thông tin vé</div>
                                <div className="text-sm">Tổng: {formatVnd(total)}</div>
                            </div>
                        </div>

                        <div className="px-6 py-5 space-y-6">
                            <div className="space-y-2">
                                <div className="font-medium text-neutral-darkGray">Chi tiết ghế</div>
                                <div className="rounded-lg ring-1 ring-neutral-lightGray/50 divide-y divide-neutral-lightGray/40 overflow-hidden">
                                    {items.map(it => (
                                        <div key={it.id} className="flex items-center justify-between px-4 py-3 bg-white">
                                            <div className="text-sm text-neutral-darkGray">
                                                <div className="font-medium">{it.showtime.movieTitle}</div>
                                                <div className="text-neutral-darkGray/70">
                                                    {it.showtime.roomName} • {it.showtime.cinemaName}
                                                </div>
                                                <div className="text-neutral-darkGray/70">
                                                    Ghế: {it.seat.rowLabel}{String(it.seat.seatNumber).padStart(2, '0')}
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold">{formatVnd(it.seatPriceMinor)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-neutral-darkGray">
                                <span className="text-sm">Tạm tính</span>
                                <span className="font-semibold">{formatVnd(total)}</span>
                            </div>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div className="text-sm text-neutral-darkGray/80">Chọn phương thức thanh toán</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => startPayment(PaymentProvider.VnPay)}
                                    className={`px-4 py-3 rounded-lg ring-1 ring-neutral-lightGray/60 bg-white hover:bg-neutral-lightGray/20 text-sm font-medium ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    VNPay
                                </button>
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => startPayment(PaymentProvider.MoMo)}
                                    className={`px-4 py-3 rounded-lg ring-1 ring-neutral-lightGray/60 bg-white hover:bg-neutral-lightGray/20 text-sm font-medium ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    MoMo
                                </button>
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => startPayment(PaymentProvider.Stripe)}
                                    className={`px-4 py-3 rounded-lg ring-1 ring-neutral-lightGray/60 bg-white hover:bg-neutral-lightGray/20 text-sm font-medium ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    Thẻ quốc tế (Stripe)
                                </button>
                            </div>
                        </div>

                        {/* Payment actions are above; no separate CTA needed */}
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