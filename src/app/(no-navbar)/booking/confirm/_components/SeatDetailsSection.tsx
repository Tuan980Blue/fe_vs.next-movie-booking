"use client"

import type { BookingItemResponseDto } from '@/models/booking';

interface SeatDetailsSectionProps {
    items: BookingItemResponseDto[];
    formatVnd: (amount: number) => string;
}

export default function SeatDetailsSection({ items, formatVnd }: SeatDetailsSectionProps) {
    return (
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
    );
}

