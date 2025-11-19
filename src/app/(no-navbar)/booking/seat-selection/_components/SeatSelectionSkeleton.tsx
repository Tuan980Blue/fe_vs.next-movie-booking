import React from 'react';

const SeatSelectionSkeleton = () => {
    return (
        <div className="py-8 px-4 lg:px-8 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Seat map skeleton */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Timer skeleton */}
                    <div className="flex items-center justify-end gap-2">
                        <div className="h-5 w-20 bg-neutral-lightGray/30 rounded animate-pulse"></div>
                        <div className="h-6 w-16 bg-primary-pink/30 rounded animate-pulse"></div>
                    </div>

                    {/* Seat Selection Area Skeleton */}
                    <div className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                            {/* Legend Skeleton */}
                            <div className="lg:col-span-1">
                                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-4">
                                    <div className="h-5 w-28 bg-neutral-lightGray/30 rounded animate-pulse mb-4"></div>
                                    <div className="space-y-2.5">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-md bg-neutral-lightGray/40 animate-pulse"></div>
                                                <div className="h-3 w-24 bg-neutral-lightGray/30 rounded animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Screen + Seat Grid Skeleton */}
                            <div className="lg:col-span-3">
                                <div className="mb-4 text-center">
                                    <div className="h-2 w-full bg-neutral-lightGray/40 rounded-full animate-pulse"></div>
                                    <div className="mt-2 h-5 w-32 bg-neutral-lightGray/30 rounded animate-pulse mx-auto"></div>
                                </div>
                                <div className="space-y-3 p-4 bg-neutral-lightGray/5 rounded-xl">
                                    {Array.from({ length: 8 }).map((_, rowIndex) => (
                                        <div key={rowIndex} className="flex items-center gap-2">
                                            <div className="w-8 h-4 bg-neutral-lightGray/30 rounded animate-pulse"></div>
                                            <div className="flex flex-nowrap items-center gap-1">
                                                {Array.from({ length: 12 }).map((_, seatIndex) => (
                                                    <div
                                                        key={seatIndex}
                                                        className="h-9 w-11 rounded-md border border-neutral-lightGray/30 bg-neutral-lightGray/40 animate-pulse"
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

                {/* Right: Booking summary skeleton */}
                <div className="lg:sticky lg:top-6">
                    <div className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-xl overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
                        {/* Header Skeleton */}
                        <div className="bg-primary-pink px-5 py-4 flex-shrink-0">
                            <div className="h-6 w-32 bg-white/30 rounded animate-pulse"></div>
                        </div>

                        {/* Body Skeleton */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                            <div className="rounded-lg border border-neutral-lightGray/40 bg-neutral-lightGray/5 px-4 py-3">
                                <div className="h-4 w-40 bg-neutral-lightGray/40 rounded animate-pulse mb-1"></div>
                                <div className="h-3 w-32 bg-neutral-lightGray/30 rounded animate-pulse"></div>
                            </div>
                            <div className="h-6 w-48 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                            <div className="space-y-2">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-primary-pink/30 rounded animate-pulse"></div>
                                        <div className="h-4 w-32 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-px bg-neutral-lightGray/40" />
                            <div className="h-4 w-24 bg-neutral-lightGray/40 rounded animate-pulse mb-2"></div>
                            <div className="flex flex-wrap gap-1.5">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="h-6 w-12 bg-primary-pink/20 rounded-md animate-pulse"></div>
                                ))}
                            </div>
                            <div className="h-px bg-neutral-lightGray/40" />
                            <div className="space-y-2">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="h-4 w-20 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                                        <div className="h-4 w-24 bg-neutral-lightGray/40 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Skeleton */}
                        <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-lightGray/40 bg-white">
                            <div className="w-full h-12 bg-primary-pink/30 rounded-xl animate-pulse"></div>
                            <div className="mt-2 h-3 w-32 bg-neutral-lightGray/30 rounded animate-pulse mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionSkeleton;