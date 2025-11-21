"use client"

interface CustomerInfo {
    fullName: string;
    email: string;
    phone?: string;
}

interface CustomerInfoSectionProps {
    customerInfo: CustomerInfo;
}

export default function CustomerInfoSection({ customerInfo }: CustomerInfoSectionProps) {
    return (
        <section className="space-y-2">
            <p className="text-sm font-semibold text-neutral-darkGray">Thông tin đặt vé</p>
            <div className="grid gap-3 lg:grid-cols-2 text-sm text-neutral-darkGray">
                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-4">
                    <p className="text-xs text-neutral-darkGray/70 uppercase tracking-wide">Họ tên</p>
                    <p className="font-medium">{customerInfo.fullName}</p>
                </div>
                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-4">
                    <p className="text-xs text-neutral-darkGray/70 uppercase tracking-wide">Số điện thoại</p>
                    <p className="font-medium">{customerInfo.phone || '—'}</p>
                </div>
                <div className="rounded-xl border border-neutral-lightGray/40 bg-white p-4 lg:col-span-2">
                    <p className="text-xs text-neutral-darkGray/70 uppercase tracking-wide">Email</p>
                    <p className="font-medium break-all">{customerInfo.email}</p>
                </div>
            </div>
        </section>
    );
}

