"use client";

import { useState } from 'react';
import { verifyQrCodeApi, checkInBookingApi } from '@/service/services/ticketService';
import { BookingVerifyResponseDto } from '@/models/ticket';
import TicketScanner from '../_components/TicketScanner';
import TicketVerificationResult from '../_components/TicketVerificationResult';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function CheckTicketPage() {
  const [verificationResult, setVerificationResult] = useState<BookingVerifyResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string>('');

  const handleScan = async (code: string) => {
    setLoading(true);
    setError(null);
    setVerificationResult(null);
    setScannedCode(code);

    try {
      // Call API: api/tickets/qr/{qrCode}
      const result = await verifyQrCodeApi(code);
      setVerificationResult(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xác minh mã đơn hàng');
      console.error('Failed to verify QR code:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!verificationResult) return;

    setCheckingIn(true);
    setError(null);

    try {
      const result = await checkInBookingApi(verificationResult.bookingCode);
      setVerificationResult(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể check-in đơn hàng');
      console.error('Failed to check-in:', err);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleScanAnother = () => {
    setVerificationResult(null);
    setScannedCode('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Check-in vé</h1>
          <p className="mt-1 text-sm text-gray-600">
            Quét mã QR hoặc nhập mã đơn hàng để xác minh và check-in vé
          </p>
        </div>
        {verificationResult && (
          <button
            onClick={handleScanAnother}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Quét mã khác
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Scanner - Always visible at top */}
      <TicketScanner 
        onScan={handleScan} 
        loading={loading}
        scannedCode={scannedCode}
      />

      {/* Verification Result - Displayed right below scanner */}
      {verificationResult && (
        <div className="animate-fade-in">
          <TicketVerificationResult
            result={verificationResult}
            onCheckIn={handleCheckIn}
            checkingIn={checkingIn}
          />
        </div>
      )}
    </div>
  );
}
