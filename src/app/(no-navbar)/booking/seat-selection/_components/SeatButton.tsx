"use client";

import { motion } from "framer-motion";
import type { SeatUi } from "@/models/seat";

type SeatButtonProps = {
    seat: SeatUi;
    isSelected: boolean;
    isLocked: boolean;
    isBooked: boolean;
    isDisabled: boolean;
    baseColor: string;
    width: number;
    onClick: () => void;
};

export default function SeatButton({
    seat,
    isSelected,
    isLocked,
    isBooked,
    isDisabled,
    baseColor,
    width,
    onClick,
}: SeatButtonProps) {
    // Priority: booked (red) > locked (green) > selected (yellow) > base
    const bg = isBooked
        ? "#EF4444"
        : isLocked
            ? "#22C55E"
            : isSelected
                ? "#FACC15"
                : baseColor;
    const textColor = isSelected ? "#1F2937" : "#fff";
    const borderColor = isSelected ? "#FACC15" : "rgba(156, 163, 175, 0.3)";

    return (
        <motion.button
            type="button"
            onClick={onClick}
            className={`h-8 rounded border flex items-center justify-center text-xs font-bold focus:outline-none transition-all duration-200 ${
                isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
            title={`${seat.rowLabel}${seat.seatNumber} • ${seat.seatType}`}
            aria-label={`${seat.rowLabel}${String(seat.seatNumber).padStart(2, "0")} ${seat.seatType}`}
            style={{
                backgroundColor: bg,
                color: textColor,
                width,
                borderColor,
                borderWidth: "1px",
            }}
            disabled={isDisabled}
            whileHover={!isDisabled ? { backgroundColor: "#FACC15", color: "#1F2937" } : {}}
            transition={{ duration: 0.2 }}
        >
            {seat.seatNumber}
        </motion.button>
    );
}

