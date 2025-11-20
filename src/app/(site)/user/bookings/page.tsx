"use client";

import BookingList from "./_components/BookingList";

export default function UserBookingsPage() {
    return (
        <div className="p-4 lg:p-8 min-h-screen bg-white rounded-3xl">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-darkGray">Đơn đặt vé</h1>
                    <p className="text-neutral-darkGray/70 mt-1">
                        Quản lý vé đã đặt và lịch sử giao dịch.
                    </p>
                </div>
                <BookingList />
            </div>
        </div>
    );
}


