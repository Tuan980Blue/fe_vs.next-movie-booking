'use client'

import { IoTicket } from 'react-icons/io5';
import { FaGooglePlay } from 'react-icons/fa';
import type React from 'react';
import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import MoviesShowcaseSkeleton from "@/app/(site)/_components/MoviesShowcaseSkeleton";
import {getMoviesApi} from "@/service";
import { MovieStatus, type MovieResponse, type MovieSearchParams } from "@/models/movie";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, iconLeft, iconRight }) => (
    <button
        onClick={onClick}
        className={`px-6 md:px-8 py-3 rounded-xl text-sm md:text-base font-extrabold tracking-wide transition shadow-sm flex items-center gap-2
    ${active ? 'bg-[#f53d7a] text-white shadow-[#f53d7a]/30' : 'bg-white text-neutral-darkGray border border-neutral-lightGray hover:bg-neutral-lightGray/30'}`}
    >
        {iconLeft ? <span className="shrink-0">{iconLeft}</span> : null}
        <span>{children}</span>
        {iconRight ? <span className="shrink-0">{iconRight}</span> : null}
    </button>
);

type TabKey = 'NowShowing' | 'ComingSoon';

const MoviesShowcase: React.FC = () => {
    const [tab, setTab] = useState<TabKey>('NowShowing');
    const [items, setItems] = useState<MovieResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [startIndex, setStartIndex] = useState<number>(0); // sliding window start

    const fetchSize = 12; // fetch a batch to slide through

    const params = useMemo<MovieSearchParams>(() => {
        const status = tab === 'NowShowing' ? MovieStatus.NowShowing : MovieStatus.ComingSoon;
        return { page: 1, pageSize: fetchSize, status };
    }, [tab]);

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getMoviesApi(params);
                if (!mounted) return;
                setItems(Array.isArray(data?.items) ? data.items : []);
                setStartIndex(0);
            } catch (e: unknown) {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : 'Không thể tải phim';
                setError(message);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchData();
        return () => { mounted = false; };
    }, [params]);

    return (
        <section className="py-12 md:py-16 px-4 lg:px-8 bg-gradient-to-b from-transparent via-[#2a0a3a]/10 to-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                        <TabButton
                            active={tab === 'NowShowing'}
                            onClick={() => { setTab('NowShowing'); }}
                            iconLeft={<IoTicket className="w-5 h-5" />}
                        >
                            PHIM ĐANG CHIẾU
                        </TabButton>
                        <TabButton
                            active={tab === 'ComingSoon'}
                            onClick={() => { setTab('ComingSoon'); }}
                            iconRight={<FaGooglePlay className="w-5 h-5" />}
                        >
                            PHIM SẮP CHIẾU
                        </TabButton>
                    </div>
                    <Link href="/movies" className="hidden md:inline-block text-sm font-semibold text-white/90 hover:text-white">Xem tất cả →</Link>
                </div>

                {loading && <MoviesShowcaseSkeleton />}
                {!!error && !loading && (
                    <div className="py-8 text-center text-red-400">{error}</div>
                )}

                {!loading && !error && (
                    <div className="relative">
                        {/* Left/Right controls */}
                        <button
                            onClick={() => setStartIndex((i) => (items.length ? (i - 1 + items.length) % items.length : 0))}
                            disabled={items.length <= 4}
                            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/90 border border-neutral-lightGray shadow hover:bg-white disabled:opacity-40"
                        >
                            ‹
                        </button>
                        <button
                            onClick={() => setStartIndex((i) => (items.length ? (i + 1) % items.length : 0))}
                            disabled={items.length <= 4}
                            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/90 border border-neutral-lightGray shadow hover:bg-white disabled:opacity-40"
                        >
                            ›
                        </button>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {Array.from({ length: Math.min(4, items.length) }).map((_, idx) => {
                                const m = items[(startIndex + idx) % items.length];
                                return (
                                    <div key={m.id} className="group rounded-2xl overflow-hidden bg-white border border-neutral-lightGray/70 shadow-sm hover:shadow-xl transition-all duration-300">
                                        <div className="relative aspect-[2/3] bg-neutral-lightGray/30 overflow-hidden">
                                            {m.posterUrl ? (
                                                <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-darkGray">No image</div>
                                            )}
                                            {m.rated && (
                                                <div className="absolute top-3 right-3 text-[11px] tracking-wide bg-black/70 text-white rounded px-2 py-0.5">{m.rated}</div>
                                            )}
                                            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute inset-0 p-3 flex flex-col items-center justify-center text-white">
                                                    <div className="w-full max-w-[200px] space-y-2.5">
                                                        <Link href={`/movies/${m.id}`} className="block w-full text-center text-sm font-extrabold tracking-wide bg-gray-50 hover:bg-gray-300 text-pink-500 rounded-md py-2">&gt; CHI TIẾT</Link>
                                                        <Link href={`/movies/${m.id}`} className="block w-full text-center text-sm font-extrabold tracking-wide bg-pink-500 text-white hover:bg-cinema-neonPink rounded-md py-2">MUA VÉ</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-sm md:text-base font-bold text-neutral-darkGray mb-1 line-clamp-2 uppercase">{m.title}</h3>
                                            {m.releaseDate && (
                                                <div className="text-xs md:text-sm font-medium text-[#a74bd6]">Khởi chiếu {new Date(m.releaseDate).toLocaleDateString()}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MoviesShowcase;


