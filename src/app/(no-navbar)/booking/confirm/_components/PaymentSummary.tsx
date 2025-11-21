"use client"

import PaymentMethodSelector from './PaymentMethodSelector';
import { PaymentProvider } from "@/models";

interface PaymentSummaryProps {
    total: number;
    formatVnd: (amount: number) => string;
    loyaltyPoints: number;
    submitting: boolean;
    selectedProvider: PaymentProvider | null;
    onProviderChange: (provider: PaymentProvider) => void;
    onSubmit: () => void;
}

export default function PaymentSummary({
    total,
    formatVnd,
    loyaltyPoints,
    submitting,
    selectedProvider,
    onProviderChange,
    onSubmit,
}: PaymentSummaryProps) {
    return (
        <aside className="lg:sticky lg:top-22 rounded-2xl bg-white shadow-xl ring-1 ring-neutral-lightGray/30 overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                <button
                    type="button"
                    className="w-full rounded-xl bg-primary-pink text-white text-sm font-semibold py-3 transition-colors hover:bg-primary-pink/90"
                >
                    Sử dụng Coupon hoặc Voucher
                </button>

                <div className="text-right text-neutral-darkGray">
                    <p className="text-sm">Tổng cộng</p>
                    <p className="text-3xl font-bold text-primary-pink">{formatVnd(total)}</p>
                    <p className="text-xs text-neutral-darkGray/70">Vé ghế: {formatVnd(total)}</p>
                </div>

                <div className="rounded-xl border border-neutral-lightGray/40 p-4 text-sm text-neutral-darkGray space-y-1">
                    <p className="font-semibold text-primary-pink">★ Dùng điểm để đổi vé và bắp nước</p>
                    <p>Bạn đang có <span className="font-semibold">{loyaltyPoints}</span> điểm.</p>
                    <p className="text-neutral-darkGray/70">Bạn chưa chọn quà đổi</p>
                </div>

                <PaymentMethodSelector
                    selectedProvider={selectedProvider}
                    onProviderChange={onProviderChange}
                />

                <div className="rounded-xl border border-neutral-lightGray/60 bg-neutral-lightGray/10 p-4 text-xs text-neutral-darkGray/80 space-y-1">
                    <p className="font-semibold text-neutral-darkGray">Điều khoản thanh toán trực tuyến</p>
                    <p>Vui lòng kiểm tra kỹ thông tin đặt vé trước khi thanh toán.</p>
                    <p>Không hoàn tiền cho các đơn đã thanh toán thành công.</p>
                </div>
            </div>
            <div className="flex-shrink-0 p-4 md:p-6 border-t border-neutral-lightGray/40 bg-white">
                <button
                    type="button"
                    disabled={submitting}
                    onClick={onSubmit}
                    className={`w-full rounded-xl py-3 text-center text-white text-sm font-semibold transition ${
                        submitting ? 'bg-neutral-lightGray cursor-not-allowed' : 'bg-primary-pink hover:bg-primary-pink/90'
                    }`}
                >
                    {submitting ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
            </div>
        </aside>
    );
}

