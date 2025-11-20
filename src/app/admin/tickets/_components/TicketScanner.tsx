"use client";

import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCodeIcon, CameraIcon, CheckCircleIcon, XMarkIcon, StopIcon } from '@heroicons/react/24/outline';

interface TicketScannerProps {
  onScan: (code: string) => void;
  loading?: boolean;
  scannedCode?: string;
}

export default function TicketScanner({ onScan, loading, scannedCode }: TicketScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader';
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showManualInput && inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [showManualInput, loading]);

  // Clear input when scan is successful
  useEffect(() => {
    if (scannedCode && manualCode === scannedCode) {
      setManualCode('');
    }
  }, [scannedCode, manualCode]);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        setIsScanning(false);
        setCameraError(null);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const startScanning = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);

      const scanner = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = scanner;

      await scanner.start(
        {
          facingMode: 'environment' // Use back camera on mobile
        },
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Scanning area
          aspectRatio: 1.0
        },
        (decodedText) => {
          // Success callback
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Error callback - ignore, it's just scanning
        }
      );
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setCameraError(err.message || 'Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera.');
      setIsScanning(false);
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    // Stop scanning immediately when code is detected
    await stopScanning();
    
    // Call the onScan callback
    if (decodedText.trim()) {
      onScan(decodedText.trim().toUpperCase());
    }
  };

  const handleToggleMode = async () => {
    if (isScanning) {
      await stopScanning();
    }
    setShowManualInput(!showManualInput);
    setManualCode('');
    setCameraError(null);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim() && !loading) {
      onScan(manualCode.trim().toUpperCase());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && manualCode.trim() && !loading) {
      handleManualSubmit(e);
    }
  };

  // Start scanning when switching to QR mode
  useEffect(() => {
    if (!showManualInput && !isScanning && !loading) {
      startScanning();
    }
  }, [showManualInput]);

  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <QrCodeIcon className="h-5 w-5 text-primary-pink" />
          Quét mã QR / Nhập mã đơn hàng
        </h3>
        <button
          onClick={handleToggleMode}
          disabled={loading}
          className="text-sm text-primary-pink hover:text-primary-pink/80 transition-colors font-medium disabled:opacity-50"
        >
          {showManualInput ? 'Quét QR' : 'Nhập thủ công'}
        </button>
      </div>

      {showManualInput ? (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã đơn hàng / Booking Code
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                placeholder="Nhập mã đơn hàng (VD: ABC12345)..."
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-primary-pink font-mono text-lg transition-colors"
                disabled={loading}
                autoFocus
              />
              {scannedCode && manualCode === '' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Nhấn Enter hoặc click &quot;Xác minh&quot; để kiểm tra
            </p>
          </div>
          <button
            type="submit"
            disabled={!manualCode.trim() || loading}
            className="w-full px-4 py-3 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base shadow-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xác minh...
              </span>
            ) : (
              'Xác minh mã đơn hàng'
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* QR Scanner */}
          <div className="relative">
            <div
              id={qrCodeRegionId}
              className="w-full rounded-lg overflow-hidden bg-black"
              style={{ minHeight: '300px' }}
            />
            
            {isScanning && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={stopScanning}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                >
                  <StopIcon className="h-4 w-4" />
                  Dừng quét
                </button>
              </div>
            )}

            {!isScanning && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <button
                  onClick={startScanning}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors shadow-lg font-medium"
                >
                  <CameraIcon className="h-5 w-5" />
                  Bắt đầu quét QR
                </button>
              </div>
            )}
          </div>

          {/* Camera Error */}
          {cameraError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-start gap-2">
                <XMarkIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Lỗi camera</p>
                  <p className="text-sm mt-1">{cameraError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Hướng dẫn:</strong> Đưa mã QR vào khung quét. Camera sẽ tự động nhận diện mã và xác minh.
            </p>
          </div>

          {/* Switch to manual input */}
          <button
            onClick={handleToggleMode}
            className="w-full px-4 py-2 text-sm text-primary-pink hover:text-primary-pink/80 transition-colors font-medium"
          >
            Hoặc nhập mã thủ công →
          </button>
        </div>
      )}
    </div>
  );
}
