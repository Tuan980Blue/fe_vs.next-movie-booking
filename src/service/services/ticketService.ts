import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  BookingVerifyResponseDto,
} from '../../models';

/**
 * Verify QR code / Booking code (Manager/Admin only)
 * Returns booking details with all tickets
 */
export async function verifyQrCodeApi(qrCode: string): Promise<BookingVerifyResponseDto> {
  const { data } = await httpClient.get(endpoints.tickets.verifyQr(qrCode));
  return data;
}

/**
 * Check-in booking (Manager/Admin only)
 * Check-in all tickets in a booking
 */
export async function checkInBookingApi(bookingCode: string): Promise<BookingVerifyResponseDto> {
  const { data } = await httpClient.post(endpoints.tickets.checkIn(bookingCode));
  return data;
}

