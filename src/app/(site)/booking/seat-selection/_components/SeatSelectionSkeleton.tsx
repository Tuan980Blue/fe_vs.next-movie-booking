
const SeatSelectionSkeleton = () => {
  return (
    <div className="py-6 px-4 lg:px-8 h-full bg-neutral-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-6">
        {/* Left: Seat map skeleton */}
        <div className="lg:col-span-2 p-6">
          {/* Movie & showtime info skeleton */}
          <div className="mb-5 px-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="hidden sm:block w-14 h-20 rounded-lg overflow-hidden bg-neutral-lightGray/60 ring-1 ring-neutral-lightGray/60 shrink-0">
                  <div className="w-full h-full bg-gradient-to-r from-neutral-lightGray/20 via-neutral-lightGray/40 to-neutral-lightGray/20 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="h-6 lg:h-7 w-64 bg-neutral-lightGray/40 rounded animate-pulse mb-2" />
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <div className="h-5 w-16 bg-pink-500/20 rounded-full animate-pulse" />
                    <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
                  </div>
                  <div className="mt-2 h-4 w-80 bg-neutral-lightGray/30 rounded animate-pulse" />
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <div className="flex flex-col justify-center items-center">
                  <div className="h-3 w-20 bg-neutral-lightGray/30 rounded animate-pulse mb-1" />
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-pink/10 ring-1 ring-primary-pink/20">
                    <div className="w-4 h-4 bg-primary-pink/20 rounded animate-pulse" />
                    <div className="h-5 w-12 bg-primary-pink/20 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seat map skeleton */}
          <div className="grid grid-cols-7 gap-2 lg:gap-6">
            {/* Legend skeleton - left sidebar */}
            <div className="col-span-2">
              <div className="rounded-xl border border-neutral-lightGray/60 p-4">
                <div className="h-4 w-16 bg-neutral-lightGray/40 rounded animate-pulse mb-3" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-neutral-lightGray/40 animate-pulse" />
                      <div className="h-4 w-32 bg-neutral-lightGray/30 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Screen + seat grid skeleton */}
            <div className="col-span-5">
              <div className="max-w-fit">
                <div className="w-full flex justify-center">
                  <div className="mx-auto inline-block">
                    {/* Screen skeleton */}
                    <div className="mb-2">
                      <div className="h-2 w-full ml-4 bg-neutral-lightGray/40 rounded-full animate-pulse" />
                      <div className="mt-2 text-center">
                        <div className="h-4 w-20 bg-neutral-lightGray/30 rounded animate-pulse mx-auto" />
                      </div>
                    </div>

                    {/* Seat grid skeleton */}
                    <div className="space-y-3 overflow-x-auto p-2">
                      {Array.from({ length: 8 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="flex items-center gap-2">
                          <div className="w-6 h-4 bg-neutral-lightGray/30 rounded animate-pulse" />
                          <div className="flex flex-nowrap items-center" style={{ gap: 4 }}>
                            {Array.from({ length: 12 }).map((_, seatIndex) => (
                              <div
                                key={seatIndex}
                                className="h-8 w-8 rounded-md border bg-neutral-lightGray/40 animate-pulse"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking summary skeleton */}
        <div className="lg:sticky lg:top-4 h-fit">
          <div className="rounded-2xl bg-white/90 backdrop-blur shadow-xl ring-1 ring-neutral-lightGray/60 overflow-hidden">
            {/* Header skeleton */}
            <div className="bg-gradient-to-r from-primary-pink to-rose-400 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 rounded animate-pulse" />
                  <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
                </div>
                <div className="w-6 h-6 bg-white/20 rounded animate-pulse" />
              </div>
            </div>

            {/* Body skeleton */}
            <div className="px-6 py-2">
              {/* User info skeleton */}
              <div className="mb-4 rounded-xl bg-neutral-lightGray/30 ring-1 ring-neutral-lightGray/60 px-4 py-3">
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-neutral-lightGray/40 rounded animate-pulse" />
                  <div className="h-3 w-36 bg-neutral-lightGray/30 rounded animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                {/* Movie title skeleton */}
                <div>
                  <div className="h-3 w-8 bg-neutral-lightGray/30 rounded animate-pulse mb-1" />
                  <div className="h-6 w-48 bg-neutral-lightGray/40 rounded animate-pulse" />
                </div>

                {/* Showtime info skeleton */}
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-primary-pink/20 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-neutral-lightGray/30 rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                <div className="h-px bg-neutral-lightGray/60" />

                {/* Selected seats skeleton */}
                <div>
                  <div className="h-4 w-24 bg-neutral-lightGray/40 rounded animate-pulse mb-2" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-6 w-12 bg-primary-pink/20 rounded-md animate-pulse" />
                    ))}
                  </div>
                </div>

                <div className="h-px bg-neutral-lightGray/60" />

                {/* Price summary skeleton */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-16 bg-neutral-lightGray/30 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-neutral-lightGray/30 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-neutral-lightGray/30 rounded animate-pulse" />
                    <div className="h-4 w-8 bg-neutral-lightGray/30 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-12 bg-neutral-lightGray/40 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-primary-pink/20 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / CTA skeleton */}
            <div className="px-6 pb-6">
              <div className="w-full h-12 bg-gray-300 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionSkeleton;
