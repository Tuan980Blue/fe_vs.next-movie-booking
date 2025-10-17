'use client'

import { motion } from "framer-motion";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";

const StepsHeader = () => {
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
        <div className="sticky top-0 z-20 w-full">
            <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-neutral-lightGray/40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Back button */}
                        <motion.button
                            type="button"
                            onClick={() => router.back()}
                            className="group inline-flex items-center gap-2 text-neutral-darkGray hover:text-primary-pink transition-colors"
                            aria-label="Quay lại"
                            title="Quay lại"
                            whileHover={{scale: 1.03}}
                            whileTap={{scale: 0.97}}
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-lightGray/20 group-hover:bg-primary-pink/10 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:-translate-x-0.5 transition-transform">
                                    <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="hidden sm:inline text-sm font-semibold">Quay lại</span>
                        </motion.button>

                        {/* Center: Steps (re-coded progress bar using after pseudo elements) */}
                        <div className="flex-1 px-4">
                            <div className="mx-auto">
                                <div className="relative pt-6">
                                    <ol className="flex items-center w-full flex-nowrap">
                                        {steps.map((s, index) => {
                                            const isActive = s.id === step;
                                            const isDone = s.id < step;
                                            const isLast = index === steps.length - 1;

                                            const connectorClasses = !isLast
                                                ? ` after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block ${
                                                    isDone ? 'after:border-primary-pink/70' : 'after:border-neutral-lightGray/60'
                                                }`
                                                : '';

                                            const stateTextClasses = (isDone || isActive)
                                                ? 'text-primary-pink'
                                                : 'text-neutral-darkGray';

                                            return (
                                                <li key={s.id} className="flex flex-1 basis-0">
                                                    <div className="flex flex-col items-start w-full">
                                                        <div className={`flex w-full items-center ${stateTextClasses}${connectorClasses}`}>
                                                            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                                                                isDone || isActive ? 'bg-primary-pink/10' : 'bg-neutral-lightGray/40'
                                                            }`}>
                                                                {isDone ? (
                                                                    <svg className="w-3.5 h-3.5 text-primary-pink lg:w-4 lg:h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                                                    </svg>
                                                                ) : (
                                                                    <span className={`text-base ${isActive ? 'text-primary-pink' : 'text-neutral-darkGray/70'}`}>{s.icon}</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 text-center self-start w-10 lg:w-12">
                                                            <div className={`text-[12px] font-semibold ${isActive ? 'text-neutral-darkGray' : 'text-neutral-darkGray/90'}`}>{s.label}</div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Right: Logo/Brand */}
                        <Link href="/" className="inline-flex items-center" aria-label="Trang chủ">
                            <motion.div className="flex items-center space-x-2" whileTap={{scale: 0.97}}>
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img src="/logo.png" alt="TA MEM CINEMA Logo" className="w-full h-full object-cover"/>
                                </div>
                                <div className="hidden sm:block leading-tight">
                                    <div className="text-primary-pink font-bold text-base">TA MEM</div>
                                    <div className="text-primary-purple font-semibold text-xs -mt-0.5">CINEMA</div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepsHeader;