"use client"

import { PaymentProvider } from "@/models";

interface PaymentMethodSelectorProps {
    selectedProvider: PaymentProvider | null;
    onProviderChange: (provider: PaymentProvider) => void;
}

export default function PaymentMethodSelector({
    selectedProvider,
    onProviderChange,
}: PaymentMethodSelectorProps) {
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold text-neutral-darkGray">Chọn phương thức thanh toán</p>
            <div className="space-y-2">
                <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                    selectedProvider === PaymentProvider.VnPay 
                        ? 'border-primary-pink bg-primary-pink/5' 
                        : 'border-neutral-lightGray/60'
                }`}>
                    <input
                        type="radio"
                        name="payment-provider"
                        value="vnpay"
                        checked={selectedProvider === PaymentProvider.VnPay}
                        onChange={() => onProviderChange(PaymentProvider.VnPay)}
                        className="accent-primary-pink"
                    />
                    <div>
                        <p className="font-medium text-neutral-darkGray">Thanh toán qua VNPay</p>
                        <p className="text-xs text-neutral-darkGray/70">Thẻ nội địa / Thẻ quốc tế / QR code</p>
                    </div>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-neutral-lightGray/60 bg-neutral-lightGray/10 px-4 py-3 text-sm opacity-60">
                    <input type="radio" disabled className="accent-neutral-lightGray"/>
                    <div>
                        <p className="font-medium text-neutral-darkGray">Ví điện tử MoMo</p>
                        <p className="text-xs text-neutral-darkGray/70">Sắp ra mắt</p>
                    </div>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-neutral-lightGray/60 bg-neutral-lightGray/10 px-4 py-3 text-sm opacity-60">
                    <input type="radio" disabled className="accent-neutral-lightGray"/>
                    <div>
                        <p className="font-medium text-neutral-darkGray">Ví ShopeePay</p>
                        <p className="text-xs text-neutral-darkGray/70">Sắp ra mắt</p>
                    </div>
                </label>
            </div>
        </div>
    );
}

