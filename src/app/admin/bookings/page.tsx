"use client";

import { useEffect, useState } from 'react';
import { getBookingsApi } from '@/service/services/bookingService';
import { BookingSearchDto, BookingListLightResultDto } from '@/models/booking';
import BookingFilters from './_components/BookingFilters';
import BookingTable from './_components/BookingTable';
import BookingPagination from './_components/BookingPagination';

export default function ManageBookings() {
  const [bookings, setBookings] = useState<BookingListLightResultDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingSearchDto>({
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBookingsApi(filters);
      setBookings(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn đặt vé');
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filters]);

  const handleFilterChange = (newFilters: BookingSearchDto) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn đặt vé</h1>
          <p className="mt-1 text-sm text-gray-600">
            Xem và quản lý tất cả các đơn đặt vé trong hệ thống
          </p>
        </div>
      </div>

      {/* Filters */}
      <BookingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Bookings Table */}
      <BookingTable
        bookings={bookings?.items || []}
        loading={loading}
      />

      {/* Pagination */}
      {bookings && bookings.totalPages > 0 && (
        <BookingPagination
          currentPage={bookings.page}
          totalPages={Math.ceil(bookings.totalItems / bookings.pageSize)}
          totalItems={bookings.totalItems}
          pageSize={bookings.pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

