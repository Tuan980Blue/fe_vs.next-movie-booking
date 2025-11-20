"use client";

import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BookingStatus, BookingSearchDto } from '@/models/booking';

interface BookingFiltersProps {
  filters: BookingSearchDto;
  onFilterChange: (filters: BookingSearchDto) => void;
  onReset: () => void;
}

export default function BookingFilters({ filters, onFilterChange, onReset }: BookingFiltersProps) {
  const handleChange = (key: keyof BookingSearchDto, value: any) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const hasActiveFilters = 
    filters.status !== undefined ||
    filters.userId !== undefined ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <XMarkIcon className="h-4 w-4" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={filters.status ?? ''}
            onChange={(e) => handleChange('status', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
          >
            <option value="">Tất cả</option>
            <option value={BookingStatus.Pending}>Đang chờ</option>
            <option value={BookingStatus.Confirmed}>Đã xác nhận</option>
            <option value={BookingStatus.Canceled}>Đã hủy</option>
            <option value={BookingStatus.Expired}>Hết hạn</option>
            <option value={BookingStatus.Refunding}>Đang hoàn tiền</option>
            <option value={BookingStatus.Refunded}>Đã hoàn tiền</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => handleChange('dateFrom', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(e) => handleChange('dateTo', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
          />
        </div>

        {/* User ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập User ID..."
              value={filters.userId ?? ''}
              onChange={(e) => handleChange('userId', e.target.value || undefined)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

