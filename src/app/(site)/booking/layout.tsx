
"use client"
import {motion} from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const path = pathname || '';
    const step = path.includes('/complete') ? 3 : path.includes('/payment') ? 2 : 1;

    const steps = [
        { id: 1, label: 'Chọn ghế' },
        { id: 2, label: 'Xác thực & Thanh toán' },
        { id: 3, label: 'Hoàn tất' },
    ];

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 mb-2">
                <div className="flex items-center justify-between">
                    {/* Left: Back button */}
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="group inline-flex items-center gap-2 text-neutral-white/90 hover:text-white transition-colors"
                        aria-label="Quay lại"
                        title="Quay lại"
                    >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 group-hover:bg-white/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-0 group-hover:-translate-x-0.5 transition-transform">
                <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
                        <span className="hidden sm:inline text-sm font-medium">Quay lại</span>
                    </button>

                    {/* Center: Progress steps */}
                    <div className="flex-1 px-4">
                        <div className="mx-auto max-w-2xl">
                            {/* Row 1: circles and connector line - use shared 3-col grid for perfect alignment */}
                            {(() => {
                                const sidePct = 100 / (steps.length * 2); // e.g. 16.6667% for 3 steps
                                const ratio = (step - 1) / (steps.length - 1);
                                return (
                                    <div className="relative h-12 grid grid-cols-3 place-items-center">
                                        <div
                                            className="pointer-events-none absolute top-1/2 z-0 h-[3px] -translate-y-1/2 bg-white/25 rounded-full"
                                            style={{ left: `${sidePct}%`, right: `${sidePct}%` }}
                                        />
                                        <div
                                            className="pointer-events-none absolute left-0 top-1/2 z-0 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-primary-pink to-pink-400 transition-[width] duration-300"
                                            style={{ left: `${sidePct}%`, width: `calc(${ratio} * (100% - ${sidePct * 2}%))` }}
                                        />
                                        {steps.map((s) => {
                                            const isActive = s.id === step;
                                            const isDone = s.id < step;
                                            return (
                                                <span
                                                    key={s.id}
                                                    className={
                                                        `relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ` +
                                                        (isActive
                                                            ? 'bg-primary-pink text-white shadow-lg shadow-primary-pink/30'
                                                            : isDone
                                                                ? 'bg-white text-neutral-darkGray'
                                                                : 'bg-white/40 text-neutral-darkGray')
                                                    }
                                                >
                          {s.id}
                        </span>
                                            );
                                        })}
                                    </div>
                                );
                            })()}

                            {/* Row 2: labels - same 3-col grid to align under circles */}
                            <div className="mt-2 grid grid-cols-3">
                                {steps.map((s) => {
                                    const isActive = s.id === step;
                                    return (
                                        <div key={s.id} className="text-center">
                                            <span className={`text-xs ${isActive ? 'text-white font-semibold' : 'text-neutral-white/80'}`}>{s.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Logo */}
                    <Link href="/" className="inline-flex items-center" aria-label="Trang chủ">
                        <motion.div
                            className="flex items-center space-x-1 lg:space-x-3"
                        >
                            <div className="w-4 h-4 lg:w-12 lg:h-12 rounded-full overflow-hidden shadow-lg">
                                <img
                                    src="/logo.png"
                                    alt="TA MEM CINEMA Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="text-primary-pink font-bold text-sm lg:text-lg">TA MEM</div>
                                <div className="text-primary-purple font-semibold text-sm -mt-1">CINEMA</div>
                            </div>
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* Render nội dung con */}
            {children}
        </div>
    );
}
