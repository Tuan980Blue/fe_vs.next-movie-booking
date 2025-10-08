"use client"

import {useEffect, useMemo, useState} from "react";
import SeatSelectionSkeleton from "@/app/(site)/booking/seat-selection/_components/SeatSelectionSkeleton";
import {getSeatLayoutApi} from "@/service";
import {useAuth} from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import type { SeatLayoutUi, SeatUi, SeatLegendItem } from "@/models/seat";

interface ShowtimeMini {
    id: string | null;
    cinemaId: string | null;
    roomId: string | null;
    startUtc: string | null;
    endUtc?: string | null;
    movieTitle?: string | null;
    roomName?: string | null;
    auditoriumName?: string | null;
    cinemaName?: string | null;
    basePriceMinor?: string | null;
    format?: string | null;
    subtitle?: string | null;
}

const SeatSelectionPage = () => {
    const search = useSearchParams();
    const router = useRouter();
    const showtime: ShowtimeMini = {
        id: search.get('showtimeId'),
        cinemaId: search.get('cinemaId'),
        roomId: search.get('roomId'),
        startUtc: search.get('startUtc'),
        endUtc: search.get('endUtc'),
        movieTitle: search.get('movieTitle'),
        roomName: search.get('roomName'),
        auditoriumName: search.get('auditoriumName'),
        cinemaName: search.get('cinemaName'),
        basePriceMinor: search.get('basePriceMinor'),
        format: search.get('format'),
        subtitle: search.get('subtitle'),
    };
    const {user, isAuthenticated} = useAuth();
    const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
    const [secondsLeft, setSecondsLeft] = useState<number>(5 * 60);

    const [layout, setLayout] = useState<SeatLayoutUi | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Nếu không có state (reload trang trực tiếp), điều hướng ngược lại bằng effect
    useEffect(() => {
        if (!showtime || !showtime.cinemaId || !showtime.roomId) {
            router.back();
        }
    }, [showtime, router]);

    useEffect(() => {
        let ignore = false;

        async function fetchLayout() {
            if (!showtime || !showtime.cinemaId || !showtime.roomId) return;
            try {
                setLoading(true);
                setError('');
                const data = await getSeatLayoutApi(showtime.cinemaId, showtime.roomId);
                if (!ignore) setLayout(data as SeatLayoutUi);
            } catch (e: unknown) {
                if (!ignore) setError(e instanceof Error ? e.message : 'Không thể tải sơ đồ ghế');
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        fetchLayout();
        return () => {
            ignore = true;
        };
    }, [showtime]);

    const seatLegend = useMemo<SeatLegendItem[]>(() => layout?.seatTypes || [], [layout]);

    // Simple countdown 5 minutes for seat selection
    useEffect(() => {
        const t = setInterval(() => {
            setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    const formatVnd = (amount: number) =>
        (amount || 0).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});

    const toDate = (v?: string | null) => (v ? new Date(v) : null);

    const basePrice = Number(showtime?.basePriceMinor || 0);
    const totalPrice = basePrice * selectedSeatIds.length;

    const isSelected = (id: string) => selectedSeatIds.includes(id);
    const getSeatName = (seat: SeatUi) => `${seat.rowLabel}${String(seat.seatNumber).padStart(2, '0')}`;
    const getRowSeats = (rowLabel: string): SeatUi[] => layout?.rows.find(r => r.rowLabel === rowLabel)?.seats || [];
    const isSeatActive = (seat: SeatUi) => seat?.isActive !== false;
    const getSeatColorByType = (type: string | number) => {
        const item = seatLegend.find(t => t.type.toLowerCase() === String(type || '').toLowerCase());
        return item?.color || '#9CA3AF';
    };

    const violatesSingleGapRule = (rowLabel: string, nextSelectedIds: string[]) => {
        // Only apply gap rule to non-couple seats
        const seats = getRowSeats(rowLabel)
            .filter(isSeatActive)
            .filter((s) => String(s.seatType).toLowerCase() !== 'couple');
        if (seats.length === 0) return false;
        const selectedNums = seats.filter(s => nextSelectedIds.includes(s.id)).map(s => s.seatNumber).sort((a, b) => a - b);
        if (selectedNums.length === 0) return false;
        const allNums = seats.map(s => s.seatNumber).sort((a, b) => a - b);
        const minNum = Math.min(...selectedNums);
        const maxNum = Math.max(...selectedNums);
        const minAll = allNums[0];
        const maxAll = allNums[allNums.length - 1];
        // Edge single gap at start
        if (minNum - minAll === 2 && allNums.includes(minNum - 1)) return true;
        // Edge single gap at end
        if (maxAll - maxNum === 2 && allNums.includes(maxNum + 1)) return true;
        // Internal single holes
        for (let i = 0; i < selectedNums.length - 1; i++) {
            const a = selectedNums[i];
            const b = selectedNums[i + 1];
            if (b - a === 2) {
                const mid = a + 1;
                if (allNums.includes(mid)) return true;
            }
        }
        return false;
    };

    const toggleSeat = (seat: SeatUi) => {
        // Only allow active seats (layout isActive flag)
        if (!isSeatActive(seat)) return;

        setSelectedSeatIds((cur) => {
            let next = cur.includes(seat.id) ? cur.filter((x) => x !== seat.id) : [...cur, seat.id];

            // Couple rule: only auto-pair if the pair is physically adjacent (<= 50px apart)
            if (String(seat.seatType).toLowerCase() === 'couple') {
                const unit = 50;
                const rowSeats = getRowSeats(seat.rowLabel).filter(
                    (s) => String(s.seatType).toLowerCase() === 'couple'
                );
                const pair = rowSeats.find(
                    (s) =>
                        Math.abs(s.seatNumber - seat.seatNumber) === 1 &&
                        Math.abs((s.positionX ?? 0) - (seat.positionX ?? 0)) <= unit
                );
                if (pair && isSeatActive(pair)) {
                    const bothSelected = next.includes(seat.id) && next.includes(pair.id);
                    if (!bothSelected) {
                        next = Array.from(new Set([...next, seat.id, pair.id]));
                    }
                }
            }

            // Single-seat gap rule check within the seat row
            if (violatesSingleGapRule(seat.rowLabel, next)) {
                // revert change
                return cur;
            }

            return next;
        });
    };

    if (!showtime) {
        return <div className="min-h-screen py-16 px-4 lg:px-8 text-neutral-white">Đang chuyển hướng...</div>;
    }

    return (
        <div className="py-6 px-4 lg:px-8 h-full bg-neutral-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-6">
                {/* Left: Seat map */}
                <div className="lg:col-span-2 p-6">
                    {/* infor movie & showtime ,... */}
                    <div className="mb-5 px-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 min-w-0">
                                <div
                                    className="hidden sm:block w-14 h-20 rounded-lg overflow-hidden bg-neutral-lightGray/60 ring-1 ring-neutral-lightGray/60 shrink-0">
                                    <div
                                        className="w-full h-full flex items-center justify-center text-neutral-darkGray font-semibold">
                                        {showtime?.movieTitle?.[0] || 'M'}
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <div
                                        className="text-lg lg:text-xl font-bold text-neutral-darkGray truncate">{showtime.movieTitle}</div>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                                        {showtime?.format && (
                                            <span
                                                className="px-2 py-0.5 rounded-full bg-primary-pink/10 text-primary-pink ring-1 ring-primary-pink/20">
                        {showtime.format}
                      </span>
                                        )}
                                        {showtime?.subtitle && (
                                            <span
                                                className="px-2 py-0.5 rounded-full bg-gray-100 ring-1 ring-neutral-lightGray/70 text-neutral-darkGray">
                        Phụ đề
                      </span>
                                        )}
                                    </div>
                                    <div>
                                        <span
                                            className="font-light italic">Thời gian:</span> {toDate(showtime.startUtc)?.toLocaleDateString('vi-VN', {
                                        weekday: 'short',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })} • {toDate(showtime.startUtc)?.toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })} - {toDate(showtime.endUtc)?.toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 flex flex-col items-end">
                                <div className={"flex flex-col justify-center items-center"}>
                                    <div className="text-xs text-neutral-darkGray mb-1">Giữ chỗ còn</div>
                                    <div
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-pink/10 ring-1 ring-primary-pink/20">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg" className="text-primary-pink">
                                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <span
                                            className="text-primary-pink font-semibold text-lg tabular-nums">{minutes}:{seconds}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!loading && error && (
                        <div className="text-accent-red mb-4">{error}</div>
                    )}
                    {loading && <SeatSelectionSkeleton/>}

                    {/*Màn hình và các thông tin liên quan đến chỗ ngồi*/}
                    {!loading && !error && layout && (
                        <div className="grid grid-cols-7 gap-2 lg:gap-6">
                            {/* Legend - left sidebar */}
                            <div className="col-span-2">
                                <div className="rounded-xl border border-neutral-lightGray/60 p-4">
                                    <div className="text-sm font-semibold text-neutral-darkGray mb-3">Chú thích</div>
                                    <div className="space-y-3 text-sm text-neutral-darkGray">
                                        <div className="flex items-center gap-3"><span
                                            className="w-5 h-5 rounded bg-gray-400 inline-block"/>Ghế có thể đặt
                                        </div>
                                        <div className="flex items-center gap-3"><span
                                            className="w-5 h-5 rounded bg-yellow-400 inline-block"/>Ghế đang chọn
                                        </div>
                                        <div className="flex items-center gap-3"><span
                                            className="w-5 h-5 rounded bg-green-500 inline-block"/>Ghế đang có người
                                            chọn
                                        </div>
                                        <div className="flex items-center gap-3"><span
                                            className="w-5 h-5 rounded bg-red-500 inline-block"/>Ghế đã có người đặt
                                        </div>
                                        <div className="flex items-center gap-3"><span
                                            className="w-5 h-5 rounded bg-purple-600 inline-block"/>Ghế không thể đặt
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Screen + seat grid */}
                            <div className="col-span-5">
                                <div className="max-w-fit">
                                    <div className="w-full flex justify-center">
                                        <div className="mx-auto inline-block">
                                            {/* Screen */}
                                            <div className="mb-2">
                                                <div className="h-2 w-full ml-4 bg-neutral-lightGray rounded-full"/>
                                                <div
                                                    className="mt-2 text-center italic text-sm font-medium text-neutral-darkGray">Màn
                                                    hình
                                                </div>
                                            </div>

                                            {/* Seat grid */}
                                            <div className="space-y-3 overflow-x-auto p-2">
                                                {layout.rows.map(row => {
                                                    // Sort by positionX to respect layout coordinates
                                                    const sorted = [...row.seats].sort((a, b) => (a.positionX ?? 0) - (b.positionX ?? 0));

                                                    const unit = 50; // base grid step from data
                                                    let cursorX = 0;

                                                    return (
                                                        <div key={row.rowLabel} className="flex items-center gap-2">
                                                            <div
                                                                className="w-6 text-xs text-neutral-darkGray text-right">{row.rowLabel}</div>
                                                            <div className="flex flex-nowrap items-center"
                                                                 style={{gap: 4}}>
                                                                {sorted.map((s, idx) => {
                                                                    const parts = [];
                                                                    const startX = s.positionX ?? 0;
                                                                    if (startX > cursorX) {
                                                                        const spacerWidth = Math.max(0, startX - cursorX);
                                                                        parts.push(
                                                                            <div
                                                                                key={`spacer-${row.rowLabel}-${cursorX}`}
                                                                                style={{
                                                                                    width: spacerWidth,
                                                                                    height: 0
                                                                                }}/>
                                                                        );
                                                                        cursorX = startX;
                                                                    }

                                                                    const isCouple = String(s.seatType).toLowerCase() === 'couple';
                                                                    const width = isCouple ? unit * 2 : unit;
                                                                    const selected = isSelected(s.id);
                                                                    const baseColor = getSeatColorByType(s.seatType);
                                                                    const bg = selected ? '#FACC15' : baseColor;
                                                                    const text = selected ? '#1F2937' : '#fff';

                                                                    parts.push(
                                                                        <button
                                                                            key={s.id}
                                                                            type="button"
                                                                            onClick={() => toggleSeat(s)}
                                                                            className="h-8 rounded-md border flex items-center justify-center text-xs focus:outline-none focus:ring-2 focus:ring-primary-pink/40"
                                                                            title={`${s.rowLabel}${s.seatNumber} • ${s.seatType}`}
                                                                            aria-label={`${s.rowLabel}${String(s.seatNumber).padStart(2, '0')} ${s.seatType}`}
                                                                            style={{
                                                                                backgroundColor: bg,
                                                                                color: text,
                                                                                width
                                                                            }}
                                                                        >
                                                                            {s.seatNumber}
                                                                        </button>
                                                                    );
                                                                    cursorX += width;

                                                                    return parts;
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Booking summary */}
                <div className="lg:sticky lg:top-4 h-fit">
                    <div
                        className="rounded-2xl bg-white/90 backdrop-blur shadow-xl ring-1 ring-neutral-lightGray/60 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-pink to-rose-400 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3V7z"
                                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-base font-semibold">Thông tin đặt vé</span>
                                </div>
                                <span className="text-white/90 text-xl">🎟️</span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-2">
                            {isAuthenticated && (
                                <div
                                    className="mb-4 rounded-xl bg-neutral-lightGray/30 ring-1 ring-neutral-lightGray/60 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-neutral-darkGray">
                                            <div
                                                className="font-medium">{user?.fullName || '-'} - {user?.phone || '-'}</div>
                                            <div className="text-neutral-darkGray/80 italic">{user?.email || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 text-neutral-darkGray">
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-neutral-darkGray/70">Phim</div>
                                    <div
                                        className="mt-1 text-lg lg:text-xl font-bold truncate">{showtime.movieTitle}</div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg" className="text-primary-pink">
                                            <path d="M7 10h10M7 14h7" stroke="currentColor" strokeWidth="1.5"
                                                  strokeLinecap="round"/>
                                            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor"
                                                  strokeWidth="1.5"/>
                                        </svg>
                                        <div>
                                            {toDate(showtime.startUtc)?.toLocaleDateString('vi-VN', {
                                                weekday: 'short',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg" className="text-primary-pink">
                                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                                        </svg>
                                        <div>
                                            {toDate(showtime.startUtc)?.toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })} - {toDate(showtime.endUtc)?.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        </div>
                                    </div>
                                    {(showtime?.roomName || showtime?.auditoriumName || showtime?.cinemaName) && (
                                        <div className="flex items-center gap-2">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg" className="text-primary-pink">
                                                <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z"
                                                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                      strokeLinejoin="round"/>
                                                <circle cx="12" cy="11" r="2.5" stroke="currentColor"
                                                        strokeWidth="1.5"/>
                                            </svg>
                                            <div>{showtime.roomName || showtime.auditoriumName} • {showtime.cinemaName}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-neutral-lightGray/60"/>

                                <div className="text-sm">
                                    <div className="mb-2 font-medium">Ghế đã chọn</div>
                                    {selectedSeatIds.length === 0 ? (
                                        <div className="text-neutral-darkGray/70">Chưa chọn ghế</div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSeatIds.map(id => {
                                                const seat = layout?.rows.flatMap(r => r.seats).find(s => s.id === id);
                                                return (
                                                    <span
                                                        key={id}
                                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary-pink/10 text-primary-pink ring-1 ring-primary-pink/20 text-xs"
                                                    >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 11V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" stroke="currentColor"
                                    strokeWidth="1.5"/>
                              <path d="M5 11h16v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6z" stroke="currentColor"
                                    strokeWidth="1.5"/>
                            </svg>
                                                        {seat ? getSeatName(seat) : id}
                          </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-neutral-lightGray/60"/>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-darkGray/80">Giá vé</span>
                                        <span className="font-medium">{formatVnd(basePrice)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-darkGray/80">Số lượng</span>
                                        <span className="font-medium">{selectedSeatIds.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-lg font-bold">
                                        <span>Tổng</span>
                                        <span className="text-primary-pink">{formatVnd(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / CTA */}
                        <div className="px-6 pb-6">
                            <button
                                type="button"
                                disabled={selectedSeatIds.length === 0}
                                className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all duration-150 shadow-sm ${selectedSeatIds.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-primary-pink to-rose-400 hover:shadow-md hover:brightness-[1.03]'}`}
                            >
                                <span>ĐẶT VÉ</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionPage;
