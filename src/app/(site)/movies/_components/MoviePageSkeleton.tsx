
const MoviePageSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl overflow-hidden bg-white border border-neutral-lightGray/70 shadow-sm"
        >
          {/* Poster skeleton */}
          <div className="relative aspect-[2/3] bg-neutral-lightGray/30 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-neutral-lightGray/20 via-neutral-lightGray/40 to-neutral-lightGray/20 animate-pulse" />

            {/* Rated badge skeleton */}
            <div className="absolute top-3 right-3">
              <div className="w-8 h-4 bg-neutral-lightGray/60 rounded animate-pulse" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-5 bg-neutral-lightGray/40 rounded animate-pulse" />
              <div className="h-4 bg-neutral-lightGray/30 rounded w-3/4 animate-pulse" />
            </div>

            {/* Original title skeleton */}
            <div className="h-4 bg-neutral-lightGray/30 rounded w-1/2 animate-pulse" />

            {/* Duration and status skeleton */}
            <div className="h-4 bg-neutral-lightGray/30 rounded w-2/3 animate-pulse" />

            {/* Release date skeleton */}
            <div className="h-4 bg-neutral-lightGray/30 rounded w-1/2 animate-pulse" />

            {/* Genres skeleton */}
            <div className="flex flex-wrap gap-1">
              <div className="h-6 bg-neutral-lightGray/30 rounded-full w-16 animate-pulse" />
              <div className="h-6 bg-neutral-lightGray/30 rounded-full w-20 animate-pulse" />
              <div className="h-6 bg-neutral-lightGray/30 rounded-full w-14 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviePageSkeleton;
