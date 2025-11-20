"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBookingDetailApi } from '@/service/services/bookingService';
import { BookingResponseDto } from '@/models/booking';
import BookingDetailCard from '../_components/BookingDetailCard';
import BookingItemsList from '../_components/BookingItemsList';
import BookingActions from '../_components/BookingActions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookingDetailApi(bookingId);
      setBooking(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải thông tin đơn đặt vé');
      console.error('Failed to load booking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const handleCancelSuccess = () => {
    loadBooking(); // Reload booking after cancel
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/bookings"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn đặt vé...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/bookings"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn đặt vé</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Không tìm thấy đơn đặt vé'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/bookings"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn đặt vé</h1>
          <p className="text-sm text-gray-600 mt-1">Mã đơn: {booking.code}</p>
        </div>
      </div>

      {/* Booking Detail Card */}
      <BookingDetailCard booking={booking} />

      {/* Booking Items */}
      <BookingItemsList items={booking.items} />

      {/* Booking Actions */}
      <BookingActions booking={booking} onCancelSuccess={handleCancelSuccess} />
    </div>
  );
}

