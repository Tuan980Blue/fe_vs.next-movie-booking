'use client'

import {useEffect, useMemo, useState} from "react";
import {Play, Ticket} from "lucide-react";
import MoviePageSkeleton from "@/app/(site)/movies/_components/MoviePageSkeleton";
import {getMoviesApi} from "@/service";
import { MovieStatus, type MovieResponse, type MovieSearchDto } from "@/models/movie";
import MovieCard from "@/components/ui/MovieCard";
import {type PagedResult} from "@/models";

// Note: Since this is a client component, we can't export metadata here
// We'll need to create a separate metadata file or move metadata to a parent layout

const statusTabs = [
    {
        value: 'NowShowing' as const,
        label: 'PHIM ĐANG CHIẾU',
        icon: Ticket,
        iconPlacement: 'left' as const,
        activeClasses: 'bg-gradient-to-r from-primary-purple to-primary-black text-neutral-white shadow-[0_18px_35px_rgba(31,19,58,0.45)]',
        inactiveClasses: 'bg-primary-purple/30 border border-neutral-white/10 text-neutral-white/70 hover:bg-primary-purple/50',
        accentBar: 'from-primary-pink to-cinema-neonPink',
        iconTone: 'text-accent-yellow'
    },
    {
        value: 'ComingSoon' as const,
        label: 'PHIM SẮP CHIẾU',
        icon: Play,
        iconPlacement: 'right' as const,
        activeClasses: 'bg-gradient-to-r from-primary-purple to-primary-black text-neutral-white shadow-[0_18px_35px_rgba(31,19,58,0.45)]',
        inactiveClasses: 'bg-primary-purple/30 border border-neutral-white/10 text-neutral-white/70 hover:bg-primary-purple/50',
        accentBar: 'from-primary-pink to-cinema-neonPink',
        iconTone: 'text-accent-yellow'
    }
];

const MoviesPage = () => {
    const [movies, setMovies] = useState<MovieResponse[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(15);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [status, setStatus] = useState<'NowShowing' | 'ComingSoon' | 'Archived' | 'All'>('NowShowing');
    const [keyword, setKeyword] = useState<string>('');
    const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
    const [genreId, setGenreId] = useState<string>('');
    const [sort, setSort] = useState<'releaseDate_desc' | 'title_asc'>('releaseDate_desc');

    const totalPages = useMemo(() => {
        return pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;
    }, [totalItems, pageSize]);

    // Debounce search keyword
    useEffect(() => {
        const t = setTimeout(() => setDebouncedKeyword(keyword.trim()), 400);
        return () => clearTimeout(t);
    }, [keyword]);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const sortBy: string = sort.startsWith('title') ? 'title' : 'releaseDate';
                const sortDirection: 'asc' | 'desc' = sort.endsWith('_asc') ? 'asc' : 'desc';

                const params: MovieSearchDto = {
                    page,
                    pageSize,
                    search: debouncedKeyword || undefined,
                    genreIds: genreId ? [genreId] : undefined,
                    status: status === 'All' ? undefined : (status === 'NowShowing' ? MovieStatus.NowShowing : status === 'ComingSoon' ? MovieStatus.ComingSoon : MovieStatus.Archived),
                    sortBy,
                    sortDirection,
                };
                const data: PagedResult<MovieResponse> = await getMoviesApi(params);
                if (!isMounted) return;
                setMovies(Array.isArray(data?.items) ? data.items : []);
                setTotalItems(Number.isFinite(data?.totalItems) ? data.totalItems : 0);
            } catch (e: unknown) {
                if (!isMounted) return;
                const message = e instanceof Error ? e.message : 'Không thể tải danh sách phim';
                setError(message);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [page, pageSize, debouncedKeyword, genreId, status, sort]);

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    return (
        <div className="min-h-screen mb-10 px-2 lg:px-4 text-neutral-white">
            <div className="max-w-7xl mx-auto">
                <section className="rounded-3xl backdrop-blur-2xl p-4 lg:p-8 mb-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)] border-b-2 border-accent-yellow">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-3">
                            <h2 className="font-semibold tracking-[0.35em] text-accent-yellow uppercase">
                                DANH SÁCH PHIM
                            </h2>
                            <p className="text-neutral-white/70 italic">
                                Lọc theo thể loại, sắp xếp theo ngày phát hành hoặc tiêu đề, và lựa chọn giữa các phim đang chiếu
                                hoặc sắp chiếu. Trải nghiệm giao diện đặt vé chuyên nghiệp với màu sắc thương hiệu nhất quán.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="rounded-3xl p-2 shadow-[0_15px_30px_rgba(0,0,0,0.35)]">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        {statusTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = status === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => { setStatus(tab.value); setPage(1); }}
                                    className={`relative flex items-center gap-4 rounded-2xl px-6 py-4 text-base font-semibold tracking-wide transition-all duration-300 shadow-lg ${isActive ? tab.activeClasses : tab.inactiveClasses}`}
                                >
                                    {tab.iconPlacement === 'left' && (
                                        <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-white/10 ${tab.iconTone}`}>
                                            <Icon className="h-6 w-6" strokeWidth={1.5}/>
                                        </span>
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span>{tab.label}</span>
                                        {isActive && (
                                            <span className={`mt-3 h-1 w-16 rounded-full bg-gradient-to-r ${tab.accentBar}`}/>
                                        )}
                                    </div>
                                    {tab.iconPlacement === 'right' && (
                                        <span className={`ml-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-white/15 ${tab.iconTone}`}>
                                            <Icon className="h-6 w-6" strokeWidth={1.5}/>
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => { setStatus('All'); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${status === 'All' ? 'border-primary-pink text-primary-pink bg-primary-pink/10' : 'border-neutral-white/20 text-neutral-white/70 hover:bg-primary-purple/50'}`}
                        >
                            Tất cả
                        </button>
                        <div className="ml-auto text-sm md:text-base text-neutral-white/80">
                            Tổng số: <span className="font-semibold">{totalItems}</span>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        <input
                            value={keyword}
                            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                            className="w-full rounded-2xl border border-neutral-white/20 bg-primary-purple/30 px-4 py-2.5 text-neutral-white placeholder-neutral-white/50 focus:border-primary-pink focus:outline-none focus:ring-1 focus:ring-primary-pink"
                            placeholder="Tìm theo tên phim..."
                        />

                        <select
                            value={genreId}
                            onChange={(e) => { setGenreId(e.target.value); setPage(1); }}
                            className="w-full rounded-2xl border border-neutral-white/20 bg-primary-purple/30 px-4 py-2.5 text-neutral-white focus:border-primary-pink focus:outline-none focus:ring-1 focus:ring-primary-pink"
                        >
                            <option value="">Thể loại: Tất cả</option>
                            {Array.from(new Map(movies.flatMap(m => (m.genres || [])).map(g => [g.id, g])).values()).map((g) => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>

                        {/* Rated filter removed - not supported in backend MovieSearchDto */}

                        <div className="flex items-center gap-2">
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value as 'releaseDate_desc' | 'title_asc'); setPage(1); }}
                                className="w-full rounded-2xl border border-neutral-white/20 bg-primary-purple/30 px-4 py-2.5 text-neutral-white focus:border-primary-pink focus:outline-none focus:ring-1 focus:ring-primary-pink"
                            >
                                <option value="releaseDate_desc">Mới nhất</option>
                                <option value="title_asc">Tên A→Z</option>
                            </select>
                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                className="rounded-2xl border border-neutral-white/20 bg-primary-purple/30 px-4 py-2.5 text-neutral-white focus:border-primary-pink focus:outline-none focus:ring-1 focus:ring-primary-pink w-[110px]"
                            >
                                <option value={5}>5 / trang</option>
                                <option value={10}>10 / trang</option>
                                <option value={20}>20 / trang</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading / Error */}
                    {isLoading && <MoviePageSkeleton count={pageSize} />}
                    {!!error && !isLoading && (
                        <div className="py-8 text-center text-accent-red">{error}</div>
                    )}

                    {/* Grid */}
                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                            {movies.map((m) => (
                                <MovieCard key={m.id} movie={m} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && !error && (
                        <div className="flex items-center justify-between mt-6 border-t border-neutral-white/10 pt-2">
                            <button
                                onClick={handlePrev}
                                disabled={page <= 1}
                                className="px-4 py-2 rounded-full border border-neutral-white/20 text-neutral-white/80 hover:border-primary-pink hover:text-primary-pink transition disabled:opacity-40 disabled:hover:border-neutral-white/20"
                            >
                                Trang trước
                            </button>
                            <div className="text-neutral-white/80">
                                Trang <span className="font-semibold">{page}</span> / {totalPages}
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={page >= totalPages}
                                className="px-4 py-2 rounded-full border border-neutral-white/20 text-neutral-white/80 hover:border-primary-pink hover:text-primary-pink transition disabled:opacity-40 disabled:hover:border-neutral-white/20"
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoviesPage;
