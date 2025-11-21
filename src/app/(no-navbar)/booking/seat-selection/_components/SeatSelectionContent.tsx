"use client"

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SeatSelectionSkeleton from "@/app/(no-navbar)/booking/seat-selection/_components/SeatSelectionSkeleton";
import Timer from "./Timer";
import SeatLegend from "./SeatLegend";
import SeatMap from "./SeatMap";
import BookingSummary from "./BookingSummary";
import { getSeatLayoutApi, getShowtimeByIdApi, getBookedSeatsApi } from "@/service";
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

    // Initial fetch booked seats state for the showtime
    useEffect(() => {
        let ignore = false;
        async function fetchBooked() {
            if (!showtimeId) return;
            try {
                const data = await getBookedSeatsApi(showtimeId);
                if (!ignore && data?.bookedSeatIds?.length) {
                    setBookedSeatIds(new Set(data.bookedSeatIds));
                }
            } catch {
                // ignore initial fetch errors
            }
        }
        fetchBooked();
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

    const formatVnd = (amount: number) =>
        (amount || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const basePrice = Number(showtime?.basePriceMinor || 0);
    const totalPrice = basePrice * selectedSeatIds.length;

    const isSelected = (id: string) => selectedSeatIds.includes(id);
    const getSeatName = (seat: SeatUi) => `${seat.rowLabel}${String(seat.seatNumber).padStart(2, '0')}`;
    const getRowSeats = (rowLabel: string): SeatUi[] => layout?.rows.find(r => r.rowLabel === rowLabel)?.seats || [];
    const isSeatActive = (seat: SeatUi) => seat?.isActive !== false;
    const isLockedByOthers = (id: string) => lockedSeatIds.has(id);
    const isBooked = (id: string) => bookedSeatIds.has(id);
    const getSeatColorByType = (type: string | number) => {
        // Ghế đôi dùng cùng màu như ghế đơn
        const typeStr = String(type || '').toLowerCase();
        if (typeStr === 'couple') {
            return '#9CA3AF'; // Màu mặc định giống ghế đơn
        }
        const item = seatLegend.find(t => t.type.toLowerCase() === typeStr);
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

    if (loading) {
        return <SeatSelectionSkeleton />;
    }

    return (
        <div className="py-8 px-4 lg:px-8 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Timer secondsLeft={secondsLeft} />
                    
                    {secondsLeft <= 60 && secondsLeft > 0 && (
                        <motion.div
                            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            ⚠️ Thời gian giữ chỗ sắp hết! Vui lòng hoàn tất đặt vé trong {secondsLeft} giây.
                        </motion.div>
                    )}

                    {!loading && error && (
                        <motion.div
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800"
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
                            className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-sm overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                                <div className="lg:col-span-1">
                                    <SeatLegend seatLegend={seatLegend} />
                                </div>
                                <div className="lg:col-span-3">
                                    <SeatMap
                                        layout={layout}
                                        selectedSeatIds={selectedSeatIds}
                                        lockedSeatIds={lockedSeatIds}
                                        bookedSeatIds={bookedSeatIds}
                                        getSeatColorByType={getSeatColorByType}
                                        isSelected={isSelected}
                                        isSeatActive={isSeatActive}
                                        toggleSeat={toggleSeat}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="">
                    <BookingSummary
                        showtime={showtime}
                        user={user}
                        isAuthenticated={isAuthenticated}
                        selectedSeatIds={selectedSeatIds}
                        layout={layout}
                        basePrice={basePrice}
                        totalPrice={totalPrice}
                        secondsLeft={secondsLeft}
                        actionLoading={actionLoading}
                        onConfirm={goToConfirm}
                        getSeatName={getSeatName}
                    />
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionContent;


