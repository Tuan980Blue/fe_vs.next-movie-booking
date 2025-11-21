"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SeatSelectionErrorCardProps {
    error: string;
    showtimeId?: string | null;
    statusCode?: number;
    onRetry?: () => void;
}

export default function SeatSelectionErrorCard({ 
    error, 
    showtimeId, 
    statusCode,
    onRetry 
}: SeatSelectionErrorCardProps) {
    const router = useRouter();

    // Phân tích loại lỗi dựa trên message và status code
    const getErrorType = () => {
        const errorLower = error.toLowerCase();
        
        // Kiểm tra status code trước
        if (statusCode === 401 || errorLower.includes('unauthorized') || errorLower.includes('chưa đăng nhập')) {
            return 'unauthorized';
        }
        if (statusCode === 409 || errorLower.includes('đã được đặt') || errorLower.includes('đã được giữ') || 
            errorLower.includes('không thể khóa') || errorLower.includes('conflict')) {
            return 'seat_taken';
        }
        if (statusCode === 400 || errorLower.includes('không tồn tại') || errorLower.includes('không hợp lệ') || 
            errorLower.includes('invalid') || errorLower.includes('không còn hoạt động')) {
            return 'invalid_data';
        }
        if (errorLower.includes('đã bắt đầu') || errorLower.includes('đã kết thúc')) {
            return 'showtime_passed';
        }
        if (errorLower.includes('không thể tính') || errorLower.includes('không thể tạo')) {
            return 'server_error';
        }
        
        return 'unknown';
    };

    const errorType = getErrorType();

    const getErrorContent = () => {
        switch (errorType) {
            case 'unauthorized':
                return {
                    title: 'Bạn cần đăng nhập để đặt vé',
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
                            href: '/auth',
                            primary: true
                        },
                        {
                            label: 'Đăng ký tài khoản mới',
                            href: '/auth',
                            primary: false
                        }
                    ],
                    showRetry: false
                };

            case 'seat_taken':
                return {
                    title: 'Ghế đã được đặt bởi người khác',
                    icon: '💺',
                    description: 'Rất tiếc, một hoặc nhiều ghế bạn đã chọn đã được người khác đặt trước.',
                    reasons: [
                        'Ghế đã được người khác đặt trong lúc bạn đang chọn',
                        'Ghế đã được giữ chỗ bởi khách hàng khác',
                        'Có thể do thời gian giữ chỗ đã hết hạn và ghế được giải phóng',
                        'Vui lòng làm mới trang và chọn ghế khác'
                    ],
                    actions: [
                        {
                            label: 'Làm mới và chọn lại',
                            href: '#',
                            primary: true,
                            onClick: () => window.location.reload()
                        },
                        {
                            label: 'Xem suất chiếu khác',
                            href: '/',
                            primary: false
                        }
                    ],
                    showRetry: true
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
                    ],
                    showRetry: false
                };

            case 'invalid_data':
                return {
                    title: 'Thông tin không hợp lệ',
                    icon: '⚠️',
                    description: 'Một hoặc nhiều ghế bạn chọn không còn hợp lệ hoặc không tồn tại.',
                    reasons: [
                        'Một hoặc nhiều ghế không tồn tại',
                        'Ghế không còn hoạt động',
                        'Ghế không thuộc cùng một phòng chiếu',
                        'Suất chiếu không tồn tại hoặc đã bị xóa'
                    ],
                    actions: [
                        {
                            label: 'Làm mới và chọn lại',
                            href: '#',
                            primary: true,
                            onClick: () => window.location.reload()
                        },
                        {
                            label: 'Xem suất chiếu khác',
                            href: '/',
                            primary: false
                        }
                    ],
                    showRetry: true
                };

            case 'server_error':
                return {
                    title: 'Lỗi xử lý dữ liệu',
                    icon: '🔧',
                    description: 'Hệ thống không thể xử lý yêu cầu đặt vé của bạn.',
                    reasons: [
                        'Không thể tính giá cho ghế đã chọn',
                        'Lỗi khi tạo đơn giữ chỗ',
                        'Lỗi kết nối đến server',
                        'Vui lòng thử lại sau vài phút'
                    ],
                    actions: [
                        {
                            label: 'Thử lại',
                            href: '#',
                            primary: true,
                            onClick: onRetry || (() => window.location.reload())
                        },
                        {
                            label: 'Làm mới trang',
                            href: '#',
                            primary: false,
                            onClick: () => window.location.reload()
                        }
                    ],
                    showRetry: true
                };

            default:
                return {
                    title: 'Không thể tạo đơn giữ chỗ',
                    icon: '❌',
                    description: error || 'Đã xảy ra lỗi khi tạo đơn giữ chỗ. Vui lòng thử lại.',
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
                            onClick: onRetry || (() => window.location.reload())
                        },
                        {
                            label: 'Làm mới trang',
                            href: '#',
                            primary: false,
                            onClick: () => window.location.reload()
                        },
                        {
                            label: 'Quay lại trang chủ',
                            href: '/',
                            primary: false
                        }
                    ],
                    showRetry: true
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

                {/* Tip */}
                {content.showRetry && (
                    <div className="rounded-xl bg-blue-50/50 border border-blue-200/50 p-4">
                        <p className="text-xs text-blue-800">
                            <span className="font-semibold">💡 Mẹo:</span> Nếu vẫn gặp lỗi, hãy làm mới trang và chọn lại ghế. 
                            Các ghế đã được đặt sẽ tự động cập nhật.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

