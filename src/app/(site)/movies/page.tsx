'use client'

import {useEffect, useMemo, useState} from "react";
import MoviePageSkeleton from "@/app/(site)/movies/_components/MoviePageSkeleton";
import {getMoviesApi} from "@/service";
import { MovieStatus, type MovieResponse, type MovieListResponse, type MovieSearchParams } from "@/models/movie";
import MovieCard from "@/components/ui/MovieCard";

// Note: Since this is a client component, we can't export metadata here
// We'll need to create a separate metadata file or move metadata to a parent layout

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
    const [rated, setRated] = useState<string>('');
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
                const sortField: 'title' | 'releaseDate' | 'createdAt' = sort.startsWith('title') ? 'title' : 'releaseDate';
                const order: 'asc' | 'desc' = sort.endsWith('_asc') ? 'asc' : 'desc';

                const params: MovieSearchParams & { genre?: string; rated?: string } = {
                    page,
                    pageSize,
                    keyword: debouncedKeyword || undefined,
                    // Backend expects 'genre' not 'genreId' per models; keep current param name if API supports it
                    genre: genreId || undefined,
                    // rated is not in MovieSearchParams; send through as is if backend supports
                    rated: rated || undefined,
                    status: status === 'All' ? undefined : (status === 'NowShowing' ? MovieStatus.NowShowing : status === 'ComingSoon' ? MovieStatus.ComingSoon : MovieStatus.Archived),
                    sort: sortField,
                    order,
                };
                const data: MovieListResponse = await getMoviesApi(params);
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
    }, [page, pageSize, debouncedKeyword, genreId, rated, status, sort]);

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    return (
        <div className="min-h-screen py-4 lg:py-8 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-neutral-white/80 text-base md:text-lg">
                        Khám phá phim đang chiếu và sắp chiếu tại rạp
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/15 shadow-lg">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        {(['NowShowing', 'ComingSoon'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => { setStatus(s); setPage(1); }}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition
                ${status === s
                                    ? 'bg-[#f53d7a] text-white shadow-[#f53d7a]/30'
                                    : 'bg-white text-neutral-darkGray border border-neutral-lightGray hover:bg-neutral-lightGray/30'}`}
                            >
                                {s === 'NowShowing' ? 'PHIM ĐANG CHIẾU' : 'PHIM SẮP CHIẾU'}
                            </button>
                        ))}
                        <button
                            onClick={() => { setStatus('All'); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${status === 'All' ? 'border-[#f53d7a] text-[#f53d7a] bg-[#f53d7a]/10' : 'border-neutral-lightGray text-neutral-50 hover:bg-neutral-lightGray/30'}`}
                        >
                            Tất cả
                        </button>
                        <div className="ml-auto text-neutral-darkGray/80 text-sm md:text-base">
                            Tổng số: <span className="font-semibold">{totalItems}</span>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        <input
                            value={keyword}
                            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                            className="border border-neutral-lightGray rounded-md px-3 py-2"
                            placeholder="Tìm theo tên phim..."
                        />

                        <select
                            value={genreId}
                            onChange={(e) => { setGenreId(e.target.value); setPage(1); }}
                            className="border border-neutral-lightGray rounded-md px-3 py-2"
                        >
                            <option value="">Thể loại: Tất cả</option>
                            {Array.from(new Map(movies.flatMap(m => (m.genres || [])).map(g => [g.id, g])).values()).map((g) => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>

                        <select
                            value={rated}
                            onChange={(e) => { setRated(e.target.value); setPage(1); }}
                            className="border border-neutral-lightGray rounded-md px-3 py-2"
                        >
                            <option value="">Độ tuổi: Tất cả</option>
                            {Array.from(new Set(movies.map(m => m.rated).filter(Boolean))).map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>

                        <div className="flex items-center gap-2">
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value as 'releaseDate_desc' | 'title_asc'); setPage(1); }}
                                className="border border-neutral-lightGray rounded-md px-3 py-2 w-full"
                            >
                                <option value="releaseDate_desc">Mới nhất</option>
                                <option value="title_asc">Tên A→Z</option>
                            </select>
                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                className="border border-neutral-lightGray rounded-md px-2 py-2 w-[110px]"
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
                        <div className="py-8 text-center text-red-600">{error}</div>
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
                        <div className="flex items-center justify-between mt-8">
                            <button
                                onClick={handlePrev}
                                disabled={page <= 1}
                                className="px-4 py-2 rounded-md border border-neutral-lightGray disabled:opacity-50"
                            >
                                Trang trước
                            </button>
                            <div className="text-neutral-darkGray">
                                Trang <span className="font-semibold">{page}</span> / {totalPages}
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={page >= totalPages}
                                className="px-4 py-2 rounded-md border border-neutral-lightGray disabled:opacity-50"
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
