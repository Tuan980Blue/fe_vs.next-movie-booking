import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  BookingSearchDto,
  BookingResponseDto,
  BookingListLightResultDto,
  CreateBookingDto,
  ConfirmBookingDto,
  CancelBookingDto,
} from '../../models/booking';

/**
 * Fetch paginated list of bookings (Admin only)
 */
export async function getBookingsApi(params: BookingSearchDto = {}): Promise<BookingListLightResultDto> {
  const { data } = await httpClient.get(endpoints.bookings.list, { params });
  return data;
}

/**
 * Fetch current user's bookings
 */
export async function getMyBookingsApi(params: BookingSearchDto = {}): Promise<BookingListLightResultDto> {
  const { data } = await httpClient.get(endpoints.bookings.me, { params });
  return data;
}

/**
 * Fetch single booking detail by ID
 */
export async function getBookingDetailApi(id: string): Promise<BookingResponseDto> {
  const { data } = await httpClient.get(endpoints.bookings.detail(id));
  return data;
}

/**
 * Fetch single booking detail by booking code
 */
export async function getBookingByCodeApi(code: string): Promise<BookingResponseDto> {
  const { data } = await httpClient.get(endpoints.bookings.byCode(code));
  return data;
}

/**
 * Create new booking (returns draft)
 */
export async function createBookingApi(payload: CreateBookingDto): Promise<BookingResponseDto> {
  const { data } = await httpClient.post(endpoints.bookings.create, payload);
  return data;
}

/**
 * Confirm booking after payment success
 */
export async function confirmBookingApi(id: string, payload: ConfirmBookingDto): Promise<BookingResponseDto> {
  const { data } = await httpClient.post(endpoints.bookings.confirm(id), payload);
  return data;
}

/**
 * Cancel booking
 */
export async function cancelBookingApi(id: string, payload?: CancelBookingDto): Promise<BookingResponseDto> {
  const { data } = await httpClient.post(endpoints.bookings.cancel(id), payload || {});
  return data;
}
