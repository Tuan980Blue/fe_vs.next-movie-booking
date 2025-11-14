"use client"

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SeatSelectionSkeleton from "@/app/(no-navbar)/booking/seat-selection/_components/SeatSelectionSkeleton";
import { getSeatLayoutApi, getShowtimeByIdApi } from "@/service";
import { useAuth } from "@/providers/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import type { SeatLayoutUi, SeatUi, SeatLegendItem } from "@/models/seat";
import type { ShowtimeReadDto } from "@/models/showtime";
import { useSignalRGroup } from "@/hooks/useSignalRGroup";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import { toggleSeatId, clearSelectedSeatIds } from "@/store/slices/seatSelection/seatSelectionSlice";
import { getLockedSeatsApi } from "@/service";
import { createBookingApi } from "@/service";

const SeatSelectionContent = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const showtimeId = searchParams.get('id');

    const { user, isAuthenticated } = useAuth();
    const dispatch = useDispatch();
    const selectedSeatIds = useSelector((s: RootState) => s.seatSelection.selectedSeatIds);
    const INITIAL_HOLD_SECONDS = 3 * 60;
    const [secondsLeft, setSecondsLeft] = useState<number>(INITIAL_HOLD_SECONDS);

    const [showtime, setShowtime] = useState<ShowtimeReadDto | null>(null);
    const [layout, setLayout] = useState<SeatLayoutUi | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    // Realtime lock/booked state
    const [lockedSeatIds, setLockedSeatIds] = useState<Set<string>>(new Set());
    const [bookedSeatIds, setBookedSeatIds] = useState<Set<string>>(new Set());

    //Join group
    type SeatLockEvent = {
        action: "lock" | "unlock" | "booked" | "extend";
        lockedSeatIds?: string[];
        unlockedSeatIds?: string[];
        bookedSeatIds?: string[];
        expiresAt?: string;
    };

    useSignalRGroup<SeatLockEvent>(
        `showtime-${showtimeId}`,
        "SeatsLockUpdated",
        (data) => {
            switch (data.action) {
                case "lock":
                case "extend":
                    if (data.lockedSeatIds?.length) {
                        setLockedSeatIds(prev => {
                            const next = new Set(prev);
                            data.lockedSeatIds!.forEach(id => next.add(id));
                            return next;
                        });
                    }
                    break;
                case "unlock":
                    if (data.unlockedSeatIds?.length) {
                        setLockedSeatIds(prev => {
                            const next = new Set(prev);
                            data.unlockedSeatIds!.forEach(id => next.delete(id));
                            return next;
                        });
                    }
                    break;
                case "booked":
                    if (data.bookedSeatIds?.length) {
                        setBookedSeatIds(prev => {
                            const next = new Set(prev);
                            data.bookedSeatIds!.forEach(id => next.add(id));
                            return next;
                        });
                    }
                    break;
                default:
                    console.warn("⚠️ Nhận Action không xác định:", data);
                    break;
            }
        }
    );

    // Reset realtime sets when showtime changes
    useEffect(() => {
        setLockedSeatIds(new Set());
        setBookedSeatIds(new Set());
        setSecondsLeft(INITIAL_HOLD_SECONDS);
    }, [showtimeId, INITIAL_HOLD_SECONDS]);

    // Fetch showtime data by ID
    useEffect(() => {
        let ignore = false;

        async function fetchShowtime() {
            if (!showtimeId) {
                router.back();
                return;
            }
            try {
                setLoading(true);
                setError('');
                const data = await getShowtimeByIdApi(showtimeId);
                if (!ignore) {
                    setShowtime(data);
                }
            } catch (e: unknown) {
                if (!ignore) {
                    setError(e instanceof Error ? e.message : 'Không thể tải thông tin suất chiếu');
                    router.back();
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        fetchShowtime();
        return () => {
            ignore = true;
        };
    }, [showtimeId, router]);

    // Fetch seat layout after showtime is loaded
    useEffect(() => {
        let ignore = false;

        async function fetchLayout() {
            if (!showtime?.cinemaId || !showtime?.roomId) return;
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
    }, [showtime?.cinemaId, showtime?.roomId]);

    // Initial fetch locked seats state for the showtime
    useEffect(() => {
        let ignore = false;
        async function fetchLocked() {
            if (!showtimeId) return;
            try {
                const data = await getLockedSeatsApi(showtimeId);
                if (!ignore && data?.lockedSeatIds?.length) {
                    setLockedSeatIds(new Set(data.lockedSeatIds));
                }
            } catch {
                // ignore initial fetch errors
            }
        }
        fetchLocked();
        return () => {
            ignore = true;
        };
    }, [showtimeId]);

    const seatLegend = useMemo<SeatLegendItem[]>(() => layout?.seatTypes || [], [layout]);

    // Simple countdown 5 minutes for seat selection
    useEffect(() => {
        const t = setInterval(() => {
            setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(t);
    }, []);

    // Clear selection when timer runs out
    useEffect(() => {
        if (secondsLeft === 0 && selectedSeatIds.length > 0) {
            dispatch(clearSelectedSeatIds());
        }
    }, [secondsLeft, selectedSeatIds.length, dispatch]);

    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    const formatVnd = (amount: number) =>
        (amount || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const toDate = (v?: string | null) => (v ? new Date(v) : null);

    const basePrice = Number(showtime?.basePriceMinor || 0);
    const totalPrice = basePrice * selectedSeatIds.length;

    const isSelected = (id: string) => selectedSeatIds.includes(id);
    const getSeatName = (seat: SeatUi) => `${seat.rowLabel}${String(seat.seatNumber).padStart(2, '0')}`;
    const getRowSeats = (rowLabel: string): SeatUi[] => layout?.rows.find(r => r.rowLabel === rowLabel)?.seats || [];
    const isSeatActive = (seat: SeatUi) => seat?.isActive !== false;
    const isLockedByOthers = (id: string) => lockedSeatIds.has(id);
    const isBooked = (id: string) => bookedSeatIds.has(id);
    const getSeatColorByType = (type: string | number) => {
        const item = seatLegend.find(t => t.type.toLowerCase() === String(type || '').toLowerCase());
        return item?.color || '#9CA3AF';
    };

    const violatesSingleGapRule = (rowLabel: string, nextSelectedIds: string[]) => {
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
        if (minNum - minAll === 2 && allNums.includes(minNum - 1)) return true;
        if (maxAll - maxNum === 2 && allNums.includes(maxNum + 1)) return true;
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
        if (!isSeatActive(seat)) return;
        if (isBooked(seat.id) || isLockedByOthers(seat.id)) return;
        const next = isSelected(seat.id)
            ? selectedSeatIds.filter(x => x !== seat.id)
            : [...selectedSeatIds, seat.id];
        const isCoupleSeat = String(seat.seatType).toLowerCase() === 'couple';
        if (!isCoupleSeat && violatesSingleGapRule(seat.rowLabel, next)) {
            return;
        }
        dispatch(toggleSeatId(seat.id));
    };

    const goToConfirm = async () => {
        if (!showtimeId || selectedSeatIds.length === 0 || actionLoading) return;
        setActionLoading(true);
        setError('');
        try {
            const draft = await createBookingApi({
                showtimeId,
                seatIds: selectedSeatIds,
            });
            const bookingId = draft?.id;
            if (bookingId) {
                router.push(`/booking/confirm?bookingId=${encodeURIComponent(bookingId)}`);
            } else {
                // fallback to showtime-based confirm
                router.push(`/booking/confirm?id=${encodeURIComponent(showtimeId)}`);
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Không thể tạo đơn giữ chỗ. Vui lòng thử lại.');
        } finally {
            setActionLoading(false);
        }
    };

    if (!showtime && loading) {
        return <SeatSelectionSkeleton />;
    }

    if (!showtime && !loading) {
        return <div className="min-h-screen py-16 px-4 lg:px-8 text-neutral-white">Đang chuyển hướng...</div>;
    }

    return (
        <div className="py-8 px-4 lg:px-8 min-h-screen">
            {loading && <SeatSelectionSkeleton />}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-end text-xs text-gray-800/80 font-medium gap-2">
                        <span>Giữ chỗ còn</span>
                        <motion.div
                            className={`inline-flex items-center ${secondsLeft <= 60 ? 'text-red-500' : secondsLeft <= 120 ? 'text-amber-500' : 'text-pink-500'}`}
                            animate={secondsLeft <= 60 ? { scale: [1, 1.1, 1] } : { scale: [1, 1.05, 1] }}
                            transition={{ duration: secondsLeft <= 60 ? 1 : 2, repeat: Infinity }}
                        >
                            <span className={`font-bold text-lg tabular-nums ${secondsLeft <= 60 ? 'text-red-500' : secondsLeft <= 120 ? 'text-amber-500' : 'text-pink-500'}`}>
                                {minutes}:{seconds}
                            </span>
                        </motion.div>
                    </div>
                    {secondsLeft <= 60 && secondsLeft > 0 && (
                        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
                            ⚠️ Thời gian giữ chỗ sắp hết! Vui lòng hoàn tất đặt vé trong {secondsLeft} giây.
                        </div>
                    )}

                    {!loading && error && (
                        <motion.div
                            className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-lg">⚠️</span>
                                <div className="flex-1">
                                    <p className="font-medium">{error}</p>
                                    <p className="text-sm text-red-600 mt-1">Vui lòng thử lại hoặc chọn ghế khác.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {!loading && !error && layout && (
                        <motion.div
                            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                <div className="lg:col-span-1">
                                    <motion.div
                                        className="bg-gradient-to-br from-neutral-lightGray/10 to-neutral-lightGray/5 rounded-xl p-4 border border-neutral-lightGray/20"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div
                                            className="text-sm font-bold text-neutral-darkGray mb-4 flex items-center gap-2">
                                            <span className="text-lg">🎫</span>
                                            Chú thích ghế
                                        </div>
                                        <div className="space-y-3 text-sm text-neutral-darkGray">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="w-6 h-6 rounded-md bg-neutral-lightGray border border-neutral-lightGray/50 inline-block" />
                                                <span>Ghế có thể đặt</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="w-6 h-6 rounded-md bg-accent-yellow border border-accent-yellow/50 inline-block" />
                                                <span>Ghế đang chọn</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="w-6 h-6 rounded-md bg-green-500 border border-green-500/50 inline-block" />
                                                <span>Ghế đang có người chọn</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="w-6 h-6 rounded-md bg-accent-red border border-accent-red/50 inline-block" />
                                                <span>Ghế đã có người đặt</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="w-6 h-6 rounded-md bg-neutral-darkGray border border-neutral-darkGray/50 inline-block" />
                                                <span>Ghế không thể đặt</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="lg:col-span-3">
                                    <div className="flex justify-center">
                                        <div className="max-w-full">
                                            <motion.div
                                                className="mb-2 text-center"
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <div className="relative">
                                                    <div
                                                        className="h-3 w-full bg-gradient-to-r from-neutral-lightGray to-neutral-lightGray/60 rounded-full shadow-lg" />
                                                    <div
                                                        className="absolute inset-0 h-3 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                                                </div>
                                                <div className="mt-3 text-center">
                                                    <span
                                                        className="text-lg font-bold text-neutral-darkGray">🎬 MÀN HÌNH</span>
                                                </div>
                                            </motion.div>

                                            <div
                                                className="space-y-4 overflow-x-auto p-4 bg-gradient-to-br from-neutral-lightGray/5 to-neutral-lightGray/10 rounded-xl">
                                                {layout.rows.map((row, rowIndex) => {
                                                    const sorted = [...row.seats].sort((a, b) => (a.positionX ?? 0) - (b.positionX ?? 0));
                                                    const unit = 50;
                                                    let cursorX = 0;

                                                    return (
                                                        <motion.div
                                                            key={row.rowLabel}
                                                            className="flex items-center gap-3"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.6 + rowIndex * 0.1 }}
                                                        >
                                                            <div
                                                                className="w-8 text-sm font-bold text-neutral-darkGray text-right">
                                                                {row.rowLabel}
                                                            </div>
                                                            <div className="flex flex-nowrap items-center gap-1">
                                                                {sorted.map((s) => {
                                                                    const parts = [];
                                                                    const startX = s.positionX ?? 0;
                                                                    if (startX > cursorX) {
                                                                        const spacerWidth = Math.max(0, startX - cursorX);
                                                                        parts.push(
                                                                            <div
                                                                                key={`spacer-${row.rowLabel}-${cursorX}`}
                                                                                style={{ width: spacerWidth, height: 0 }}
                                                                            />
                                                                        );
                                                                        cursorX = startX;
                                                                    }

                                                                    const isCouple = String(s.seatType).toLowerCase() === 'couple';
                                                                    const width = isCouple ? unit * 2 : unit;
                                                                    const selected = isSelected(s.id);
                                                                    const locked = isLockedByOthers(s.id);
                                                                    const booked = isBooked(s.id);
                                                                    const baseColor = getSeatColorByType(s.seatType);
                                                                    // Priority: booked (red) > locked (green) > selected (yellow) > base
                                                                    const bg = booked
                                                                        ? '#EF4444'
                                                                        : locked
                                                                            ? '#22C55E'
                                                                            : selected
                                                                                ? '#FACC15'
                                                                                : baseColor;
                                                                    const text = selected ? '#1F2937' : '#fff';

                                                                    parts.push(
                                                                        <motion.button
                                                                            key={s.id}
                                                                            type="button"
                                                                            onClick={() => toggleSeat(s)}
                                                                            className="h-10 rounded-lg border-2 border-neutral-lightGray/30 flex items-center justify-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-pink/40 transition-all duration-200"
                                                                            title={`${s.rowLabel}${s.seatNumber} • ${s.seatType}`}
                                                                            aria-label={`${s.rowLabel}${String(s.seatNumber).padStart(2, '0')} ${s.seatType}`}
                                                                            style={{
                                                                                backgroundColor: bg,
                                                                                color: text,
                                                                                width,
                                                                                borderColor: selected ? '#FACC15' : 'rgba(156, 163, 175, 0.3)'
                                                                            }}
                                                                            disabled={locked || booked || !isSeatActive(s)}
                                                                            whileHover={{ backgroundColor: '#FACC15' }}
                                                                            transition={{ duration: 0.3 }}
                                                                        >
                                                                            {s.seatNumber}
                                                                        </motion.button>
                                                                    );
                                                                    cursorX += width;

                                                                    return parts;
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="lg:sticky h-fit">
                    <motion.div
                        className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20 overflow-hidden"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="bg-primary-pink px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-white">
                                    <motion.div
                                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3V7z"
                                                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                        </svg>
                                    </motion.div>
                                    <span className="text-lg font-bold">Thông tin đặt vé</span>
                                </div>
                                <motion.span
                                    className="text-white/90 text-2xl"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    🎟️
                                </motion.span>
                            </div>
                        </div>

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
                                    <p
                                        className="mt-1 text-pink-500 text-sm lg:text-lg font-bold italic">{showtime?.movieTitle}</p>
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
                                            {toDate(showtime?.startUtc)?.toLocaleDateString('vi-VN', {
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
                                            {toDate(showtime?.startUtc)?.toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })} - {toDate(showtime?.endUtc)?.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        </div>
                                    </div>
                                    {(showtime?.roomName || showtime?.cinemaName) && (
                                        <div className="flex items-center gap-2">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg" className="text-primary-pink">
                                                <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z"
                                                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                      strokeLinejoin="round"/>
                                                <circle cx="12" cy="11" r="2.5" stroke="currentColor"
                                                        strokeWidth="1.5"/>
                                            </svg>
                                            <div>{showtime.roomName} • {showtime.cinemaName}</div>
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
                                        <span className="text-neutral-darkGray/80">Giá vé (ước tính)</span>
                                        <span className="font-medium">{formatVnd(basePrice)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-darkGray/80">Số lượng</span>
                                        <span className="font-medium">{selectedSeatIds.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-lg font-bold">
                                        <span>Tạm tính</span>
                                        <span className="text-primary-pink">{formatVnd(totalPrice)}</span>
                                    </div>
                                    <p className="text-xs text-neutral-darkGray/60 italic mt-1">
                                        * Giá chính xác sẽ được hiển thị ở bước xác nhận
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            <motion.button
                                type="button"
                                onClick={goToConfirm}
                                disabled={selectedSeatIds.length === 0 || secondsLeft === 0 || actionLoading}
                                className={`w-full inline-flex items-center justify-center py-3 rounded-xl text-white font-bold text-sm transition-all duration-300 ${
                                    selectedSeatIds.length === 0 || secondsLeft === 0 || actionLoading
                                        ? 'bg-neutral-lightGray cursor-not-allowed opacity-50'
                                        : 'bg-primary-pink hover:shadow-2xl cursor-pointer'
                                }`}
                                whileTap={selectedSeatIds.length > 0 && secondsLeft > 0 && !actionLoading ? { scale: 0.98 } : {}}
                                animate={selectedSeatIds.length > 0 && secondsLeft > 0 && !actionLoading ? { boxShadow: ["0 10px 25px rgba(236, 72, 153, 0.3)", "0 15px 35px rgba(236, 72, 153, 0.4)", "0 10px 25px rgba(236, 72, 153, 0.3)"] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <span>{actionLoading ? 'ĐANG XỬ LÝ...' : 'ĐẶT VÉ NGAY'}</span>
                            </motion.button>

                            {selectedSeatIds.length > 0 && (
                                <motion.div
                                    className="mt-3 text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-xs text-neutral-darkGray/70">
                                        💡 Bạn có {selectedSeatIds.length} ghế đã chọn
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionContent;


