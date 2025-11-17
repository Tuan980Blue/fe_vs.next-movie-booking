'use client';

import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Download } from "lucide-react";
import * as htmlToImage from "html-to-image";
import Confetti from "react-confetti";

export default function QrCodeBooking({bookingQr}: { bookingQr: string; }) {
    const qrCardRef = useRef<HTMLDivElement>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleDownload = async () => {
        if (!qrCardRef.current) return;
        try {
            const dataUrl = await htmlToImage.toPng(qrCardRef.current, { quality: 1 });
            const link = document.createElement("a");
            link.download = `ticket-${bookingQr}.png`;
            link.href = dataUrl;
            link.click();

            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
        } catch (error) {
            console.error("Lỗi khi tải vé:", error);
        }
    };

    return (
        <div className="relative flex justify-center items-center py-10">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            {/* Vé xem phim */}
            <div
                ref={qrCardRef}
                className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-2xl border border-gray-700
                   before:content-[''] before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-gray-900 before:rounded-full
                   after:content-[''] after:absolute after:-right-2 after:top-1/2 after:-translate-y-1/2 after:w-4 after:h-4 after:bg-gray-900 after:rounded-full"
            >

                {/* Nội dung vé */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Thông tin phim */}
                    <div className="flex-1 text-center md:text-left">
                        {/* Logo */}
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                                <img
                                    src="/logo.png"
                                    alt="TA MEM CINEMA Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="text-primary-pink font-bold text-lg">TA MEM</div>
                                <div className="text-primary-purple font-semibold text-sm -mt-1">CINEMA</div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Code ID: <span className="font-semibold text-white">{bookingQr}</span>
                        </p>
                    </div>

                    {/* QR code */}
                    <div className="bg-white p-3 rounded-xl shadow-inner">
                        <QRCode value={bookingQr} size={120} />
                    </div>
                </div>

                {/* Nút tải vé */}
                <button
                    onClick={handleDownload}
                    className="mt-5 w-full bg-pink-600 hover:bg-pink-700 transition-colors duration-200 text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                    <Download size={18} />
                    Tải về
                </button>

                <p className="text-center text-xs italic text-gray-400 mt-3">
                    Quét mã này tại quầy vé hoặc kiosk để nhận vé nhé!
                </p>
            </div>
        </div>
    );
}
