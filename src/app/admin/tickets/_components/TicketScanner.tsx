'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function TicketScanner() {
    const router = useRouter();
    const [scanned, setScanned] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scannedCodesRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const startScanning = async () => {
            if (!containerRef.current) return;

            try {
                const scanner = new Html5Qrcode("qr-reader");
                scannerRef.current = scanner;

                await scanner.start(
                    { facingMode: "environment" }, // Sử dụng camera sau
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        // Khi quét thành công
                        if (decodedText && !scannedCodesRef.current.has(decodedText)) {
                            scannedCodesRef.current.add(decodedText);
                            setScanned(decodedText);
                            setIsScanning(false);
                            scanner.stop().then(() => {
                                router.push(`/admin/tickets/${decodedText}`);
                            }).catch(() => {
                                router.push(`/admin/tickets/${decodedText}`);
                            });
                        }
                    },
                    (errorMessage) => {
                        // Bỏ qua lỗi quét liên tục, chỉ hiển thị lỗi nghiêm trọng
                    }
                );
                setIsScanning(true);
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError("Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera.");
                setIsScanning(false);
            }
        };

        startScanning();

        // Cleanup khi component unmount
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, [router]);

    return (
        <div className="flex flex-col items-center gap-4 p-4 min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Quét mã vé xem phim 🎟️</h2>

            <div 
                ref={containerRef}
                id="qr-reader"
                className="rounded-xl overflow-hidden shadow-2xl w-full max-w-[400px] bg-black"
            />

            {error && (
                <div className="text-red-600 text-sm mt-2 text-center max-w-[400px]">
                    {error}
                </div>
            )}
            
            {isScanning && !scanned && (
                <p className="text-blue-600 text-sm mt-2">
                    Đang quét mã QR... Hãy đưa mã QR vào khung hình
                </p>
            )}
            
            {scanned && (
                <div className="text-green-600 text-sm mt-3 text-center">
                    <p className="font-semibold">✅ Đã quét thành công!</p>
                    <p className="text-xs mt-1">Mã: {scanned}</p>
                    <p className="text-xs mt-1 text-gray-600">Đang chuyển hướng...</p>
                </div>
            )}
        </div>
    );
}
