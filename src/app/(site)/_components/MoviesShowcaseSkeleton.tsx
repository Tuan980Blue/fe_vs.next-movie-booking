
const MoviesShowcaseSkeleton = () => {
    return (
        <section className="py-12 md:py-16 px-4 lg:px-8 bg-gradient-to-b from-transparent via-[#2a0a3a]/10 to-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                        {/* Tab buttons skeleton */}
                        <div className="px-6 md:px-8 py-3 rounded-xl bg-white/20 animate-pulse">
                            <div className="h-4 bg-white/30 rounded w-32 animate-pulse" />
                        </div>
                        <div className="px-6 md:px-8 py-3 rounded-xl bg-white/20 animate-pulse">
                            <div className="h-4 bg-white/30 rounded w-28 animate-pulse" />
                        </div>
                    </div>
                    <div className="hidden md:inline-block">
                        <div className="h-4 bg-white/20 rounded w-24 animate-pulse" />
                    </div>
                </div>

                <div className="relative">
                    {/* Left/Right controls skeleton */}
                    <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/90 border border-neutral-lightGray/30 animate-pulse" />
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/90 border border-neutral-lightGray/30 animate-pulse" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="group rounded-2xl overflow-hidden bg-white border border-neutral-lightGray/70 shadow-sm">
                                {/* Poster skeleton */}
                                <div className="relative aspect-[2/3] bg-neutral-lightGray/30 overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-r from-neutral-lightGray/20 via-neutral-lightGray/40 to-neutral-lightGray/20 animate-pulse" />

                                    {/* Rated badge skeleton */}
                                    <div className="absolute top-3 right-3">
                                        <div className="w-8 h-4 bg-neutral-lightGray/60 rounded animate-pulse" />
                                    </div>

                                    {/* Hover overlay skeleton */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20 animate-pulse">
                                        <div className="absolute inset-0 p-3 flex flex-col items-center justify-center">
                                            <div className="w-full max-w-[200px] space-y-2.5">
                                                <div className="h-8 bg-white/20 rounded-md animate-pulse" />
                                                <div className="h-8 bg-white/20 rounded-md animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content skeleton */}
                                <div className="p-3">
                                    {/* Title skeleton */}
                                    <div className="mb-1">
                                        <div className="h-4 bg-neutral-lightGray/40 rounded animate-pulse mb-1" />
                                        <div className="h-4 bg-neutral-lightGray/30 rounded w-2/3 animate-pulse" />
                                    </div>

                                    {/* Release date skeleton */}
                                    <div className="h-3 bg-neutral-lightGray/30 rounded w-1/2 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MoviesShowcaseSkeleton;
