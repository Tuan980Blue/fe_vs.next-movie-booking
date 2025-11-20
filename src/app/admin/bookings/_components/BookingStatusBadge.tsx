"use client";

import { BookingStatus } from '@/models/booking';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export default function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Pending:
        return {
          label: 'Đang chờ',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case BookingStatus.Confirmed:
        return {
          label: 'Đã xác nhận',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case BookingStatus.Canceled:
        return {
          label: 'Đã hủy',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case BookingStatus.Expired:
        return {
          label: 'Hết hạn',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      case BookingStatus.Refunding:
        return {
          label: 'Đang hoàn tiền',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case BookingStatus.Refunded:
        return {
          label: 'Đã hoàn tiền',
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      default:
        return {
          label: 'Không xác định',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}

