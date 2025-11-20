"use client";

import { useState } from 'react';
import { BookingResponseDto, BookingStatus } from '@/models/booking';
import { cancelBookingApi } from '@/service/services/bookingService';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BookingActionsProps {
  booking: BookingResponseDto;
  onCancelSuccess: () => void;
}

export default function BookingActions({ booking, onCancelSuccess }: BookingActionsProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCancel = booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed;

  const handleCancel = async () => {
    if (!canCancel) return;

    setLoading(true);
    setError(null);
    try {
      await cancelBookingApi(booking.id, { reason: cancelReason || undefined });
      setShowCancelModal(false);
      setCancelReason('');
      onCancelSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể hủy đơn đặt vé');
    } finally {
      setLoading(false);
    }
  };

  if (!canCancel) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h3>
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <XMarkIcon className="h-5 w-5" />
          Hủy đơn đặt vé
        </button>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận hủy đơn đặt vé
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Bạn có chắc chắn muốn hủy đơn đặt vé <span className="font-mono font-medium">{booking.code}</span>?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do hủy (tùy chọn)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                placeholder="Nhập lý do hủy đơn..."
              />
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setError(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

