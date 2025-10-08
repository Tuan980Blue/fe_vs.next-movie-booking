import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';

/**
 * Fetch paginated list of bookings
 * params can include: page, pageSize, userId, status, dateFrom, dateTo
 */
export async function getBookingsApi(params = {}) {
  const { data } = await httpClient.get(endpoints.bookings.list, { params });
  return data;
}

/**
 * Fetch single booking detail
 */
export async function getBookingDetailApi(id: string) {
  const { data } = await httpClient.get(endpoints.bookings.detail(id));
  return data;
}

/**
 * Create new booking
 */
export async function createBookingApi(payload: any) {
  const { data } = await httpClient.post(endpoints.bookings.create, payload);
  return data;
}

/**
 * Update booking
 */
export async function updateBookingApi(id: string, payload: any) {
  const { data } = await httpClient.put(endpoints.bookings.update(id), payload);
  return data;
}

/**
 * Cancel booking
 */
export async function cancelBookingApi(id: string, payload: any) {
  const { data } = await httpClient.post(endpoints.bookings.cancel(id), payload);
  return data;
}

/**
 * Confirm booking
 */
export async function confirmBookingApi(id: string, payload: any) {
  const { data } = await httpClient.post(endpoints.bookings.confirm(id), payload);
  return data;
}
