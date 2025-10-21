import React from 'react';

const SeatSelectionSkeleton = () => {
    return (
        <div className="py-4 px-4 lg:px-8 min-h-screen">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Seat map skeleton */}
                <div className="lg:col-span-2">
                    {/* Countdown timer skeleton */}
                    <div className="flex item-end justify-between gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-xs text-gray-800/80 font-medium">Giữ chỗ còn</div>
                            <div className="inline-flex items-center">
                                <div className="h-8 w-16 bg-pink-500/30 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Seat Selection Area Skeleton */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Legend Skeleton */}
                            <div className="lg:col-span-1">
                                <div className="bg-gradient-to-br from-neutral-lightGray/10 to-neutral-lightGray/5 rounded-xl p-4 border border-neutral-lightGray/20">
                                    <div className="text-sm font-bold text-neutral-darkGray mb-4 flex items-center gap-2">
                                        <span className="text-lg">🎫</span>
                                        Chú thích ghế
                                    </div>
                                    <div className="space-y-3 text-sm text-neutral-darkGray">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-md bg-neutral-lightGray/60 animate-pulse"></div>
                                                <div className="h-4 w-24 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Screen + Seat Grid Skeleton */}
                            <div className="lg:col-span-3">
                                <div className="flex justify-center">
                                    <div className="max-w-full">
                                        {/* Screen Skeleton */}
                                        <div className="mb-2 text-center">
                                            <div className="relative">
                                                <div className="h-3 w-full bg-gradient-to-r from-neutral-lightGray/60 to-neutral-lightGray/40 rounded-full shadow-lg animate-pulse"></div>
                                            </div>
                                            <div className="mt-3 text-center">
                                                <div className="h-6 w-32 bg-neutral-lightGray/40 rounded animate-pulse mx-auto"></div>
                                            </div>
                                        </div>

                                        {/* Seat Grid Skeleton */}
                                        <div className="space-y-4 overflow-x-auto p-4 bg-gradient-to-br from-neutral-lightGray/5 to-neutral-lightGray/10 rounded-xl">
                                            {Array.from({ length: 8 }).map((_, rowIndex) => (
                                                <div key={rowIndex} className="flex items-center gap-3">
                                                    {/* Row Label */}
                                                    <div className="w-8 text-sm font-bold text-neutral-darkGray text-right">
                                                        <div className="h-4 w-6 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                                                    </div>
                                                    
                                                    {/* Seats */}
                                                    <div className="flex flex-nowrap items-center gap-1">
                                                        {Array.from({ length: 12 }).map((_, seatIndex) => (
                                                            <div
                                                                key={seatIndex}
                                                                className="h-10 w-12 rounded-lg border-2 border-neutral-lightGray/30 bg-neutral-lightGray/40 animate-pulse"
                                                            ></div>
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
                <div className="lg:sticky h-fit">
                    <div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20 overflow-hidden">
                        {/* Header Skeleton */}
                        <div className="bg-primary-pink px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                        <div className="w-5 h-5 bg-white/40 rounded animate-pulse"></div>
                                    </div>
                                    <div className="h-6 w-32 bg-white/30 rounded animate-pulse"></div>
                                </div>
                                <div className="text-white/90 text-2xl">🎟️</div>
                            </div>
                        </div>

                        {/* Body Skeleton */}
                        <div className="px-6 py-2">
                            {/* User Info Skeleton */}
                            <div className="mb-4 rounded-xl bg-neutral-lightGray/30 ring-1 ring-neutral-lightGray/60 px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-neutral-darkGray">
                                        <div className="h-4 w-40 bg-neutral-lightGray/40 rounded animate-pulse mb-1"></div>
                                        <div className="h-3 w-32 bg-neutral-lightGray/30 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-neutral-darkGray">
                                {/* Movie Title Skeleton */}
                                <div>
                                    <div className="h-6 w-48 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                                </div>

                                {/* Showtime Details Skeleton */}
                                <div className="grid grid-cols-1 gap-3 text-sm">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-primary-pink/30 rounded animate-pulse"></div>
                                            <div className="h-4 w-32 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px bg-neutral-lightGray/60"/>

                                {/* Selected Seats Skeleton */}
                                <div className="text-sm">
                                    <div className="h-4 w-24 bg-neutral-lightGray/40 rounded animate-pulse mb-2"></div>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="h-6 w-12 bg-primary-pink/20 rounded-md animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-neutral-lightGray/60"/>

                                {/* Price Calculation Skeleton */}
                                <div className="space-y-2 text-sm">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="h-4 w-16 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                                            <div className="h-4 w-20 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer / CTA Skeleton */}
                        <div className="px-6 pb-6">
                            <div className="w-full h-12 bg-primary-pink/30 rounded-xl animate-pulse"></div>
                            <div className="mt-3 text-center">
                                <div className="h-3 w-32 bg-neutral-lightGray/30 rounded animate-pulse mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionSkeleton;