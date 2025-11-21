"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BookingErrorCardProps {
    error: string;
    bookingId?: string | null;
    statusCode?: number;
}

export default function BookingErrorCard({ error, bookingId, statusCode }: BookingErrorCardProps) {
    const router = useRouter();

    // Phân tích loại lỗi dựa trên message và status code
    const getErrorType = () => {
        const errorLower = error.toLowerCase();
        
        // Kiểm tra status code trước
        if (statusCode === 401 || errorLower.includes('unauthorized') || errorLower.includes('chưa đăng nhập')) {
            return 'unauthorized';
        }
        if (statusCode === 404 || errorLower.includes('không tìm thấy') || errorLower.includes('not found')) {
            return 'not_found';
        }
        if (statusCode === 409 || errorLower.includes('đã được đặt') || errorLower.includes('đã được giữ') || errorLower.includes('conflict')) {
            return 'seat_taken';
        }
        if (statusCode === 400 || errorLower.includes('không hợp lệ') || errorLower.includes('invalid')) {
            return 'invalid_data';
        }
        if (errorLower.includes('hết hạn') || errorLower.includes('expired')) {
            return 'expired';
        }
        if (errorLower.includes('đã bắt đầu') || errorLower.includes('đã kết thúc')) {
            return 'showtime_passed';
        }
        
        return 'unknown';
    };

    const errorType = getErrorType();

    const getErrorContent = () => {
        switch (errorType) {
            case 'unauthorized':
                return {
                    title: 'Bạn cần đăng nhập để tiếp tục',
                    icon: '🔐',
                    description: 'Để đặt vé, bạn cần đăng nhập vào tài khoản của mình.',
                    reasons: [
                        'Bạn chưa đăng nhập vào hệ thống',
                        'Phiên đăng nhập của bạn đã hết hạn',
                        'Token xác thực không hợp lệ'
                    ],
                    actions: [
                        {
                            label: 'Đăng nhập ngay',
                            href: '/auth/login?redirect=' + encodeURIComponent(`/booking/confirm?bookingId=${bookingId || ''}`),
                            primary: true
                        },
                        {
                            label: 'Đăng ký tài khoản mới',
                            href: '/auth/register',
                            primary: false
                        }
                    ]
                };

            case 'not_found':
                return {
                    title: 'Không tìm thấy đơn đặt vé',
                    icon: '🔍',
                    description: 'Đơn đặt vé bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
                    reasons: [
                        'Mã đơn đặt vé không chính xác',
                        'Đơn đặt vé đã bị xóa hoặc không còn tồn tại',
                        'Bạn không có quyền truy cập đơn đặt vé này'
                    ],
                    actions: [
                        {
                            label: 'Xem lịch sử đặt vé',
                            href: '/user/my-bookings',
                            primary: true
                        },
                        {
                            label: 'Quay lại trang chủ',
                            href: '/',
                            primary: false
                        }
                    ]
                };

            case 'seat_taken':
                return {
                    title: 'Ghế đã được đặt bởi người khác',
                    icon: '💺',
                    description: 'Rất tiếc, một hoặc nhiều ghế bạn đã chọn đã được người khác đặt trước.',
                    reasons: [
                        'Ghế đã được người khác đặt trong lúc bạn đang xử lý',
                        'Ghế đã được giữ chỗ bởi khách hàng khác',
                        'Có thể do thời gian giữ chỗ đã hết hạn'
                    ],
                    actions: [
                        {
                            label: 'Chọn ghế khác',
                            href: bookingId ? `/booking/seat-selection?id=${encodeURIComponent(bookingId)}` : '/',
                            primary: true
                        },
                        {
                            label: 'Xem suất chiếu khác',
                            href: '/',
                            primary: false
                        }
                    ]
                };

            case 'expired':
                return {
                    title: 'Đơn đặt vé đã hết hạn',
                    icon: '⏰',
                    description: 'Thời gian giữ chỗ của bạn đã hết hạn. Vui lòng đặt lại vé.',
                    reasons: [
                        'Thời gian giữ chỗ (5 phút) đã hết hạn',
                        'Bạn chưa hoàn tất thanh toán trong thời gian quy định',
                        'Đơn đặt vé đã tự động hủy do quá thời hạn'
                    ],
                    actions: [
                        {
                            label: 'Đặt vé lại',
                            href: bookingId ? `/booking/seat-selection?id=${encodeURIComponent(bookingId)}` : '/',
                            primary: true
                        },
                        {
                            label: 'Xem suất chiếu khác',
                            href: '/',
                            primary: false
                        }
                    ]
                };

            case 'showtime_passed':
                return {
                    title: 'Suất chiếu đã bắt đầu hoặc kết thúc',
                    icon: '🎬',
                    description: 'Suất chiếu bạn đang cố đặt vé đã bắt đầu hoặc đã kết thúc.',
                    reasons: [
                        'Suất chiếu đã bắt đầu, không thể đặt vé nữa',
                        'Suất chiếu đã kết thúc',
                        'Thời gian đặt vé đã hết hạn'
                    ],
                    actions: [
                        {
                            label: 'Xem suất chiếu khác',
                            href: '/',
                            primary: true
                        },
                        {
                            label: 'Xem lịch chiếu',
                            href: '/',
                            primary: false
                        }
                    ]
                };

            case 'invalid_data':
                return {
                    title: 'Dữ liệu không hợp lệ',
                    icon: '⚠️',
                    description: 'Thông tin đặt vé không hợp lệ hoặc thiếu sót.',
                    reasons: [
                        'Dữ liệu đơn đặt vé không hợp lệ',
                        'Thông tin ghế hoặc suất chiếu không chính xác',
                        'Có lỗi trong quá trình xử lý dữ liệu'
                    ],
                    actions: [
                        {
                            label: 'Quay lại chọn ghế',
                            href: bookingId ? `/booking/seat-selection?id=${encodeURIComponent(bookingId)}` : '/',
                            primary: true
                        },
                        {
                            label: 'Liên hệ hỗ trợ',
                            href: '/contact',
                            primary: false
                        }
                    ]
                };

            default:
                return {
                    title: 'Đã xảy ra lỗi',
                    icon: '❌',
                    description: error || 'Không thể tải thông tin đơn đặt vé. Vui lòng thử lại sau.',
                    reasons: [
                        'Lỗi kết nối đến server',
                        'Lỗi xử lý dữ liệu',
                        'Vui lòng thử lại sau vài phút'
                    ],
                    actions: [
                        {
                            label: 'Thử lại',
                            href: '#',
                            primary: true,
                            onClick: () => window.location.reload()
                        },
                        {
                            label: 'Quay lại trang chủ',
                            href: '/',
                            primary: false
                        },
                        ...(bookingId ? [{
                            label: 'Quay lại chọn ghế',
                            href: `/booking/seat-selection?id=${encodeURIComponent(bookingId)}`,
                            primary: false
                        }] : [])
                    ]
                };
        }
    };

    const content = getErrorContent();

    return (
        <motion.div
            className="rounded-2xl bg-white shadow-xl ring-1 ring-red-200/50 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-5 border-b border-red-200/50">
                <div className="flex items-start gap-3">
                    <span className="text-3xl">{content.icon}</span>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-red-900 mb-1">{content.title}</h2>
                        <p className="text-sm text-red-700/90">{content.description}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 space-y-6">
                {/* Lý do có thể xảy ra */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-neutral-darkGray flex items-center gap-2">
                        <span className="text-red-500">ℹ️</span>
                        Lý do có thể xảy ra:
                    </h3>
                    <ul className="space-y-2 pl-4">
                        {content.reasons.map((reason, index) => (
                            <li key={index} className="text-sm text-neutral-darkGray/80 flex items-start gap-2">
                                <span className="text-red-400 mt-1.5">•</span>
                                <span>{reason}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Error message chi tiết (nếu có) */}
                {error && errorType === 'unknown' && (
                    <div className="rounded-xl bg-red-50/50 border border-red-200/50 p-4">
                        <p className="text-xs font-medium text-red-800 mb-1">Chi tiết lỗi:</p>
                        <p className="text-sm text-red-700/90 font-mono">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {content.actions.map((action, index) => {
                        if (action.onClick) {
                            return (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className={`flex-1 rounded-xl py-3 px-4 text-center text-sm font-semibold transition ${
                                        action.primary
                                            ? 'bg-primary-pink text-white hover:bg-primary-pink/90'
                                            : 'bg-neutral-lightGray/30 text-neutral-darkGray hover:bg-neutral-lightGray/40'
                                    }`}
                                >
                                    {action.label}
                                </button>
                            );
                        }
                        return (
                            <Link
                                key={index}
                                href={action.href}
                                className={`flex-1 rounded-xl py-3 px-4 text-center text-sm font-semibold transition ${
                                    action.primary
                                        ? 'bg-primary-pink text-white hover:bg-primary-pink/90'
                                        : 'bg-neutral-lightGray/30 text-neutral-darkGray hover:bg-neutral-lightGray/40'
                                }`}
                            >
                                {action.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

