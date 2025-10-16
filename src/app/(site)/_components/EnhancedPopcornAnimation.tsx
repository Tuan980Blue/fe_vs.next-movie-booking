"use client";

import {useMemo} from 'react';
import {motion} from 'framer-motion';

const EnhancedPopcornAnimation = () => {
    // Tạo array các items với các icon khác nhau
    const items: { icon: string; weight: number }[] = [
        {icon: '🍿', weight: 0.4}, // Popcorn - nhiều nhất
        {icon: '🎬', weight: 0.2}, // Film reel
        {icon: '⭐', weight: 0.2}, // Star
        {icon: '🎭', weight: 0.1}, // Theater masks
        {icon: '🎪', weight: 0.1}, // Circus tent
    ];
    // Seeded RNG to keep SSR and CSR deterministic
    const createRng = (seed: number): (() => number) => {
        let t = seed >>> 0;
        return () => {
            t += 0x6D2B79F5;
            let r = Math.imul(t ^ (t >>> 15), 1 | t);
            r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
            return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
    };

    // Tạo array các items với tỷ lệ theo weight (memoized)
    const allItems = useMemo<string[]>(() => {
        console.log("Tính toán lại 1");
        const arr: string[] = [];
        const baseCount = 20; // fixed for deterministic SSR/CSR
        items.forEach(item => {
            const count = Math.floor(item.weight * baseCount);
            for (let i = 0; i < count; i++) arr.push(item.icon);
        });
        console.log("Tính toán lại 2");
        return arr;
    }, [items]);

    // Tạo array các popcorn với vị trí và thời gian rơi khác nhau (memoized)
    type PopcornItem = {
        id: number;
        delay: number;
        duration: number;
        x: number;
        size: number;
        rotation: number;
        icon: string;
        opacity: number;
    };

    const popcornItems = useMemo<PopcornItem[]>(() => {
        const len = 24; // fixed for deterministic SSR/CSR
        const rng = createRng(123456789);
        return Array.from({length: len}, (_, i): PopcornItem => {
            const delay = rng() * 8;
            const duration = 4 + rng() * 6;
            const x = rng() * 100;
            const size = 1.1 + rng() * 1.2;
            const rotation = rng() * 720;
            const icon = allItems[Math.floor(rng() * allItems.length)];
            const opacity = 0.3 + rng() * 0.4;
            return {id: i, delay, duration, x, size, rotation, icon, opacity};
        });
    }, [allItems]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {popcornItems.map((item) => (
                <motion.div
                    key={item.id}
                    className="absolute"
                    style={{
                        left: `${item.x}%`,
                        top: '-100px',
                        fontSize: `${item.size}em`,
                        opacity: item.opacity,
                        willChange: 'transform, opacity',
                    }}
                    initial={{
                        y: -100,
                        rotate: item.rotation,
                        scale: 0.5
                    }}
                    animate={{
                        y: '110vh',
                        rotate: item.rotation + 720, // Xoay 2 vòng khi rơi
                        scale: 1,
                    }}
                    transition={{
                        duration: item.duration,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {item.icon}
                </motion.div>
            ))}
        </div>
    );
};

export default EnhancedPopcornAnimation;
