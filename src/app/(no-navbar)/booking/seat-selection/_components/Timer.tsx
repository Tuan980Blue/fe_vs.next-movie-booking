"use client";

import { motion } from "framer-motion";

type TimerProps = {
    secondsLeft: number;
};

export default function Timer({ secondsLeft }: TimerProps) {
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");

    const getColor = () => {
        if (secondsLeft <= 60) return "text-accent-red";
        if (secondsLeft <= 120) return "text-accent-yellow";
        return "text-primary-pink";
    };

    const shouldPulse = secondsLeft <= 60;

    return (
        <div className="flex items-center justify-end gap-2 mb-4">
            <span className="text-sm text-neutral-darkGray/70 font-medium">Giữ chỗ còn</span>
            <motion.div
                className={`inline-flex items-center font-bold text-lg tabular-nums ${getColor()}`}
                animate={shouldPulse ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: shouldPulse ? Infinity : 0 }}
            >
                {minutes}:{seconds}
            </motion.div>
        </div>
    );
}

