"use client";

import { BookingVerifyResponseDto, TicketInfoDto } from '@/models/ticket';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  TicketIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface TicketVerificationResultProps {
  result: BookingVerifyResponseDto;
  onCheckIn: () => void;
  checkingIn?: boolean;
}

export default function TicketVerificationResult({ 
  result, 
  onCheckIn, 
  checkingIn 
}: TicketVerificationResultProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCheckInDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      <div className={`rounded-lg border-2 p-6 ${
        result.isValid 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start gap-4">
          {result.isValid ? (
            <CheckCircleIcon className="h-8 w-8 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircleIcon className="h-8 w-8 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-2 ${
              result.isValid ? 'text-green-900' : 'text-red-900'
            }`}>
              {result.isValid ? 'Đơn hàng hợp lệ' : 'Đơn hàng không hợp lệ'}
            </h3>
            {result.validationMessage && (
              <p className={`text-sm ${
                result.isValid ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.validationMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-gray-600" />
          Thông tin đơn hàng
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-600">Mã đơn:</span>
            <p className="text-sm font-mono font-medium text-gray-900">{result.booking.code}</p>
          </div>
          {result.booking.customerInfo && (
            <>
              <div>
                <span className="text-sm text-gray-600">Khách hàng:</span>
                <p className="text-sm font-medium text-gray-900">{result.booking.customerInfo.fullName}</p>
              </div>
              {result.booking.customerInfo.email && (
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="text-sm font-medium text-gray-900">{result.booking.customerInfo.email}</p>
                </div>
              )}
            </>
          )}
          <div>
            <span className="text-sm text-gray-600">Ngày tạo:</span>
            <p className="text-sm font-medium text-gray-900">{formatDate(result.booking.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TicketIcon className="h-5 w-5 text-gray-600" />
            Danh sách vé ({result.tickets.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {result.tickets.map((ticket, index) => (
            <div key={ticket.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-pink text-white text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">
                        {ticket.showtime.movieTitle}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Mã vé: <span className="font-mono font-medium">{ticket.ticketCode}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Rạp chiếu</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ticket.showtime.cinemaName} - {ticket.showtime.roomName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Thời gian chiếu</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(ticket.showtime.startUtc)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-11 mt-3">
                    <p className="text-xs text-gray-500">Ghế ngồi</p>
                    <p className="text-sm font-medium text-gray-900">
                      {ticket.seat.rowLabel}{ticket.seat.seatNumber}
                    </p>
                  </div>

                  {ticket.checkedInAt ? (
                    <div className="ml-11 mt-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
                        <CheckCircleIcon className="h-4 w-4" />
                        Đã check-in: {formatCheckInDate(ticket.checkedInAt)}
                      </div>
                    </div>
                  ) : (
                    <div className="ml-11 mt-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">
                        Chưa check-in
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Check-in Button - Prominent for Admin */}
      {result.isValid && !result.isFullyCheckedIn && (
        <div className="bg-gradient-to-r from-primary-pink/10 to-primary-pink/5 rounded-lg border-2 border-primary-pink p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Sẵn sàng check-in
            </h3>
            <p className="text-sm text-gray-600">
              {result.tickets.filter(t => !t.checkedInAt).length} vé chưa được check-in
            </p>
          </div>
          <button
            onClick={onCheckIn}
            disabled={checkingIn}
            className="w-full px-6 py-4 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {checkingIn ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang check-in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircleIcon className="h-6 w-6" />
                CHECK-IN TẤT CẢ VÉ
              </span>
            )}
          </button>
        </div>
      )}

      {result.isFullyCheckedIn && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-6">
          <div className="flex items-center justify-center gap-3 text-green-800">
            <CheckCircleIcon className="h-8 w-8" />
            <div>
              <p className="font-bold text-lg">Tất cả vé đã được check-in thành công!</p>
              <p className="text-sm text-green-700 mt-1">
                {result.tickets.length} vé đã được xác nhận
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

