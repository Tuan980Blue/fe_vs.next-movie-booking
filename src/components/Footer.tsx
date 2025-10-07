import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { COLORS } from '../../shared/constants/colors';
import backgroundFooter from '../../assets/images/background-footer.png';
import PopcornAnimation from "../../components/animations/EnhancedPopcornAnimation";

const Footer = () => {
  // Lấy năm hiện tại cho copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(45, 27, 105, 0.8), rgba(13, 37, 63, 0.8)), url(${backgroundFooter})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Popcorn Falling Animation */}
      <PopcornAnimation />

      {/* Background Pattern - Tạo hiệu ứng cinema */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-pink to-accent-orange opacity-10"></div>
        <div className="absolute top-4 left-4 w-2 h-2 bg-neutral-white rounded-full"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-accent-yellow rounded-full"></div>
        <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 bg-cinema-neonBlue rounded-full"></div>
        <div className="absolute bottom-8 right-1/3 w-1 h-1 bg-cinema-neonPink rounded-full"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Cột 1: Logo & Giới thiệu */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/logo.png"
                    alt="TA MEM CINEMA Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-primary-pink font-bold text-xl">TA MEM</div>
                  <div className="text-neutral-white font-semibold text-sm -mt-1">CINEMA</div>
                </div>
              </div>

              {/* Slogan */}
              <p className="text-neutral-white opacity-90 text-sm leading-relaxed mb-4">
                🎬 Đặt vé nhanh – Trải nghiệm điện ảnh đỉnh cao
              </p>

              {/* Mô tả ngắn */}
              <p className="text-neutral-white opacity-75 text-xs leading-relaxed">
                Rạp chiếu phim hiện đại với công nghệ 4K, Dolby Atmos và dịch vụ chuyên nghiệp.
                Mang đến những trải nghiệm điện ảnh tuyệt vời nhất cho khán giả.
              </p>
            </motion.div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-neutral-white font-bold text-lg mb-6 flex items-center">
                <span className="mr-2">🔗</span>
                Liên kết nhanh
              </h3>
              <ul className="space-y-3">
                {[
                  { label: '🏠 Trang chủ', path: '/' },
                  { label: '🎬 Phim đang chiếu', path: '/movies' },
                  { label: '📅 Lịch chiếu', path: '/showtimes' },
                  { label: '🎫 Đặt vé', path: '/booking' },
                  { label: '🎉 Khuyến mãi', path: '/promotions' },
                  { label: '⭐ Đánh giá phim', path: '/reviews' },
                  { label: 'ℹ️ Giới thiệu', path: '/about' },
                  { label: '🛠️ Dịch vụ', path: '/services' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-neutral-white opacity-75 hover:opacity-100 hover:text-accent-yellow transition-all duration-300 text-sm flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-neutral-white font-bold text-lg mb-6 flex items-center">
                <span className="mr-2">🎧</span>
                Hỗ trợ khách hàng
              </h3>
              <div className="space-y-4">
                {/* Thông tin liên hệ */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-accent-orange text-lg">📞</span>
                    <div>
                      <p className="text-neutral-white text-sm font-semibold">Hotline</p>
                      <p className="text-neutral-white opacity-75 text-sm">0000 1234 567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-accent-orange text-lg">📧</span>
                    <div>
                      <p className="text-neutral-white text-sm font-semibold">Email</p>
                      <p className="text-neutral-white opacity-75 text-sm">support@tamemcinema.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-accent-orange text-lg">📍</span>
                    <div>
                      <p className="text-neutral-white text-sm font-semibold">Địa chỉ</p>
                      <p className="text-neutral-white opacity-75 text-sm">123 Đường TA, Quận Cam, TP.HCM</p>
                    </div>
                  </div>
                </div>

                {/* Liên kết hỗ trợ */}
                <div className="pt-4 border-t border-neutral-white border-opacity-20">
                  <ul className="space-y-2">
                    {[
                      { label: '❓ Câu hỏi thường gặp', path: '/faq' },
                      { label: '📋 Điều khoản sử dụng', path: '/terms' },
                      { label: '🔒 Chính sách bảo mật', path: '/privacy' },
                      { label: '📞 Liên hệ', path: '/contact' }
                    ].map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.path}
                          className="text-neutral-white opacity-75 hover:opacity-100 hover:text-accent-yellow transition-all duration-300 text-sm flex items-center group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-300">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Cột 4: Mạng xã hội */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-neutral-white font-bold text-lg mb-6 flex items-center">
                <span className="mr-2">📱</span>
                Kết nối với chúng tôi
              </h3>

               {/* Social Media Icons */}
               <div className="grid grid-cols-2 gap-4 mb-6">
                 {[
                   {
                     name: 'Facebook',
                     icon: FaFacebook,
                     color: '#1877F2',
                     url: 'https://facebook.com/tamemcinema'
                   },
                   {
                     name: 'Instagram',
                     icon: FaInstagram,
                     color: '#E4405F',
                     url: 'https://instagram.com/tamemcinema'
                   },
                   {
                     name: 'YouTube',
                     icon: FaYoutube,
                     color: '#FF0000',
                     url: 'https://youtube.com/tamemcinema'
                   },
                   {
                     name: 'TikTok',
                     icon: FaTiktok,
                     color: '#000000',
                     url: 'https://tiktok.com/@tamemcinema'
                   }
                 ].map((social, index) => {
                   const IconComponent = social.icon;
                   return (
                     <motion.a
                       key={index}
                       href={social.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="flex items-center justify-center p-3 rounded-lg bg-neutral-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 group"
                       style={{
                         '--hover-color': social.color
                       }}
                     >
                       <IconComponent
                         size={24}
                         className="text-neutral-white group-hover:text-white transition-colors duration-300"
                         style={{
                           color: 'var(--hover-color)',
                           filter: 'brightness(0.8)'
                         }}
                       />
                     </motion.a>
                   );
                 })}
               </div>

              {/* Newsletter Signup */}
              <div className="bg-neutral-white bg-opacity-10 rounded-lg p-4">
                <h4 className="text-neutral-white font-semibold text-sm mb-3">
                  📧 Đăng ký nhận tin
                </h4>
                <p className="text-neutral-white opacity-75 text-xs mb-3">
                  Nhận thông tin về phim mới và ưu đãi đặc biệt
                </p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 px-3 py-2 bg-neutral-white bg-opacity-20 border border-neutral-white border-opacity-30 rounded text-neutral-white text-sm placeholder-neutral-white placeholder-opacity-50 focus:outline-none focus:border-accent-yellow transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 py-1 bg-primary-pink rounded text-neutral-white text-xl font-semibold hover:bg-cinema-neonPink transition-all"
                  >
                    📧
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright */}
      <div
        className="relative z-10 border-t border-neutral-white border-opacity-20"
        style={{ backgroundColor: COLORS.PRIMARY.BLACK }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-neutral-white opacity-75 text-sm">
                © {currentYear} <span className="text-primary-pink font-semibold">TA MEM CINEMA</span>.
                Tất cả quyền được bảo lưu.
              </p>
            </div>

            {/* Additional Info */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-center md:text-right">
              <p className="text-neutral-white opacity-60 text-xs">
                🎬 Được phát triển với ❤️ cho cộng đồng điện ảnh Việt Nam
              </p>
              <div className="flex items-center space-x-4 text-xs text-neutral-white opacity-60">
                <span>🏆 Giải thưởng Rạp chiếu tốt nhất 2024</span>
                <span>⭐ 4.8/5 từ 10,000+ đánh giá</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
