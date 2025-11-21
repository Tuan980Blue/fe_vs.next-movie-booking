"use client"

import { useEffect, useRef, useCallback } from 'react';
import { cancelBookingApi } from '@/service';
import type { BookingResponseDto } from '@/models/booking';
import { BookingStatus } from "@/models";

interface UseBookingCleanupProps {
    bookingId: string | null;
    booking: BookingResponseDto | null;
    isNavigatingToPayment: React.MutableRefObject<boolean>;
}

export function useBookingCleanup({
    bookingId,
    booking,
    isNavigatingToPayment,
}: UseBookingCleanupProps) {
    const hasCleanedUp = useRef<boolean>(false);

    const cleanupBookingDraft = useCallback(async () => {
        // Chỉ cleanup nếu:
        // 1. Chưa cleanup trước đó
        // 2. Có bookingId
        // 3. Booking status là Pending (draft)
        // 4. Không phải đang navigate đến payment page
        if (
            hasCleanedUp.current ||
            !bookingId ||
            !booking ||
            booking.status !== BookingStatus.Pending ||
            isNavigatingToPayment.current
        ) {
            return;
        }

        hasCleanedUp.current = true;
        
        try {
            // Gọi API cancel booking draft (sẽ unlock ghế và xóa draft)
            await cancelBookingApi(bookingId, { reason: 'Người dùng rời khỏi trang xác nhận' });
            console.log('✅ Đã cleanup booking draft khi user rời trang');
        } catch (error) {
            // Log error nhưng không throw để không ảnh hưởng đến UX
            console.warn('⚠️ Không thể cleanup booking draft:', error);
        }
    }, [bookingId, booking?.status, isNavigatingToPayment]);

    // Cleanup khi component unmount (user navigate away)
    useEffect(() => {
        return () => {
            // Gọi async function nhưng không await (vì cleanup function không thể async)
            cleanupBookingDraft().catch(() => {
                // Ignore errors khi component đang unmount
            });
        };
    }, [cleanupBookingDraft]);

    // Cleanup khi browser/tab close
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // Chỉ cleanup nếu booking là draft và chưa navigate đến payment
            if (
                bookingId &&
                booking &&
                booking.status === BookingStatus.Pending &&
                !isNavigatingToPayment.current &&
                !hasCleanedUp.current
            ) {
                // Sử dụng fetch với keepalive flag để đảm bảo request được gửi ngay cả khi page đang unload
                const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                if (accessToken) {
                    fetch(`/api/bookings/${bookingId}/cancel`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({ reason: 'Người dùng đóng tab/trình duyệt' }),
                        keepalive: true, // Đảm bảo request được gửi ngay cả khi page unload
                    }).catch(() => {
                        // Ignore errors khi page đang unload
                    });
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [bookingId, booking?.status, isNavigatingToPayment]);
}

