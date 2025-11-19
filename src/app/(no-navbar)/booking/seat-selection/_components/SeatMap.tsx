"use client";

import { motion } from "framer-motion";
import type { SeatLayoutUi, SeatUi } from "@/models/seat";
import SeatButton from "./SeatButton";

type SeatMapProps = {
    layout: SeatLayoutUi;
    selectedSeatIds: string[];
    lockedSeatIds: Set<string>;
    bookedSeatIds: Set<string>;
    getSeatColorByType: (type: string | number) => string;
    isSelected: (id: string) => boolean;
    isSeatActive: (seat: SeatUi) => boolean;
    toggleSeat: (seat: SeatUi) => void;
};

export default function SeatMap({
    layout,
    selectedSeatIds,
    lockedSeatIds,
    bookedSeatIds,
    getSeatColorByType,
    isSelected,
    isSeatActive,
    toggleSeat,
}: SeatMapProps) {
    const unit = 40;

    return (
        <div className="space-y-2.5 overflow-x-auto p-3 bg-neutral-lightGray/5 rounded-xl">
            {/* Screen */}
            <div className="mb-3 text-center">
                <div className="relative">
                    <div className="h-1.5 w-full bg-gradient-to-r from-neutral-lightGray to-neutral-lightGray/60 rounded-full" />
                </div>
                <div className="mt-1.5">
                    <span className="text-sm font-bold text-neutral-darkGray">🎬 MÀN HÌNH</span>
                </div>
            </div>

            {/* Seat Rows */}
            {layout.rows.map((row, rowIndex) => {
                const sorted = [...row.seats].sort((a, b) => (a.positionX ?? 0) - (b.positionX ?? 0));
                let cursorX = 0;

                return (
                    <motion.div
                        key={row.rowLabel}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowIndex * 0.05 }}
                    >
                        <div className="w-7 text-xs font-bold text-neutral-darkGray text-right shrink-0">
                            {row.rowLabel}
                        </div>
                        <div className="flex flex-nowrap items-center gap-0.5">
                            {sorted.map((s) => {
                                const elements = [];
                                const startX = s.positionX ?? 0;
                                
                                // Add spacer if needed
                                if (startX > cursorX) {
                                    const spacerWidth = Math.max(0, startX - cursorX);
                                    elements.push(
                                        <div
                                            key={`spacer-${row.rowLabel}-${cursorX}`}
                                            style={{ width: spacerWidth, height: 0 }}
                                        />
                                    );
                                    cursorX = startX;
                                }

                                const isCouple = String(s.seatType).toLowerCase() === "couple";
                                const width = isCouple ? unit * 2 : unit;
                                const selected = isSelected(s.id);
                                const locked = lockedSeatIds.has(s.id);
                                const booked = bookedSeatIds.has(s.id);
                                const baseColor = getSeatColorByType(s.seatType);
                                const isDisabled = locked || booked || !isSeatActive(s);

                                elements.push(
                                    <SeatButton
                                        key={s.id}
                                        seat={s}
                                        isSelected={selected}
                                        isLocked={locked}
                                        isBooked={booked}
                                        isDisabled={isDisabled}
                                        baseColor={baseColor}
                                        width={width}
                                        onClick={() => toggleSeat(s)}
                                    />
                                );
                                cursorX += width;

                                return elements;
                            }).flat()}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

