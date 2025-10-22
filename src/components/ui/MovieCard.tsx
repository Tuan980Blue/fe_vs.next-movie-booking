"use client";

import Link from "next/link";
import type {MovieResponse} from "@/models/movie";

type MovieCardProps = {
    movie: MovieResponse;
};

const MovieCard = ({movie}: MovieCardProps) => {
    const m = movie;
    return (
        <div
            className="group rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-neutral-lightGray/70 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
            <div className="relative aspect-[2/3] bg-neutral-lightGray/30 overflow-hidden">
                {m.posterUrl ? (
                    <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-darkGray">No image</div>
                )}
                {m.rated && (
                    <div
                        className="absolute top-3 right-3 text-[11px] tracking-wide bg-gradient-to-br from-black/70 to-black/40 text-white rounded-full px-2.5 py-1 border border-white/10 shadow-md">
                        {m.rated}
                    </div>
                )}

                {/* Hover overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-white">
                        <div className="w-full max-w-[210px] space-y-3">
                            <div className="w-full max-w-[200px] space-y-2.5">
                                <Link href={`/movies/${m.id}`}
                                      className="block w-full text-center text-sm font-extrabold tracking-wide bg-white text-pink-600 hover:bg-neutral-lightGray rounded-md py-2 transition-colors">CHI
                                    TIẾT</Link>
                                <Link href={`/movies/${m.id}`}
                                      className="block w-full text-center text-sm font-extrabold tracking-wide bg-pink-500 text-white hover:bg-cinema-neonPink rounded-md py-2 transition-colors shadow-[0_0_20px_rgba(245,61,122,0.35)]">MUA
                                    VÉ</Link>
                            </div>
                            <div className="mt-3 text-left space-y-1 text-[13px] md:text-sm">
                                {m.durationMinutes ? (
                                    <div className="text-white/90"><span>Thời lượng:</span> {m.durationMinutes} phút
                                    </div>
                                ) : null}
                                {Array.isArray(m.genres) && m.genres.length > 0 ? (
                                    <div>
                                        <div className="mb-1">Thể loại:</div>
                                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                                            {m.genres.slice(0, 4).map((g) => (
                                                <span key={g.id}
                                                      className="text-[11px] bg-white/10 border border-white/15 rounded-full px-2 py-0.5 italic">
                                                    {g.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-white/10 bg-gradient-to-b from-transparent to-black/5">
                <h3 className="text-base md:text-lg font-bold mb-1 line-clamp-2 uppercase tracking-wide text-white group-hover:text-pink-500 transition-colors duration-300">
                    {m.title}
                </h3>
                {m.originalTitle && (
                    <div className="text-sm mb-2 text-white/70 italic line-clamp-1">
                        {m.originalTitle}
                    </div>
                )}
                {m.releaseDate && (
                    <div className="text-sm font-medium mb-1 text-pink-400">
                        🎬 Khởi chiếu:{" "}
                        <span className="text-white/90">
                            {new Date(m.releaseDate).toLocaleDateString("vi-VN")}
                        </span>
                    </div>
                )}
                <div className="mt-1 text-[13px] text-white/80">
                    ⭐ <span className="font-semibold">4.8</span>/5
                </div>

            </div>

        </div>
    );
};

export default MovieCard;


