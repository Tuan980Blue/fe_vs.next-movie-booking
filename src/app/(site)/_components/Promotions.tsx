"use client";

import Link from "next/link";
import { COLORS } from "@/lib/theme/colors";
import type { MouseEvent } from "react";

const Promotions = () => {
  const promotions = [
    {
      id: 1,
      title: "Combo Bắp Nước",
      description: "Bắp nước lớn + 2 nước ngọt",
      originalPrice: "150,000đ",
      salePrice: "99,000đ",
      discount: "34%",
      validUntil: "31/12/2024",
      icon: "🍿",
      category: "combo"
    },
    {
      id: 2,
      title: "Vé VIP",
      description: "Ghế VIP + đồ ăn nhẹ",
      originalPrice: "300,000đ",
      salePrice: "150,000đ",
      discount: "50%",
      validUntil: "31/12/2024",
      icon: "👑",
      category: "vip"
    },
    {
      id: 3,
      title: "Sinh Nhật Đặc Biệt",
      description: "Miễn phí vé cho khách sinh nhật",
      originalPrice: "Miễn phí",
      salePrice: "0đ",
      discount: "100%",
      validUntil: "31/12/2024",
      icon: "🎂",
      category: "birthday"
    }
  ];

  return (
    <section className="py-4 lg:py-10 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-start mb-4 lg:mb-10">
          <h2
            className="text-xl md:text-3xl italic font-bold mb-1 lg:mb-4"
            style={{ color: COLORS.NEUTRAL.WHITE }}
          >
            🍿 Khuyến Mãi
          </h2>
          <p
            className="text-lg opacity-80"
            style={{ color: COLORS.NEUTRAL.WHITE }}
          >
            Ưu đãi đặc biệt dành cho bạn
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="group relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {promo.icon}
                    </div>
                    <div
                      className="px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase"
                      style={{
                        backgroundColor: `${COLORS.ACCENT.RED}20`,
                        color: COLORS.ACCENT.RED,
                        border: `1px solid ${COLORS.ACCENT.RED}40`
                      }}
                    >
                      -{promo.discount} OFF
                    </div>
                  </div>
                  <div className="text-xs opacity-60 flex items-center gap-1" style={{ color: COLORS.NEUTRAL.WHITE }}>
                    <span>📅</span>
                    {promo.validUntil}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="mb-6">
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: COLORS.NEUTRAL.WHITE }}
                  >
                    {promo.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed opacity-80"
                    style={{ color: COLORS.NEUTRAL.WHITE }}
                  >
                    {promo.description}
                  </p>
                </div>

                {/* Price Section */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-2">
                    {promo.originalPrice !== "Miễn phí" && (
                      <span
                        className="text-lg italic line-through opacity-50 flex items-center gap-1"
                        style={{ color: COLORS.NEUTRAL.WHITE }}
                      >
                        <span>💰</span>
                        {promo.originalPrice}
                      </span>
                    )}
                    <span
                      className="text-amber-50 text-lg lg:text-2xl italic font-semibold flex items-center gap-2"
                    >
                      <span>💸</span>
                      {promo.salePrice}
                    </span>
                  </div>
                  <p
                    className="text-xs opacity-60 flex items-center gap-1"
                    style={{ color: COLORS.NEUTRAL.WHITE }}
                  >
                    <span>✅</span>
                    Giá đã bao gồm VAT
                  </p>
                </div>

                {/* CTA Button */}
                <Link
                  href="/movies"
                  className="group/btn relative block w-full text-center py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 overflow-hidden"
                  style={{
                    backgroundColor: COLORS.PRIMARY.PINK,
                    color: COLORS.NEUTRAL.WHITE,
                    boxShadow: `0 4px 20px ${COLORS.PRIMARY.PINK}30`
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = COLORS.CINEMA.NEON_PINK;
                    el.style.boxShadow = `0 8px 30px ${COLORS.CINEMA.NEON_PINK}50`;
                    el.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = COLORS.PRIMARY.PINK;
                    el.style.boxShadow = `0 4px 20px ${COLORS.PRIMARY.PINK}30`;
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>🎫</span>
                    Sử dụng ngay
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </Link>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: COLORS.PRIMARY.PINK }}></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full opacity-5" style={{ backgroundColor: COLORS.ACCENT.YELLOW }}></div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p
            className="text-sm opacity-70"
            style={{ color: COLORS.NEUTRAL.WHITE }}
          >
            * Áp dụng có điều kiện. Vui lòng đọc kỹ điều khoản sử dụng.
          </p>
          <Link
              href="/promotions"
            className="inline-block mt-4 text-sm font-semibold hover:underline"
            style={{ color: COLORS.ACCENT.ORANGE }}
          >
            Xem tất cả khuyến mãi →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Promotions;
