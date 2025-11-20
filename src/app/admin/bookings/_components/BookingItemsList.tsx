"use client";

import { BookingItemResponseDto } from '@/models/booking';
import { CalendarIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline';

interface BookingItemsListProps {
  items: BookingItemResponseDto[];
}

export default function BookingItemsList({ items }: BookingItemsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amountMinor: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amountMinor / 100);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Không có vé nào trong đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TicketIcon className="h-5 w-5 text-gray-600" />
          Danh sách vé ({items.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-pink text-white text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      {item.showtime.movieTitle}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Ghế: <span className="font-medium">{item.seat.rowLabel}{item.seat.seatNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Rạp chiếu</p>
                      <p className="text-sm font-medium text-gray-900">
                        {item.showtime.cinemaName} - {item.showtime.roomName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Thời gian chiếu</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(item.showtime.startUtc)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right ml-4">
                <p className="text-sm text-gray-500">Giá vé</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(item.seatPriceMinor)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

