import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type { SeatLayoutUi } from '@/models/seat';

/**
 * Fetch seats list for a room
 */
export async function getSeatsApi(cinemaId: string, roomId: string, params = {}) {
  const { data } = await httpClient.get(endpoints.seats.list(cinemaId, roomId), { params });
  return data;
}

/**
 * Fetch seat layout for a room (for frontend display)
 */
export async function getSeatLayoutApi(cinemaId: string, roomId: string): Promise<SeatLayoutUi> {
  const { data } = await httpClient.get(endpoints.seats.layout(cinemaId, roomId));
  return data as SeatLayoutUi;
}

/**
 * Fetch single seat detail
 */
export async function getSeatDetailApi(cinemaId: string, roomId: string, id: string) {
  const { data } = await httpClient.get(endpoints.seats.detail(cinemaId, roomId, id));
  return data;
}

/**
 * Fetch available seats in a room
 */
export async function getAvailableSeatsApi(cinemaId: string, roomId: string) {
  const { data } = await httpClient.get(endpoints.seats.available(cinemaId, roomId));
  return data;
}

/**
 * Fetch seats by type
 */
export async function getSeatsByTypeApi(cinemaId: string, roomId: string, seatType: string) {
  const { data } = await httpClient.get(endpoints.seats.byType(cinemaId, roomId, seatType));
  return data;
}

/**
 * Get seat statistics for a room
 */
export async function getSeatStatsApi(cinemaId: string, roomId: string) {
  const { data } = await httpClient.get(endpoints.seats.stats(cinemaId, roomId));
  return data;
}

/**
 * Create new seat (Admin/Manager only)
 */
export async function createSeatApi(cinemaId: string, roomId: string, payload: any) {
  const { data } = await httpClient.post(endpoints.seats.create(cinemaId, roomId), payload);
  return data;
}

/**
 * Create bulk seat layout (Admin/Manager only)
 */
export async function createBulkSeatLayoutApi(cinemaId: string, roomId: string, payload: any) {
  const { data } = await httpClient.post(endpoints.seats.createBulkLayout(cinemaId, roomId), payload);
  return data;
}

/**
 * Update seat (Admin/Manager only)
 */
export async function updateSeatApi(cinemaId: string, roomId: string, id: string, payload: any) {
  const { data } = await httpClient.put(endpoints.seats.update(cinemaId, roomId, id), payload);
  return data;
}

/**
 * Delete seat (Admin only)
 */
export async function deleteSeatApi(cinemaId: string, roomId: string, id: string) {
  const { data } = await httpClient.delete(endpoints.seats.delete(cinemaId, roomId, id));
  return data;
}

/**
 * Delete all seats in a room (Admin only)
 */
export async function deleteAllSeatsApi(cinemaId: string, roomId: string) {
  const { data } = await httpClient.delete(endpoints.seats.deleteAll(cinemaId, roomId));
  return data;
}
