"use client";

import React from 'react';

const SeatSelectionSkeleton = () => {
    return (
        <div className="py-8 px-4 lg:px-8 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Seat Map Area */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Timer Skeleton */}
                    <div className="flex items-center justify-end gap-2 mb-4">
                        <div className="h-5 w-20 bg-neutral-lightGray/40 rounded animate-pulse" />
                        <div className="h-7 w-16 bg-neutral-lightGray/40 rounded animate-pulse" />
                    </div>

                    {/* Seat Map Container Skeleton */}
                    <div className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                            {/* Legend Skeleton */}
                            <div className="lg:col-span-1">
                                <div className="rounded-lg border border-neutral-lightGray/40 bg-white p-3 shadow-sm">
                                    <div className="h-4 w-16 bg-neutral-lightGray/40 rounded animate-pulse mb-3" />
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-neutral-lightGray/40 rounded animate-pulse" />
                                                <div className="h-3 w-24 bg-neutral-lightGray/40 rounded animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Seat Map Skeleton */}
                            <div className="lg:col-span-3">
                                <div className="space-y-2.5 overflow-x-auto p-3 bg-neutral-lightGray/5 rounded-xl">
                                    {/* Screen Skeleton */}
                                    <div className="mb-3 text-center">
                                        <div className="h-1.5 w-full bg-neutral-lightGray/40 rounded-full animate-pulse" />
                                        <div className="mt-1.5 h-4 w-24 bg-neutral-lightGray/40 rounded animate-pulse mx-auto" />
                                    </div>

                                    {/* Seat Rows Skeleton */}
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((rowIndex) => (
                                        <div key={rowIndex} className="flex items-center gap-2">
                                            <div className="w-7 h-4 bg-neutral-lightGray/40 rounded animate-pulse shrink-0" />
                                            <div className="flex flex-nowrap items-center gap-0.5">
                                                {Array.from({ length: 12 }).map((_, seatIndex) => (
                                                    <div
                                                        key={seatIndex}
                                                        className="h-8 w-10 bg-neutral-lightGray/40 rounded border border-neutral-lightGray/30 animate-pulse"
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

                {/* Right Column - Booking Summary Skeleton */}
                <div className="">
                    <div className="rounded-xl border border-neutral-lightGray/40 bg-white shadow-xl overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
                        {/* Header Skeleton */}
                        <div className="bg-neutral-lightGray/20 px-5 py-4 flex-shrink-0">
                            <div className="h-5 w-32 bg-neutral-lightGray/40 rounded animate-pulse" />
                        </div>

                        {/* Content Skeleton */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                            {/* User Info Skeleton */}
                            <div className="rounded-lg border border-neutral-lightGray/40 bg-neutral-lightGray/5 px-4 py-3">
                                <div className="h-4 w-32 bg-neutral-lightGray/40 rounded animate-pulse mb-2" />
                                <div className="h-3 w-48 bg-neutral-lightGray/40 rounded animate-pulse" />
                            </div>

                            {/* Movie Title Skeleton */}
                            <div className="h-5 w-40 bg-neutral-lightGray/40 rounded animate-pulse" />

                            {/* Showtime Details Skeleton */}
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-neutral-lightGray/40 rounded animate-pulse shrink-0" />
                                        <div className="h-4 w-48 bg-neutral-lightGray/40 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-neutral-lightGray/40" />

                            {/* Selected Seats Skeleton */}
                            <div>
                                <div className="h-4 w-24 bg-neutral-lightGray/40 rounded animate-pulse mb-2" />
                                <div className="flex flex-wrap gap-1.5">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="h-6 w-12 bg-neutral-lightGray/40 rounded-md animate-pulse"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-neutral-lightGray/40" />

                            {/* Price Summary Skeleton */}
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="h-4 w-24 bg-neutral-lightGray/40 rounded animate-pulse" />
                                        <div className="h-4 w-20 bg-neutral-lightGray/40 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Skeleton */}
                        <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-lightGray/40 bg-white">
                            <div className="h-12 w-full bg-neutral-lightGray/40 rounded-xl animate-pulse" />
                            <div className="h-3 w-32 bg-neutral-lightGray/40 rounded animate-pulse mx-auto mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionSkeleton;