"use client"

import {motion} from "framer-motion";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

export default function BookingLayout({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const path = pathname || '';
    const step = path.includes('/complete') ? 3 : path.includes('/payment') ? 2 : 1;

    const steps = [
        {id: 1, label: 'Chọn ghế', icon: '🎫'},
        {id: 2, label: 'Thanh toán', icon: '💳'},
        {id: 3, label: 'Hoàn tất', icon: '✅'},
    ];

    return (
        <div className="min-h-screen bg-gray-800">
            {/* Header */}
            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back button */}
                        <motion.button
                            type="button"
                            onClick={() => router.back()}
                            className="group inline-flex items-center gap-3 text-neutral-white/90 hover:text-white transition-all duration-300"
                            aria-label="Quay lại"
                            title="Quay lại"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 group-hover:bg-white/20 transition-all duration-300">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                     className="group-hover:-translate-x-0.5 transition-transform duration-300">
                                    <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="hidden sm:inline text-sm font-semibold">Quay lại</span>
                        </motion.button>

                        {/* Center: Progress steps */}
                        <div className="flex-1 px-6">
                            <div className="mx-auto max-w-2xl">
                                {/* Progress Bar */}
                                <div className="relative">
                                    {/* Background line */}
                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 rounded-full -translate-y-1/2"></div>
                                    
                                    {/* Progress line */}
                                    <motion.div
                                        className="absolute top-1/2 left-0 h-1 bg-cinema-neonPink rounded-full -translate-y-1/2"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                    />
                                    
                                    {/* Steps */}
                                    <div className="relative flex justify-between">
                                        {steps.map((s, index) => {
                                            const isActive = s.id === step;
                                            const isDone = s.id < step;
                                            const isUpcoming = s.id > step;
                                            
                                            return (
                                                <motion.div
                                                    key={s.id}
                                                    className="flex flex-col items-center"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.2 }}
                                                >
                                                    {/* Step Circle */}
                                                    <motion.div
                                                        className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                                                            isActive
                                                                ? 'bg-primary-pink text-white shadow-2xl shadow-primary-pink/40 scale-110'
                                                                : isDone
                                                                    ? 'bg-primary-pink text-white shadow-lg'
                                                                    : 'bg-white/20 text-white/60 backdrop-blur-sm'
                                                        }`}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {isDone ? (
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        ) : (
                                                            <span className="text-lg">{s.icon}</span>
                                                        )}
                                                        
                                                        {/* Pulse effect for active step */}
                                                        {isActive && (
                                                            <motion.div
                                                                className="absolute inset-0 rounded-full bg-primary-pink/30"
                                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                            />
                                                        )}
                                                    </motion.div>
                                                    
                                                    {/* Step Label */}
                                                    <motion.div
                                                        className="mt-3 text-center"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: index * 0.2 + 0.3 }}
                                                    >
                                                        <div className={`text-xs font-semibold transition-colors duration-300 ${
                                                            isActive ? 'text-white' : isDone ? 'text-white/90' : 'text-white/60'
                                                        }`}>
                                                            {s.label}
                                                        </div>
                                                        <div className={`text-xs mt-1 transition-colors duration-300 ${
                                                            isActive ? 'text-white/80' : 'text-white/50'
                                                        }`}>
                                                            Bước {s.id}
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Logo */}
                        <Link href="/" className="inline-flex items-center" aria-label="Trang chủ">
                            <motion.div
                                className="flex items-center space-x-2 lg:space-x-3"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full overflow-hidden shadow-2xl ring-2 ring-white/20">
                                    <img
                                        src="/logo.png"
                                        alt="TA MEM CINEMA Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-primary-pink font-bold text-lg lg:text-xl drop-shadow-lg">TA MEM</div>
                                    <div className="text-primary-purple font-semibold text-sm -mt-1 drop-shadow-lg">CINEMA</div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
