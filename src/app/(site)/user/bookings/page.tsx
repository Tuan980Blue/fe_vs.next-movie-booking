import QrCodeBooking from "@/app/(site)/user/bookings/_components/QRCodeBooking";

export default function UserBookingsPage() {
    //mã này sẽ được lấy từ booking trả về cảu api sau này.
    const bookingQr = "EAPNJNPK"

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Đơn đặt vé</h1>
                <p className="text-white/80 mt-1">Quản lý vé đã đặt và lịch sử giao dịch.</p>
            </div>

            {/*test qr code*/}
            <div>
                <QrCodeBooking bookingQr={bookingQr}>
                </QrCodeBooking>
            </div>
        </div>
    );
}


