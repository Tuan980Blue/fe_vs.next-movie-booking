"use client"

export default function ConfirmBookingSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(320px,_1fr)]">
            {/* BookingInfoCard Skeleton */}
            <div className="rounded-2xl bg-white shadow-xl ring-1 ring-neutral-lightGray/30 overflow-hidden">
                {/* Header Timer Skeleton */}
                <div className="px-6 py-5 border-b border-neutral-lightGray/30 bg-primary-pink">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
                            <div className="h-3 w-40 bg-white/15 rounded animate-pulse" />
                        </div>
                        <div className="text-right space-y-2">
                            <div className="h-3 w-24 bg-white/15 rounded animate-pulse ml-auto" />
                            <div className="h-8 w-16 bg-white/20 rounded animate-pulse ml-auto" />
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="px-6 py-6 space-y-6">
                    {/* ShowtimeInfoSection Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-neutral-lightGray/40 rounded animate-pulse" />
                        <div className="rounded-xl border border-neutral-lightGray/40 bg-neutral-lightGray/5 p-4 space-y-3">
                            <div className="h-6 w-3/4 bg-neutral-lightGray/40 rounded animate-pulse" />
                            <div className="h-4 w-1/2 bg-neutral-lightGray/30 rounded animate-pulse" />
                            <div className="h-4 w-1/3 bg-neutral-lightGray/30 rounded animate-pulse" />
                            <div className="h-4 w-2/3 bg-neutral-lightGray/30 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* CustomerInfoSection Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-neutral-lightGray/40 rounded animate-pulse" />
                        <div className="rounded-xl border border-neutral-lightGray/40 bg-neutral-lightGray/5 p-4 space-y-2">
                            <div className="h-4 w-1/2 bg-neutral-lightGray/30 rounded animate-pulse" />
                            <div className="h-4 w-2/3 bg-neutral-lightGray/30 rounded animate-pulse" />
                            <div className="h-4 w-1/3 bg-neutral-lightGray/30 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* SeatDetailsSection Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 w-28 bg-neutral-lightGray/40 rounded animate-pulse" />
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="rounded-xl border border-neutral-lightGray/40 bg-neutral-lightGray/5 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-1/3 bg-neutral-lightGray/30 rounded animate-pulse" />
                                            <div className="h-3 w-1/4 bg-neutral-lightGray/25 rounded animate-pulse" />
                                        </div>
                                        <div className="h-4 w-20 bg-neutral-lightGray/30 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Combo Section Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 w-40 bg-neutral-lightGray/40 rounded animate-pulse" />
                        <div className="rounded-xl border border-dashed border-neutral-lightGray/70 bg-neutral-lightGray/10 p-4">
                            <div className="h-4 w-full bg-neutral-lightGray/20 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Notes Section Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-neutral-lightGray/40 rounded animate-pulse" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-4 w-full bg-neutral-lightGray/20 rounded animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PaymentSummary Skeleton */}
            <aside className="lg:sticky lg:top-22 rounded-2xl bg-white shadow-xl ring-1 ring-neutral-lightGray/30 overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                    {/* Coupon Button Skeleton */}
                    <div className="h-12 w-full bg-neutral-lightGray/30 rounded-xl animate-pulse" />

                    {/* Total Amount Skeleton */}
                    <div className="text-right space-y-2">
                        <div className="h-4 w-20 bg-neutral-lightGray/30 rounded animate-pulse ml-auto" />
                        <div className="h-10 w-48 bg-neutral-lightGray/40 rounded animate-pulse ml-auto" />
                        <div className="h-3 w-32 bg-neutral-lightGray/25 rounded animate-pulse ml-auto" />
                    </div>

                    {/* Loyalty Points Box Skeleton */}
                    <div className="rounded-xl border border-neutral-lightGray/40 p-4 space-y-2">
                        <div className="h-4 w-3/4 bg-neutral-lightGray/30 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-neutral-lightGray/25 rounded animate-pulse" />
                        <div className="h-3 w-2/3 bg-neutral-lightGray/20 rounded animate-pulse" />
                    </div>

                    {/* Payment Method Selector Skeleton */}
                    <div className="space-y-3">
                        <div className="h-4 w-48 bg-neutral-lightGray/40 rounded animate-pulse" />
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="rounded-xl border border-neutral-lightGray/60 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 bg-neutral-lightGray/30 rounded-full animate-pulse" />
                                        <div className="space-y-1 flex-1">
                                            <div className="h-4 w-32 bg-neutral-lightGray/30 rounded animate-pulse" />
                                            <div className="h-3 w-40 bg-neutral-lightGray/25 rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Terms Skeleton */}
                    <div className="rounded-xl border border-neutral-lightGray/60 bg-neutral-lightGray/10 p-4 space-y-2">
                        <div className="h-4 w-3/4 bg-neutral-lightGray/30 rounded animate-pulse" />
                        <div className="h-3 w-full bg-neutral-lightGray/20 rounded animate-pulse" />
                        <div className="h-3 w-5/6 bg-neutral-lightGray/20 rounded animate-pulse" />
                    </div>
                </div>

                {/* Submit Button Skeleton */}
                <div className="flex-shrink-0 p-4 md:p-6 border-t border-neutral-lightGray/40 bg-white">
                    <div className="h-12 w-full bg-neutral-lightGray/30 rounded-xl animate-pulse" />
                </div>
            </aside>
        </div>
    );
}

