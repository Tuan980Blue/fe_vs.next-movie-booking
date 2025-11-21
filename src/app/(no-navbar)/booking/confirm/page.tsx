"use client"

import { Suspense, useEffect, useMemo, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getBookingDetailApi, createPaymentApi } from '@/service';
import type { BookingResponseDto } from '@/models/booking';
import { BookingStatus, PaymentProvider } from "@/models";
import { PaymentStatus } from "@/models/payment";
import BookingInfoCard from './_components/BookingInfoCard';
import PaymentSummary from './_components/PaymentSummary';
import ConfirmBookingSkeleton from './_components/ConfirmBookingSkeleton';
import BookingErrorCard from './_components/BookingErrorCard';
import { useBookingCleanup } from './_hooks/useBookingCleanup';
import axios from 'axios';

const ConfirmBookingContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [errorStatusCode, setErrorStatusCode] = useState<number | undefined>(undefined);
    const [booking, setBooking] = useState<BookingResponseDto | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(PaymentProvider.VnPay);
    const [timeLeft, setTimeLeft] = useState<number>(5 * 60);
    const isNavigatingToPayment = useRef<boolean>(false);

    // Load booking data
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
                setErrorStatusCode(undefined);
                const data = await getBookingDetailApi(bookingId);
                if (!ignore) setBooking(data);
            } catch (e: unknown) {
                if (!ignore) {
                    let errorMessage = 'Không thể tải đơn giữ chỗ';
                    let statusCode: number | undefined = undefined;

                    if (axios.isAxiosError(e)) {
                        statusCode = e.response?.status;
                        errorMessage = e.response?.data?.message || e.message || errorMessage;
                    } else if (e instanceof Error) {
                        errorMessage = e.message;
                    }

                    setError(errorMessage);
                    setErrorStatusCode(statusCode);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true; };
    }, [bookingId, router]);

    // Setup cleanup logic
    useBookingCleanup({
        bookingId,
        booking,
        isNavigatingToPayment,
    });

    // Timer countdown
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

    // Helper functions
    const formatVnd = (amount: number) =>
        (amount || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    // Computed values
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
    const loyaltyPoints = 735; // Placeholder – awaiting real loyalty integration

    // Payment handler
    const startPayment = async (provider: PaymentProvider) => {
        if (!booking?.id || submitting) return;

        if (provider !== PaymentProvider.VnPay) {
            setError('Phương thức thanh toán này đang được phát triển. Vui lòng chọn VNPay.');
            return;
        }
        setSubmitting(true);
        setError('');
        
        // Đánh dấu đang navigate đến payment page để không cleanup
        isNavigatingToPayment.current = true;
        
        try {
            const payment = await createPaymentApi({
                bookingId: booking.id,
                provider,
            });
            if (payment?.paymentUrl) {
                // Khi redirect đến payment URL, không cleanup vì đang trong quá trình thanh toán
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
            // Nếu có lỗi, reset flag để có thể cleanup sau
            isNavigatingToPayment.current = false;
            setError(e instanceof Error ? e.message : 'Không thể khởi tạo thanh toán.');
        } finally {
            setSubmitting(false);
        }
    };

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
                {loading && <ConfirmBookingSkeleton />}

                {!loading && error && (
                    <BookingErrorCard
                        error={error}
                        bookingId={bookingId}
                        statusCode={errorStatusCode}
                    />
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
                        <BookingInfoCard
                            bookingCode={booking.code}
                            timeLeft={timeLeft}
                            showtime={showtime ? {
                                movieTitle: showtime.movieTitle,
                                startUtc: showtime.startUtc,
                                roomName: showtime.roomName,
                            } : null}
                            seatNames={seatNames}
                            formattedShowtime={formattedShowtime}
                            customerInfo={customerInfo}
                            items={items}
                            formatVnd={formatVnd}
                        />

                        <PaymentSummary
                            total={total}
                            formatVnd={formatVnd}
                            loyaltyPoints={loyaltyPoints}
                            submitting={submitting}
                            selectedProvider={selectedProvider}
                            onProviderChange={setSelectedProvider}
                            onSubmit={handleSubmit}
                        />
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
