"use client";

import { motion } from 'framer-motion';
import Link from "next/link";
import { COLORS } from "@/lib/theme/colors";

const HeroSection = () => {
    // Mock movie data for slices
    const movieSlices = [
        {
            id: 1,
            title: "Avengers: Endgamer",
            image: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
            genre: "Kinh Dị, Hành Động",
            year: "2025"
        },
        {
            id: 2,
            title: "Kỵ Sĩ Bóng Đêm",
            image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            genre: "Hành Động, Hài Hước",
            year: "2025"
        },
        {
            id: 3,
            title: "Ma Trận",
            image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            genre: "Hành Động, Bi Kịch",
            year: "2025"
        }
    ];

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Movie Image Slices */}
            <div className="absolute inset-0 flex">
                {movieSlices.map((movie, index) => (
                    <motion.div
                        key={movie.id}
                        className="relative flex-1 h-full"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                    >
                        {/* Movie Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${movie.image})`
                            }}
                        />

                        {/* Slice Overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(135deg, ${COLORS.PRIMARY.PURPLE}${index === 0 ? '80' : index === 1 ? '60' : '40'}, ${COLORS.CINEMA.NAVY}${index === 0 ? '60' : index === 1 ? '40' : '20'})`
                            }}
                        />

                        {/* Movie Info Overlay */}
                        <div className="absolute bottom-8 left-8 right-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                                className="text-white"
                            >
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                                    {movie.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm md:text-base opacity-90">
                                    <span>{movie.genre}</span>
                                    <span>•</span>
                                    <span>{movie.year}</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Slice Number Indicator */}
                        <div className="absolute top-8 right-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: `${COLORS.PRIMARY.PINK}80` }}
                            >
                                {index + 1}
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Floating Cinema Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-20 text-4xl md:text-6xl opacity-30"
                    style={{ color: COLORS.ACCENT.YELLOW }}
                >
                    🍿
                </motion.div>

                <motion.div
                    animate={{
                        x: [0, 15, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-32 right-32 text-3xl md:text-5xl opacity-25"
                    style={{ color: COLORS.CINEMA.NEON_BLUE }}
                >
                    ⭐
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -8, 0]
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-32 left-1/4 text-5xl md:text-7xl opacity-20"
                    style={{ color: COLORS.CINEMA.NEON_PINK }}
                >
                    🎬
                </motion.div>

                <motion.div
                    animate={{
                        x: [0, -20, 0],
                        y: [0, 15, 0]
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-20 right-20 text-4xl md:text-6xl opacity-25"
                    style={{ color: COLORS.ACCENT.YELLOW }}
                >
                    🎟️
                </motion.div>
            </div>

            {/* Main Content Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center px-4 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Logo/Brand */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="mb-8"
                        >
                            <div
                                className="inline-block px-8 py-6 rounded-2xl backdrop-blur-md border shadow-2xl"
                                style={{
                                    backgroundColor: `${COLORS.PRIMARY.BLACK}60`,
                                    borderColor: `${COLORS.NEUTRAL.WHITE}40`
                                }}
                            >
                                <h1
                                    className="text-4xl md:text-6xl lg:text-8xl font-bold"
                                    style={{ color: COLORS.NEUTRAL.WHITE }}
                                >
                                    🎬 TA MEM CINEMA
                                </h1>
                            </div>
                        </motion.div>

                        {/* Subtitle */}
                        <motion.p
                            className="text-lg md:text-xl lg:text-2xl mb-8 font-light max-w-4xl mx-auto"
                            style={{ color: COLORS.NEUTRAL.WHITE, opacity: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Trải nghiệm điện ảnh tuyệt vời nhất với công nghệ hiện đại
                        </motion.p>

                        {/* Feature Pills */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            {[
                                { icon: "🎭", text: "4K Ultra HD" },
                                { icon: "🔊", text: "Dolby Atmos" },
                                { icon: "🍿", text: "Combo hấp dẫn" },
                                { icon: "🎪", text: "Trải nghiệm VIP" }
                            ].map((feature, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                    className="px-4 py-2 md:px-6 md:py-3 rounded-full border backdrop-blur-md text-sm md:text-base shadow-lg"
                                    style={{
                                        backgroundColor: `${COLORS.PRIMARY.BLACK}40`,
                                        borderColor: `${COLORS.NEUTRAL.WHITE}50`,
                                        color: COLORS.NEUTRAL.WHITE
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor: `${COLORS.PRIMARY.PINK}60`
                                    }}
                                >
                                    <span className="mr-2">{feature.icon}</span>
                                    {feature.text}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.0 }}
                        >
                            <Link href="/movies" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: `0 20px 40px ${COLORS.PRIMARY.PINK}60`
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-full text-lg md:text-xl font-bold transition-all duration-300 shadow-2xl overflow-hidden backdrop-blur-sm"
                                    style={{
                                        backgroundColor: `${COLORS.PRIMARY.PINK}90`,
                                        color: COLORS.NEUTRAL.WHITE,
                                        border: `2px solid ${COLORS.NEUTRAL.WHITE}30`
                                    }}
                                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🎫 Mua vé ngay
                    <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                                        style={{ backgroundColor: COLORS.CINEMA.NEON_PINK }}
                                    ></div>
                                </motion.button>
                            </Link>

                            <Link href="/showtimes" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: `0 20px 40px ${COLORS.ACCENT.ORANGE}60`
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-full text-lg md:text-xl font-bold transition-all duration-300 shadow-2xl overflow-hidden backdrop-blur-sm border"
                                    style={{
                                        backgroundColor: `${COLORS.NEUTRAL.WHITE}90`,
                                        color: COLORS.NEUTRAL.WHITE,
                                        borderColor: `${COLORS.NEUTRAL.WHITE}40`
                                    }}
                                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    📅 Lịch chiếu
                    <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                      📅
                    </motion.span>
                  </span>
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                                        style={{ backgroundColor: COLORS.ACCENT.YELLOW }}
                                    ></div>
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div
                            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                        >
                            {[
                                { number: "10+", label: "Phim mỗi tháng" },
                                { number: "8", label: "Phòng chiếu" },
                                { number: "1000+", label: "Ghế ngồi" },
                                { number: "24/7", label: "Hỗ trợ" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                                    className="text-center p-4 rounded-xl backdrop-blur-md border shadow-lg"
                                    style={{
                                        backgroundColor: `${COLORS.PRIMARY.BLACK}40`,
                                        borderColor: `${COLORS.NEUTRAL.WHITE}30`
                                    }}
                                >
                                    <div
                                        className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
                                        style={{ color: COLORS.ACCENT.YELLOW }}
                                    >
                                        {stat.number}
                                    </div>
                                    <div
                                        className="text-sm md:text-base"
                                        style={{ color: COLORS.NEUTRAL.WHITE, opacity: 0.9 }}
                                    >
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
