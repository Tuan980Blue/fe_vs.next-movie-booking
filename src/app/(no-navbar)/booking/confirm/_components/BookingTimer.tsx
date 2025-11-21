"use client"

import { useMemo } from 'react';

interface BookingTimerProps {
    timeLeft: number;
    bookingCode?: string;
}

export default function BookingTimer({ timeLeft, bookingCode }: BookingTimerProps) {
    const formattedTime = useMemo(() => {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }, [timeLeft]);

    return (
        <div className="px-6 py-5 border-b border-neutral-lightGray/30 bg-primary-pink text-white">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide">Thông tin vé</p>
                    {bookingCode && <p className="text-xs text-white/90 mt-0.5">Mã giữ chỗ: {bookingCode}</p>}
                </div>
                <div className="text-right">
                    <p className="text-xs text-white/90">Thời gian còn lại</p>
                    <p className="text-2xl font-bold">{formattedTime}</p>
                </div>
            </div>
        </div>
    );
}

