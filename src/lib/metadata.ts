import type { Metadata } from "next";

// Base URL configuration
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Default metadata for the entire application
export const defaultMetadata: Metadata = {
  title: {
    default: "Touch Cinema - Đặt vé xem phim trực tuyến",
    template: "%s | Touch Cinema"
  },
  description: "Touch Cinema - Hệ thống đặt vé xem phim trực tuyến hiện đại. Khám phá các bộ phim mới nhất, đặt vé nhanh chóng và dễ dàng. Trải nghiệm xem phim tuyệt vời tại các rạp chiếu phim chất lượng cao.",
  keywords: ["đặt vé phim", "cinema", "movie booking", "vé xem phim", "rạp chiếu phim", "phim mới", "Touch Cinema"],
  authors: [{ name: "Touch Cinema Team" }],
  creator: "Touch Cinema",
  publisher: "Touch Cinema",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    other: [
      {
        rel: 'icon',
        url: '/logo.png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    siteName: 'Touch Cinema',
    title: 'Touch Cinema - Đặt vé xem phim trực tuyến',
    description: 'Hệ thống đặt vé xem phim trực tuyến hiện đại. Khám phá các bộ phim mới nhất, đặt vé nhanh chóng và dễ dàng.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Touch Cinema Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Touch Cinema - Đặt vé xem phim trực tuyến',
    description: 'Hệ thống đặt vé xem phim trực tuyến hiện đại. Khám phá các bộ phim mới nhất, đặt vé nhanh chóng và dễ dàng.',
    images: ['/logo.png'],
    creator: '@touchcinema',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

// Helper function to create page-specific metadata
export function createPageMetadata({
  title,
  description,
  keywords = [],
  image = '/logo.png',
  url,
  noIndex = false,
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    keywords: [...defaultMetadata.keywords!, ...keywords],
    openGraph: {
      title: `${title} | Touch Cinema`,
      description,
      images: [image],
      url: url ? `${baseUrl}${url}` : undefined,
    },
    twitter: {
      title: `${title} | Touch Cinema`,
      description,
      images: [image],
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : defaultMetadata.robots,
    alternates: url ? {
      canonical: url,
    } : undefined,
  };
}

// Predefined metadata for common pages
export const pageMetadata = {
  home: createPageMetadata({
    title: "Trang chủ",
    description: "Chào mừng đến với Touch Cinema - Hệ thống đặt vé xem phim trực tuyến hàng đầu. Khám phá các bộ phim mới nhất, ưu đãi hấp dẫn và đặt vé dễ dàng.",
    url: "/",
  }),
  
  movies: createPageMetadata({
    title: "Danh sách phim",
    description: "Khám phá danh sách phim đang chiếu và sắp chiếu tại Touch Cinema. Tìm kiếm phim theo thể loại, độ tuổi và sắp xếp theo ngày phát hành. Đặt vé ngay hôm nay!",
    keywords: ["danh sách phim", "phim đang chiếu", "phim sắp chiếu"],
    url: "/movies",
  }),
  
  movieDetail: createPageMetadata({
    title: "Chi tiết phim",
    description: "Xem chi tiết phim, trailer, lịch chiếu và đặt vé tại Touch Cinema. Thông tin đầy đủ về phim, diễn viên, đạo diễn và thể loại.",
    keywords: ["chi tiết phim", "trailer phim", "lịch chiếu"],
  }),
  
  admin: createPageMetadata({
    title: "Admin Dashboard",
    description: "Bảng điều khiển quản trị Touch Cinema - Quản lý phim, người dùng và hệ thống đặt vé.",
    url: "/admin",
    noIndex: true,
  }),
  
  auth: createPageMetadata({
    title: "Đăng nhập",
    description: "Đăng nhập vào tài khoản Touch Cinema để đặt vé xem phim và quản lý thông tin cá nhân.",
    keywords: ["đăng nhập", "tài khoản", "đăng ký"],
    url: "/auth",
  }),
  
  booking: createPageMetadata({
    title: "Đặt vé",
    description: "Đặt vé xem phim tại Touch Cinema. Chọn ghế, thanh toán an toàn và nhận vé điện tử ngay lập tức.",
    keywords: ["đặt vé", "thanh toán", "ghế ngồi"],
  }),
  
  user: createPageMetadata({
    title: "Tài khoản",
    description: "Quản lý tài khoản cá nhân, lịch sử đặt vé và thông tin thanh toán tại Touch Cinema.",
    keywords: ["tài khoản", "lịch sử", "thông tin cá nhân"],
    url: "/user",
  }),
};
