"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-neutral-black via-cinema-navy to-neutral-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
            
            {/* Animated Background Elements */}
            <motion.div
                className="absolute top-20 left-20 w-2 h-2 bg-primary-pink rounded-full"
                animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
                className="absolute top-40 right-32 w-1 h-1 bg-accent-yellow rounded-full"
                animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
                className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-cinema-neonBlue rounded-full"
                animate={{ 
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 0.9, 0.4]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            />

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="z-10 max-w-2xl mx-auto"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="relative">
                        <div className="text-8xl mb-4">🚫</div>
                        <motion.div
                            className="absolute -top-2 -right-2 w-6 h-6 bg-accent-red rounded-full flex items-center justify-center"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-white text-xs font-bold">!</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Error Code */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-6"
                >
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-pink via-accent-orange to-accent-yellow mb-4 drop-shadow-2xl">
                        403
                    </h1>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Truy cập bị từ chối
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary-pink to-accent-orange mx-auto rounded-full"></div>
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mb-12"
                >
                    <p className="text-neutral-lightGray text-lg leading-relaxed mb-4">
                        Rất tiếc, bạn không có quyền truy cập vào trang này.
                    </p>
                    <p className="text-white/80 text-base">
                        Hãy thử quay lại trang chủ hoặc đăng nhập bằng tài khoản có quyền phù hợp.
                    </p>
                </motion.div>

                {/* Countdown Timer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mb-8"
                >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
                        <p className="text-white/70 text-sm mb-3">Tự động chuyển hướng sau:</p>
                        <div className="flex items-center justify-center gap-2">
                            <motion.div
                                key={countdown}
                                initial={{ scale: 1.2, color: "#ec4899" }}
                                animate={{ scale: 1, color: "#ffffff" }}
                                transition={{ duration: 0.3 }}
                                className="text-3xl font-bold text-white"
                            >
                                {countdown}
                            </motion.div>
                            <span className="text-white/60 text-lg">giây</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mt-4">
                            <motion.div
                                className="bg-gradient-to-r from-primary-pink to-accent-orange h-2 rounded-full"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 10, ease: "linear" }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="flex flex-col sm:flex-row items-center gap-4 justify-center"
                >
                    <Link href="/">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-primary-pink to-cinema-neonPink text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <span className="text-xl">🎬</span>
                            <span>Về trang chủ</span>
                        </motion.button>
                    </Link>
                    
                    <Link href="/auth">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
                        >
                            <span className="text-xl">🔐</span>
                            <span>Đăng nhập khác</span>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Additional Help */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="mt-12 text-center"
                >
                    <p className="text-white/50 text-sm">
                        Cần hỗ trợ? Liên hệ với chúng tôi tại{" "}
                        <span className="text-primary-pink hover:underline cursor-pointer">
                            support@moviebooking.com
                        </span>
                    </p>
                </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
            >
                <p className="text-white/30 text-xs">
                    © 2024 TA MEM CINEMA. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
