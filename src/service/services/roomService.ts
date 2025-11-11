import endpoints from '../api/endpoints';
import httpClient from '../api/httpClient';
import type {
  RoomSearchDto,
  RoomReadDto,
  RoomStatsDto,
  CreateRoomRequest,
  UpdateRoomRequest,
  ChangeRoomStatusDto,
  PagedResult,
} from '../../models';

/**
 * Fetch rooms list for a cinema
 */
export async function getRoomsApi(cinemaId: string, params: RoomSearchDto = {}): Promise<PagedResult<RoomReadDto>> {
  const { data } = await httpClient.get(endpoints.rooms.list(cinemaId), { params });
  return data;
}

/**
 * Fetch single room detail
 */
export async function getRoomDetailApi(cinemaId: string, id: string): Promise<RoomReadDto> {
  const { data } = await httpClient.get(endpoints.rooms.detail(cinemaId, id));
  return data;
}

/**
 * Create new room (Admin/Manager only)
 */
export async function createRoomApi(cinemaId: string, payload: CreateRoomRequest): Promise<RoomReadDto> {
  const { data } = await httpClient.post(endpoints.rooms.create(cinemaId), payload);
  return data;
}

/**
 * Update room (Admin/Manager only)
 */
export async function updateRoomApi(cinemaId: string, id: string, payload: UpdateRoomRequest): Promise<RoomReadDto> {
  const { data } = await httpClient.put(endpoints.rooms.update(cinemaId, id), payload);
  return data;
}

/**
 * Delete room (Admin only)
 */
export async function deleteRoomApi(cinemaId: string, id: string): Promise<void> {
  await httpClient.delete(endpoints.rooms.delete(cinemaId, id));
}

/**
 * Change room status (Admin/Manager only)
 */
export async function changeRoomStatusApi(cinemaId: string, id: string, payload: ChangeRoomStatusDto): Promise<RoomReadDto> {
  const { data } = await httpClient.patch(endpoints.rooms.changeStatus(cinemaId, id), payload);
  return data;
}

/**
 * Get room statistics (Admin/Manager only)
 */
export async function getRoomStatsApi(cinemaId: string, id: string): Promise<RoomStatsDto> {
  const { data } = await httpClient.get(endpoints.rooms.stats(cinemaId, id));
  return data;
}


