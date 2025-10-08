import endpoints from '../api/endpoints';
import httpClient from '../api/httpClient';
import { RoomSearchParams, RoomResponse, RoomListResponse } from '../../models';

/**
 * Fetch rooms list for a cinema
 */
export async function getRoomsApi(cinemaId: string, params: RoomSearchParams = {}): Promise<RoomListResponse> {
  const { data } = await httpClient.get(endpoints.rooms.list(cinemaId), { params });
  return data;
}

/**
 * Fetch single room detail
 */
export async function getRoomDetailApi(cinemaId: string, id: string): Promise<RoomResponse> {
  const { data } = await httpClient.get(endpoints.rooms.detail(cinemaId, id));
  return data;
}

/**
 * Create new room (Admin/Manager only)
 */
export async function createRoomApi(cinemaId: string, payload: any) {
  const { data } = await httpClient.post(endpoints.rooms.create(cinemaId), payload);
  return data;
}

/**
 * Update room (Admin/Manager only)
 */
export async function updateRoomApi(cinemaId: string, id: string, payload: any) {
  const { data } = await httpClient.put(endpoints.rooms.update(cinemaId, id), payload);
  return data;
}

/**
 * Delete room (Admin only)
 */
export async function deleteRoomApi(cinemaId: string, id: string) {
  const { data } = await httpClient.delete(endpoints.rooms.delete(cinemaId, id));
  return data;
}

/**
 * Change room status (Admin/Manager only)
 */
export async function changeRoomStatusApi(cinemaId: string, id: string, payload: any) {
  const { data } = await httpClient.patch(endpoints.rooms.changeStatus(cinemaId, id), payload);
  return data;
}

/**
 * Get room statistics (Admin/Manager only)
 */
export async function getRoomStatsApi(cinemaId: string, id: string) {
  const { data } = await httpClient.get(endpoints.rooms.stats(cinemaId, id));
  return data;
}


