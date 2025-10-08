
const MovieDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-purple to-primary-pink">
      {/* Hero Section Skeleton */}
      <div className="relative h-[85vh] lg:h-[90vh] overflow-hidden">
        {/* Backdrop Skeleton */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-lightGray/20 via-neutral-lightGray/40 to-neutral-lightGray/20 animate-pulse" />
        
        {/* Main Content Skeleton */}
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-8 w-full">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-end">
              
              {/* Movie Poster Skeleton */}
              <div className="xl:col-span-4 relative">
                <div className="relative group">
                  {/* Poster Image Skeleton */}
                  <div className="w-full max-w-sm mx-auto xl:mx-0 rounded-2xl shadow-2xl border-4 border-white/30">
                    <div className="aspect-[2/3] bg-gradient-to-r from-neutral-lightGray/20 via-neutral-lightGray/40 to-neutral-lightGray/20 animate-pulse rounded-2xl" />
                  </div>
                  
                  {/* Age Rating Badge Skeleton */}
                  <div className="absolute -top-4 -right-4">
                    <div className="w-12 h-8 bg-neutral-lightGray/60 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Movie Information Skeleton */}
              <div className="xl:col-span-8 text-white relative">
                {/* Title Section Skeleton */}
                <div className="mb-4">
                  <div className="h-8 lg:h-10 xl:h-12 bg-white/20 rounded-lg animate-pulse mb-2" />
                  <div className="h-6 lg:h-7 bg-white/15 rounded-lg animate-pulse w-3/4" />
                </div>

                {/* Status Badge Skeleton */}
                <div className="w-32 h-8 bg-white/20 rounded-full animate-pulse mb-4" />

                {/* Movie Stats Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="h-4 bg-white/20 rounded animate-pulse mb-2" />
                    <div className="h-6 bg-white/30 rounded animate-pulse" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="h-4 bg-white/20 rounded animate-pulse mb-2" />
                    <div className="h-6 bg-white/30 rounded animate-pulse" />
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="h-12 w-40 bg-white/20 rounded-2xl animate-pulse" />
                  <div className="h-12 w-36 bg-white/20 rounded-2xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section Skeleton */}
      <div className="max-w-7xl mx-auto p-4 lg:px-8">
        <div className="bg-pink/10 backdrop-blur-md p-4 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8">
            <div className="mb-4">
              <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-4" />
              
              {/* Description Skeleton */}
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-white/15 rounded animate-pulse" />
                <div className="h-4 bg-white/15 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-white/15 rounded animate-pulse w-4/5" />
                <div className="h-4 bg-white/15 rounded animate-pulse w-3/4" />
              </div>

              {/* Director & Cast Info Skeleton */}
              <div className="grid lg:grid-cols-2 gap-8 mt-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-8 py-4 border border-white/20">
                  <div className="mb-4">
                    <div className="h-5 w-24 bg-white/20 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-white/15 rounded animate-pulse w-3/4" />
                  </div>
                  <div>
                    <div className="h-5 w-20 bg-white/20 rounded animate-pulse mb-2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-white/15 rounded animate-pulse" />
                      <div className="h-3 bg-white/15 rounded animate-pulse w-5/6" />
                      <div className="h-3 bg-white/15 rounded animate-pulse w-4/5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl px-8 py-4 border border-white/20">
                  <div className="mt-8">
                    <div className="h-5 w-20 bg-white/20 rounded animate-pulse mb-3" />
                    <div className="flex flex-wrap gap-2">
                      <div className="h-6 w-16 bg-white/15 rounded-full animate-pulse" />
                      <div className="h-6 w-20 bg-white/15 rounded-full animate-pulse" />
                      <div className="h-6 w-14 bg-white/15 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtime & Booking Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Showtimes Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="h-5 w-24 bg-white/20 rounded animate-pulse mb-2" />
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-8 bg-white/15 rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Booking Form Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                <div className="h-10 bg-white/15 rounded animate-pulse" />
                <div className="h-10 bg-white/15 rounded animate-pulse" />
                <div className="h-10 bg-white/15 rounded animate-pulse" />
                <div className="h-12 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailSkeleton;
