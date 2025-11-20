"use client";

import Link from 'next/link';
import { QrCodeIcon, TicketIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export default function ManageTickets() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý vé</h1>
        <p className="mt-1 text-sm text-gray-600">
          Xác minh và check-in vé cho khách hàng. Quét mã QR hoặc nhập mã đơn hàng để kiểm tra và check-in.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/tickets/check-ticket"
          className="bg-gradient-to-br from-primary-pink/5 to-primary-pink/10 rounded-lg shadow-sm border-2 border-primary-pink/20 p-6 hover:shadow-lg hover:border-primary-pink/40 transition-all group transform hover:scale-[1.02]"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary-pink rounded-lg group-hover:scale-110 transition-transform shadow-md">
              <QrCodeIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-pink transition-colors">
                Check-in vé
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Quét mã QR hoặc nhập mã đơn hàng để xác minh và check-in vé
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-primary-pink text-sm font-medium">
                Bắt đầu →
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/bookings"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Xem đơn đặt vé
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Xem danh sách và chi tiết tất cả đơn đặt vé
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Stats or Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TicketIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Hướng dẫn sử dụng:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Nhập mã đơn hàng (Booking Code) vào ô tìm kiếm</li>
              <li>Hệ thống sẽ gọi API để lấy thông tin đơn hàng và vé</li>
              <li>Xem chi tiết vé và nhấn nút &quot;CHECK-IN TẤT CẢ VÉ&quot; để xác nhận</li>
              <li>Vé đã check-in sẽ được đánh dấu màu xanh</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
