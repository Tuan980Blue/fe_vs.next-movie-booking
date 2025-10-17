"use client"

import StepsHeader from "@/app/(no-navbar)/booking/_components/StepsHeader";

export default function BookingLayout({children}: { children: React.ReactNode }) {


    return (
        <div className="min-h-screen bg-pink-50">
            {/* Header */}
            <div className="relative z-10">
                <StepsHeader/>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
