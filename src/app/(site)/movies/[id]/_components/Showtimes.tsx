"use client"

import {motion} from "framer-motion";
import {useEffect, useMemo, useState} from "react";
import {getShowtimesByMovieApi} from "@/service";
import { useRouter } from "next/navigation";
import type { ShowtimeResponse, ShowtimeListResponse } from "@/models/showtime";

const Showtimes = ({ movieId }: { movieId: string }) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showtimes, setShowtimes] = useState<ShowtimeResponse[]>([]);

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            if (!movieId) return;
            try {
                setLoading(true);
                setError('');
                const data: ShowtimeListResponse | unknown[] = await getShowtimesByMovieApi(movieId);
                const items = Array.isArray(data)
                    ? data
                    : (Array.isArray((data as ShowtimeListResponse)?.items) ? (data as ShowtimeListResponse).items : []);
                if (!ignore) setShowtimes(items);
            } catch (e: unknown) {
                if (!ignore) setError(e instanceof Error ? e.message : 'Không thể tải lịch chiếu');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        fetchData();
        return () => { ignore = true; };
    }, [movieId]);

    const groups = useMemo(() => {
        const byDate = new Map<string, ShowtimeResponse[]>();
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        for (const s of showtimes) {
            const dt = new Date(s.startUtc);
            const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
            const list = byDate.get(key) ?? [];
            list.push(s);
            byDate.set(key, list);
        }
        // sort by date asc and time asc
        return Array.from(byDate.entries())
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([dateKey, items = []]) => ({
                dateKey,
                label: (() => {
                    if (dateKey === todayKey) return 'Hôm nay';
                    const first = items && items.length > 0 ? items[0] : undefined;
                    const d = new Date((first?.startUtc as string) || new Date().toISOString());
                    return d.toLocaleDateString('vi-VN', { weekday: 'long' });
                })(),
                dateShort: (() => {
                    const first = items && items.length > 0 ? items[0] : undefined;
                    const d = new Date((first?.startUtc as string) || new Date().toISOString());
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                })(),
                items: items.sort((x, y) => new Date(x.startUtc).getTime() - new Date(y.startUtc).getTime()),
            }));
    }, [showtimes]);

    const formatTime = (isoUtc: string) => new Date(isoUtc).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="border border-white/20 text-white rounded-2xl p-6 shadow-lg"
            >
                <div className="flex items-center mb-6">
                    <div className="mr-4 h-px bg-primary-pink flex-1"></div>
                    <h3 className="font-bold text-lg italic">📅 LỊCH CHIẾU</h3>
                    <div className="ml-4 h-px bg-primary-pink flex-1"></div>
                </div>

                {loading && (
                    <div className="text-neutral-darkGray">Đang tải lịch chiếu...</div>
                )}
                {!loading && error && (
                    <div className="text-accent-red">{error}</div>
                )}

                {!loading && !error && groups.length === 0 && (
                    <div className="text-white">Chưa có lịch chiếu.</div>
                )}

                {!loading && !error && groups.map(group => (
                    <div key={group.dateKey} className="mb-8">
                        <div className="relative inline-block mb-4">
                            <div className="bg-primary-purple text-white italic px-5 py-2 rounded-xl font-semibold shadow-lg border border-white select-none">
                                {group.label}, ngày {group.dateShort}
                            </div>
                            <span className="absolute -bottom-2 left-6 w-3 h-3 bg-primary-purple rotate-45 rounded-[2px]"></span>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-5">
                            {group.items.map((item) => (
                                <button
                                    key={`filled-${item.id}`}
                                    onClick={() => {
                                        const params = new URLSearchParams({
                                            showtimeId: String(item.id || ''),
                                            cinemaId: String((item as any).cinemaId || item.room?.cinema?.id || ''),
                                            roomId: String((item as any).roomId || ''),
                                            startUtc: String(item.startUtc || ''),
                                        });
                                        router.push(`/booking/seat-selection?${params.toString()}`);
                                    }}
                                    className="px-5 py-2 rounded-lg text-sm font-semibold transition-all bg-white text-primary-pink hover:bg-cinema-neonPink hover:text-white border border-primary-pink hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary-pink/40"
                                >
                                    {formatTime(item.startUtc)}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Showtimes;
