'use client'

import { IoTicket } from 'react-icons/io5';
import { FaGooglePlay } from 'react-icons/fa';
import type React from 'react';
import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import MoviesShowcaseSkeleton from "@/app/(site)/_components/MoviesShowcaseSkeleton";
import {getMoviesApi} from "@/service";
import { MovieStatus, type MovieResponse, type MovieSearchDto } from "@/models/movie";
import MovieCard from "@/components/ui/MovieCard";

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

    const params = useMemo<MovieSearchDto>(() => {
        const status = tab === 'NowShowing' ? MovieStatus.NowShowing : MovieStatus.ComingSoon;
        return { status };
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
                                    <MovieCard key={m.id} movie={m}/>
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


