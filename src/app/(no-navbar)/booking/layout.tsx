"use client"

import StepsHeader from "@/app/(no-navbar)/booking/_components/StepsHeader";

export default function BookingLayout({children}: { children: React.ReactNode }) {


    return (
        <div className="min-h-screen bg-pink-50">
            {/* Header */}
            <StepsHeader/>

            {/* Content */}
            <div className="mt-16">
                {children}
            </div>
        </div>
    );
}
