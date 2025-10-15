"use client"

import { motion, AnimatePresence } from 'framer-motion';
import {COLORS} from "@/lib/theme/colors";
import {useState, Suspense} from "react";
import EnhancedPopcornAnimation from "@/app/(site)/_components/EnhancedPopcornAnimation";
import LoginForm from "@/app/(site)/auth/_components/LoginForm";
import RegisterForm from "@/app/(site)/auth/_components/RegisterForm";
import {useRouter, useSearchParams} from "next/navigation";
import {useAuth} from "@/context/AuthContext";

const AuthContent = () => {
    const [currentView, setCurrentView] = useState('login'); // 'login', 'register'
    const { login, register } = useAuth();
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const handleLogin = async (userData: { email: string; password: string}) => {
        await login(userData.email, userData.password);
        // Quay lại trang trước
        router.push(callbackUrl)
    };

    const handleRegister = async (userData: { fullName: string; email: string; password: string }) => {
        await register(userData.email, userData.password, userData.fullName);
        setCurrentView('login');

        router.push('/')
    };

    const switchToRegister = () => {
        setCurrentView('register');
    };

    const switchToLogin = () => {
        setCurrentView('login');
    };

    return (
        <div className="relative h-screen">
            {/* Background Overlay */}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: `${COLORS.PRIMARY.BLACK}60` }}
            />
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 text-neutral-white opacity-20 text-6xl">
                🎬
            </div>
            <div className="absolute top-20 right-20 text-neutral-white opacity-20 text-4xl">
                🍿
            </div>
            <div className="absolute bottom-20 left-20 text-neutral-white opacity-20 text-5xl">
                ⭐
            </div>
            <div className="absolute bottom-10 right-10 text-neutral-white opacity-20 text-6xl">
                🎟️
            </div>
            {/* Popcorn Falling Animation */}
            <EnhancedPopcornAnimation />

            <AnimatePresence mode="wait">
                {currentView === 'login' && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LoginForm
                            onLogin={handleLogin}
                            onSwitchToRegister={switchToRegister}
                        />
                    </motion.div>
                )}

                {currentView === 'register' && (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <RegisterForm
                            onRegister={handleRegister}
                            onSwitchToLogin={switchToLogin}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AuthPage = () => {
    return (
        <Suspense fallback={
            <div className="relative h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
};

export default AuthPage;
