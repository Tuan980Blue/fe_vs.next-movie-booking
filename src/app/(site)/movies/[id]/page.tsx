'use client'

import {motion, AnimatePresence} from 'framer-motion';
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";
import BookingForm from "@/app/(site)/booking/_components/BookingForm";
import MovieDetailSkeleton from "@/app/(site)/movies/[id]/_components/MovieDetailSkeleton";
import Showtimes from "@/app/(site)/movies/[id]/_components/Showtimes";
import {getMovieDetailApi} from "@/service";
import type { MovieResponse } from "@/models/movie";
import { MovieStatus } from "@/models/movie";

const MovieDetailPage = () => {
    const params = useParams();
    const id = Array.isArray((params as any)?.id) ? (params as any).id[0] : (params as any)?.id;
    const [movie, setMovie] = useState<MovieResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showTrailer, setShowTrailer] = useState<boolean>(false);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                setLoading(true);
                const data = await getMovieDetailApi(String(id));
                setMovie(data);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Không thể tải thông tin phim';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieDetail();
        }
    }, [id]);

    // Ensure page scrolls to top when navigating to a new movie detail
    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    }, [id]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatDuration = (minutes?: number) => {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    // Lấy YouTube video ID từ trailerUrl
    const getYouTubeId = (url?: string | null): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) {
        return <MovieDetailSkeleton/>;
    }

    if (error || !movie) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-purple to-primary-pink">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy phim</h2>
                    <p className="text-white opacity-75 mb-6">{error || 'Phim không tồn tại'}</p>
                    <Link
                        href="/movies"
                        className="inline-block px-6 py-3 bg-primary-pink text-white rounded-lg hover:bg-cinema-neonPink transition-colors"
                    >
                        Quay lại danh sách phim
                    </Link>
                </div>
            </div>
        );
    }

    const youtubeId = getYouTubeId(movie.trailerUrl);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-purple to-primary-pink mb-8 lg:mb-16">
            {/* Hero Section - Cinema Style */}
            <div className="relative h-[85vh] lg:h-[90vh] overflow-hidden">
                {/* Dynamic Backdrop với Parallax Effect */}
                <motion.div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${movie.backdropUrl})`
                    }}
                    initial={{scale: 1.1}}
                    animate={{scale: 1}}
                    transition={{duration: 1.5}}
                />
                {/* Main Content */}
                <div className="relative z-10 h-full flex items-end">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-8 w-full">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-end">

                            {/* Movie Poster với Enhanced Effects */}
                            <motion.div
                                initial={{opacity: 0, y: 50, rotateY: -15}}
                                animate={{opacity: 1, y: 0, rotateY: 0}}
                                transition={{duration: 1, ease: "easeOut"}}
                                className="xl:col-span-4 relative"
                            >
                                <div className="relative group">
                                    {/* Poster Image */}
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className="w-full max-w-sm mx-auto xl:mx-0 rounded-2xl shadow-2xl transform transition-all duration-500 border-4 border-white/30"
                                    />

                                    {/* Age Rating Badge */}
                                    {movie.rated && (
                                        <motion.div
                                            initial={{scale: 0, rotate: -10}}
                                            animate={{scale: 1, rotate: 0}}
                                            transition={{duration: 0.5, delay: 0.3}}
                                            className="absolute -top-4 -right-4 bg-accent-red text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white"
                                        >
                                            {movie.rated}
                                        </motion.div>
                                    )}
                                    {/* Glow Effect */}
                                    <div
                                        className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary-pink/30 to-transparent opacity-0 transition-opacity duration-500"></div>
                                </div>
                            </motion.div>

                            {/* Movie Information */}
                            <motion.div
                                initial={{opacity: 0, y: 50}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 1, delay: 0.2}}
                                className="xl:col-span-8 text-white relative"
                            >
                                {/* Title Section */}
                                <div className="mb-4">
                                    <h1 className="text-2xl lg:text-3xl xl:text-4xl italic font-bold mb-2 leading-tight">
                                        {movie.title}
                                    </h1>

                                    {movie.originalTitle && movie.originalTitle !== movie.title && (
                                        <h2 className="text-lg lg:text-xl text-white/90 mb-3 font-light">
                                            {movie.originalTitle}
                                        </h2>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <motion.div
                                    initial={{opacity: 0, scale: 0.8}}
                                    animate={{opacity: 1, scale: 1}}
                                    transition={{duration: 0.5, delay: 0.5}}
                                    className={`px-3 py-2 mb-4 max-w-fit rounded-full text-xs font-bold shadow-lg ${
                                        movie.status === MovieStatus.NowShowing ? 'bg-accent-orange text-white' :
                                            movie.status === MovieStatus.ComingSoon ? 'bg-accent-yellow text-neutral-darkGray' :
                                                movie.status === MovieStatus.Archived ? 'bg-neutral-lightGray text-neutral-darkGray' :
                                                    'bg-primary-pink text-white'
                                    }`}
                                >
                                    {movie.status === MovieStatus.NowShowing ? '🎬 ĐANG CHIẾU' :
                                        movie.status === MovieStatus.ComingSoon ? '📅 SẮP CHIẾU' :
                                            movie.status === MovieStatus.Archived ? '📰 ĐÃ CHIẾU' : '🎬'}
                                </motion.div>

                                {/* Movie Stats */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                        <div className="text-accent-yellow text-xs font-semibold mb-1">⏱️ THỜI LƯỢNG
                                        </div>
                                        <div
                                            className="text-white text-sm font-bold">{formatDuration(movie.durationMinutes)}</div>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                        <div className="text-accent-yellow text-xs font-semibold mb-1">📅 KHỞI CHIẾU
                                        </div>
                                        <div
                                            className="text-white text-sm font-bold">{formatDate(movie.releaseDate)}</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={`/user/booking/${movie.id}`}
                                        className="group relative px-6 py-3 bg-primary-pink rounded-2xl text-white font-bold text-base hover:bg-cinema-neonPink transition-all duration-300 shadow-2xl overflow-hidden transform"
                                    >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      🎫 MUA VÉ NGAY
                    </span>
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 bg-gradient-to-r from-primary-pink to-accent-orange"></div>
                                    </Link>

                                    {movie.trailerUrl && (
                                        <button
                                            onClick={() => setShowTrailer(true)}
                                            className="group px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/40 rounded-2xl text-white font-bold text-base hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            ▶️ XEM TRAILER
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            <AnimatePresence>
                {showTrailer && youtubeId && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setShowTrailer(false)}
                    >
                        <motion.div
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: [0.8, 1.05, 1], opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                            transition={{
                                duration: 0.3,
                                scale: {duration: 0.4, ease: "easeOut"}
                            }}
                            className="relative max-w-5xl w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <motion.button
                                whileHover={{scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)"}}
                                whileTap={{scale: 0.95}}
                                onClick={() => setShowTrailer(false)}
                                className="absolute top-4 right-4 z-10 bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 transition-all duration-300 border border-white/20"
                            >
                                <span className="text-2xl font-bold">×</span>
                            </motion.button>

                            {/* Movie Title */}
                            <div
                                className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                                <h3 className="text-white font-bold text-lg">
                                    {movie.title} - Official Trailer
                                </h3>
                            </div>

                            {/* YouTube Player */}
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&start=0&rel=0&modestbranding=1`}
                                title={`${movie.title} - Official Trailer`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                loading="lazy"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto p-4 lg:px-8">
                <div
                    className="bg-pink/10 backdrop-blur-md p-4 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="px-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="overview"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -20}}
                                transition={{duration: 0.3}}
                            >
                                <h3 className="text-lg font-bold text-gray-100 mb-2">📖 TỔNG QUAN</h3>
                                <div className="prose max-w-none text-gray-50 leading-relaxed">
                                    <div className={"mb-4"}>
                                        <p className="text-balance italic">{movie.description}</p>
                                    </div>

                                    {/* Director & Cast Info */}
                                    <div className="grid lg:grid-cols-2 gap-8 mt-4">
                                        <div
                                            className="bg-white/10 backdrop-blur-md rounded-xl px-8 py-4 border border-white/20 text-white">
                                            <div>
                                                <h4 className="text-lg text-gray-200 font-bold mb-2 flex items-center gap-2">
                                                    🎬 Đạo diễn
                                                </h4>
                                                <p className="text-base mb-2">{movie.director}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-lg text-gray-200 font-bold mb-2 flex items-center gap-2">
                                                    👥 Diễn viên
                                                </h4>
                                                <div className="text-sm">
                                                    <p className="text-sm opacity-90 whitespace-pre-wrap">{movie.actors}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="bg-white/10 backdrop-blur-md rounded-xl px-8 py-4 border border-white/20 text-white">
                                            {/* Genres */}
                                            {movie.genres && (
                                                <div className="mt-8">
                                                    <h4 className="text-base font-bold text-gray-200 mb-3">🏷️ Thể
                                                        loại</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {movie.genres.map((genre) => (
                                                            <span
                                                                key={genre.id}
                                                                className="px-3 py-1 bg-gray/100 rounded-full text-primary-pink font-semibold border border-primary-pink/20 transition-all duration-300 text-sm"
                                                            >
                                {genre.name}
                              </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Showtime &  Booking Section */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Showtimes */}
                    <div className="lg:col-span-2">
                        <Showtimes movieId={movie.id}/>
                    </div>
                    {/* Right Column - Booking Form */}
                    <div className="lg:col-span-1">
                        <BookingForm/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;
