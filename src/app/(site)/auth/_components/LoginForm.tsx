
"use client";

import { motion } from 'framer-motion';
import {useState, type ChangeEvent, type FormEvent, type MouseEvent} from "react";
import {COLORS} from "@/lib/theme/colors";

type LoginFormProps = {
  onLogin: (userData: { email: string; password: string; rememberMe: boolean }) => Promise<unknown> | unknown;
  onSwitchToRegister: () => void;
};

const LoginForm = ({ onLogin, onSwitchToRegister }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onLogin({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ticket Card */}
      <motion.div
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Ticket Card Container */}
        <div className=" rounded-2xl shadow-2xl overflow-hidden relative" style={{
          background: `rgba(255, 255, 255, 0.1)`,
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)'
        }}>
          {/* Ticket Notch - Left */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-primary-purple rounded-r-full -ml-2" />

          {/* Ticket Notch - Right */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-primary-purple rounded-l-full -mr-2" />

          {/* Ticket Header */}
          <div
            className="p-4 text-center relative"
            style={{
              background: `linear-gradient(135deg, rgba(45, 27, 105, 0.9) 0%, rgba(45, 27, 105, 0.4)`,
              borderBottom: `2px solid ${COLORS.CINEMA.NEON_PINK}`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-4xl mb-2">🎟️</div>
            <h1 className="text-white text-2xl font-bold drop-shadow-lg">
              🎬 Đăng nhập để đặt vé
            </h1>
            <p className="text-white opacity-95 italic text-sm mt-2 drop-shadow-md">
              TA MEM Cinema
            </p>
          </div>

          {/* Ticket Body */}
          <div
            className="p-6"
            style={{
              background: `rgba(255, 255, 255, 0.15)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2 drop-shadow-md">
                  📧 Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-white/40 rounded-xl focus:border-primary-pink focus:outline-none transition-colors bg-white/80 backdrop-blur-sm text-gray-800 font-medium placeholder-zinc-600"
                  placeholder="Nhập email của bạn"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2 drop-shadow-md">
                  🔒 Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 pr-12 border-2 border-white/40 rounded-xl focus:border-primary-pink focus:outline-none transition-colors bg-white/80 backdrop-blur-sm text-gray-800 font-medium placeholder-zinc-600"
                    placeholder="Nhập mật khẩu"
                  />
              <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-primary-pink transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="mr-2 text-primary-pink focus:ring-primary-pink"
                  />
                  <span className="text-white text-sm drop-shadow-md">Ghi nhớ tôi</span>
                </label>
              <button
                  type="button"
                  className="text-sm transition-colors"
                  style={{
                    color: COLORS.ACCENT.ORANGE
                  }}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.color = COLORS.ACCENT.YELLOW;
                }}
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.color = COLORS.ACCENT.ORANGE;
                }}
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden"
                style={{
                  backgroundColor: COLORS.PRIMARY.PINK,
                  boxShadow: `0 4px 15px ${COLORS.PRIMARY.PINK}30`
                }}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = COLORS.CINEMA.NEON_PINK;
                  e.currentTarget.style.boxShadow = `0 6px 20px ${COLORS.CINEMA.NEON_PINK}40`;
                }}
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = COLORS.PRIMARY.PINK;
                  e.currentTarget.style.boxShadow = `0 4px 15px ${COLORS.PRIMARY.PINK}30`;
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  '🎫 Đăng nhập'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-white/30 border-dashed"></div>
              <span className="px-4 text-white/80 text-sm drop-shadow-md">hoặc</span>
              <div className="flex-1 border-t border-white/30 border-dashed"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-white text-sm drop-shadow-md">Chưa có tài khoản? </span>
              <button
                onClick={onSwitchToRegister}
                className="font-semibold transition-colors"
                style={{
                  color: COLORS.ACCENT.ORANGE
                }}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.color = COLORS.ACCENT.YELLOW;
                }}
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.color = COLORS.ACCENT.ORANGE;
                }}
              >
                Đăng ký ngay
              </button>
            </div>
          </div>

          {/* Ticket Right Side - QR Code & Icons */}
          <div className="absolute right-2 top-1/3 transform -translate-y-1/2 hidden md:block">
            <div className="text-center">
              {/* Movie Icons */}
              <div className="flex flex-col items-center space-y-1">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  🎥
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xl"
                >
                  🍿
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-lg"
                >
                  ⭐
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
