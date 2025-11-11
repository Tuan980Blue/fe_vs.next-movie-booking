"use client"

import { Suspense } from "react";
import SeatSelectionSkeleton from "@/app/(no-navbar)/booking/seat-selection/_components/SeatSelectionSkeleton";
import SeatSelectionContent from "@/app/(no-navbar)/booking/seat-selection/_components/SeatSelectionContent";

const SeatSelectionPage = () => {
    return (
        <Suspense fallback={<SeatSelectionSkeleton/>}>
            <SeatSelectionContent/>
        </Suspense>
    );
};

export default SeatSelectionPage;
