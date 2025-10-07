
"use client";

import { motion } from 'framer-motion';
import {useState, type ChangeEvent, type FormEvent, type MouseEvent} from "react";
import {COLORS} from "@/lib/theme/colors";


type RegisterFormProps = {
  onRegister: (userData: { fullName: string; email: string; password: string }) => Promise<unknown> | unknown;
  onSwitchToLogin: () => void;
};

const RegisterForm = ({ onRegister, onSwitchToLogin }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng!');
      return;
    }

    setIsLoading(true);
    try {
      await onRegister({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
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
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Ticket Card Container */}
        <div className="rounded-2xl shadow-2xl overflow-hidden relative border-2 border-neutral-lightGray border-dashed"
             style={{
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
            className="p-6 text-center relative"
            style={{
              background: `linear-gradient(135deg, rgba(45, 27, 105, 0.9) 0%, rgba(45, 27, 105, 0.4)`,
              borderBottom: `2px solid ${COLORS.CINEMA.NEON_PINK}`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <h1 className="text-white text-2xl font-bold drop-shadow-lg">
              🎬 Đăng ký tài khoản
            </h1>
            <p className="text-white italic opacity-95 text-sm mt-2 drop-shadow-md">
              Tham gia Cinema Booking System
            </p>
            <div className="mt-1 text-white opacity-85 text-xs drop-shadow-md">
              <div>🎫 TICKET REGISTRATION</div>
            </div>
          </div>

          {/* Ticket Body - Horizontal Layout */}
          <div
            className="p-6"
            style={{
              background: `rgba(255, 255, 255, 0.15)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 relative">
                {/* Vertical Divider Line */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-lightGray border-dashed border-l-2 border-neutral-lightGray transform -translate-x-1/2"></div>

                {/* Left Column */}
                <div className="space-y-4 pr-0 lg:pr-6">
                  {/* Full Name Input */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2 drop-shadow-md">
                      👤 Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-white/40 rounded-xl focus:border-primary-pink focus:outline-none transition-colors bg-white/80 backdrop-blur-sm text-gray-800 font-medium placeholder-zinc-600"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

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
                </div>

                {/* Right Column */}
                <div className="space-y-4 pl-0 lg:pl-6">
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
                        className="w-full px-4 py-3 pr-12 border-2 border-white/40 rounded-xl focus:border-primary-pink focus:outline-none transition-colors bg-white/30 backdrop-blur-sm text-white font-medium placeholder-white/60"
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

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2 drop-shadow-md">
                      🔒 Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 pr-12 border-2 border-white/40 rounded-xl focus:border-primary-pink focus:outline-none transition-colors bg-white/30 backdrop-blur-sm text-white font-medium placeholder-white/60"
                        placeholder="Nhập lại mật khẩu"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-primary-pink transition-colors"
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Agreement - Full Width */}
              <div className="flex items-start mb-6">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mr-2 mt-1 text-primary-pink focus:ring-primary-pink"
                />
                <span className="text-white text-sm drop-shadow-md">
                  Tôi đồng ý với{' '}
                  <button
                    type="button"
                    className="transition-colors italic"
                    style={{ color: COLORS.ACCENT.ORANGE }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.color = COLORS.ACCENT.YELLOW;
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.color = COLORS.ACCENT.ORANGE;
                    }}
                  >
                    điều khoản sử dụng
                  </button>
                  {' '}và{' '}
                  <button
                    type="button"
                    className="transition-colors italic"
                    style={{ color: COLORS.ACCENT.ORANGE }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.color = COLORS.ACCENT.YELLOW;
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.color = COLORS.ACCENT.ORANGE;
                    }}
                  >
                    chính sách bảo mật
                  </button>
                </span>
              </div>

              {/* Register Button - Full Width */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden mb-2"
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
                    Đang đăng ký...
                  </div>
                ) : (
                  '🎫 Tạo tài khoản'
                )}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-white/30 border-dashed"></div>
                <span className="px-4 text-white/80 text-sm drop-shadow-md">hoặc</span>
                <div className="flex-1 border-t border-white/30 border-dashed"></div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <span className="text-white text-sm drop-shadow-md">Đã có tài khoản? </span>
              <button
                  onClick={onSwitchToLogin}
                  className="font-semibold italic transition-colors"
                  style={{
                    color: COLORS.PRIMARY.PINK
                  }}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.color = COLORS.CINEMA.NEON_PINK;
                }}
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.color = COLORS.PRIMARY.PINK;
                }}
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
