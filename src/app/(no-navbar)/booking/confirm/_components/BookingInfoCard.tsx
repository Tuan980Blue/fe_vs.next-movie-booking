"use client"

import BookingTimer from './BookingTimer';
import ShowtimeInfoSection from './ShowtimeInfoSection';
import CustomerInfoSection from './CustomerInfoSection';
import SeatDetailsSection from './SeatDetailsSection';
import type { BookingItemResponseDto } from '@/models/booking';

interface CustomerInfo {
    fullName: string;
    email: string;
    phone?: string;
}

interface BookingInfoCardProps {
    bookingCode?: string;
    timeLeft: number;
    showtime: {
        movieTitle?: string;
        startUtc: string;
        roomName?: string;
    } | null;
    seatNames: string;
    formattedShowtime: string;
    customerInfo: CustomerInfo;
    items: BookingItemResponseDto[];
    formatVnd: (amount: number) => string;
}

export default function BookingInfoCard({
    bookingCode,
    timeLeft,
    showtime,
    seatNames,
    formattedShowtime,
    customerInfo,
    items,
    formatVnd,
}: BookingInfoCardProps) {
    return (
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-neutral-lightGray/30 overflow-hidden">
            <BookingTimer timeLeft={timeLeft} bookingCode={bookingCode} />
            
            <div className="px-6 py-6 space-y-6">
                <ShowtimeInfoSection
                    movieTitle={showtime?.movieTitle}
                    formattedShowtime={formattedShowtime}
                    roomName={showtime?.roomName}
                    seatNames={seatNames}
                />

                <CustomerInfoSection customerInfo={customerInfo} />

                <SeatDetailsSection items={items} formatVnd={formatVnd} />

                <section className="space-y-2">
                    <p className="text-sm font-semibold text-neutral-darkGray">Thông tin combo bắp nước</p>
                    <div className="rounded-xl border border-dashed border-neutral-lightGray/70 bg-neutral-lightGray/10 p-4 text-sm text-neutral-darkGray/80">
                        Hiện chưa thêm combo bắp nước. Bạn có thể quay lại bước trước để chọn thêm.
                    </div>
                </section>

                <section className="space-y-2">
                    <p className="text-sm font-semibold text-neutral-darkGray">Lưu ý</p>
                    <ul className="list-disc pl-6 text-sm text-neutral-darkGray/90 space-y-1">
                        <li>Vé đã mua không thể đổi hoặc trả lại.</li>
                        <li>Khi cần, vui lòng xuất trình giấy tờ tùy thân để kiểm tra độ tuổi.</li>
                        <li>Chỉ cần lưu lại mã giữ chỗ hoặc email xác nhận để soát vé.</li>
                        <li>Nếu có combo online bạn sẽ được ưu tiên xếp hàng ở quầy bắp nước.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

