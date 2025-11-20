"use client";

import { BookingResponseDto } from '@/models/booking';
import BookingStatusBadge from './BookingStatusBadge';
import { 
  UserIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  TicketIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

interface BookingDetailCardProps {
  booking: BookingResponseDto;
}

export default function BookingDetailCard({ booking }: BookingDetailCardProps) {
  const formatCurrency = (amountMinor: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency
    }).format(amountMinor / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Chi tiết đơn đặt vé</h2>
          <p className="text-sm text-gray-600 mt-1">Mã đơn: <span className="font-mono font-medium">{booking.code}</span></p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Booking Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-gray-600" />
            Thông tin khách hàng
          </h3>
          <div className="space-y-2">
            {booking.user ? (
              <>
                <div>
                  <span className="text-sm text-gray-600">Tên:</span>
                  <p className="text-sm font-medium text-gray-900">{booking.user.fullName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="text-sm font-medium text-gray-900">{booking.user.email}</p>
                </div>
              </>
            ) : booking.customerInfo ? (
              <>
                <div>
                  <span className="text-sm text-gray-600">Tên:</span>
                  <p className="text-sm font-medium text-gray-900">{booking.customerInfo.fullName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="text-sm font-medium text-gray-900">{booking.customerInfo.email}</p>
                </div>
                {booking.customerInfo.phone && (
                  <div>
                    <span className="text-sm text-gray-600">Số điện thoại:</span>
                    <p className="text-sm font-medium text-gray-900">{booking.customerInfo.phone}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">Không có thông tin khách hàng</p>
            )}
          </div>
        </div>

        {/* Booking Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-600" />
            Tổng quan đơn hàng
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Tổng tiền:</span>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(booking.totalAmountMinor, booking.currency)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Số vé:</span>
              <p className="text-sm font-medium text-gray-900">{booking.items.length} vé</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Ngày tạo:</span>
              <p className="text-sm font-medium text-gray-900">{formatDate(booking.createdAt)}</p>
            </div>
            {booking.updatedAt && (
              <div>
                <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                <p className="text-sm font-medium text-gray-900">{formatDate(booking.updatedAt)}</p>
              </div>
            )}
            {booking.bookingQr && (
              <div>
                <span className="text-sm text-gray-600">QR Code:</span>
                <p className="text-sm font-mono font-medium text-gray-900 flex items-center gap-2">
                  <QrCodeIcon className="h-4 w-4" />
                  {booking.bookingQr}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

