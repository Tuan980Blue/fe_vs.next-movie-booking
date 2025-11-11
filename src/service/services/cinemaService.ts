import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  CinemaSearchDto,
  CinemaReadDto,
  CinemaStatsDto,
  CreateCinemaRequest,
  UpdateCinemaRequest,
  ChangeCinemaStatusDto,
  PagedResult,
} from '../../models';

/**
 * Fetch paginated list of cinemas
 */
export async function getCinemasApi(params: CinemaSearchDto = {}): Promise<PagedResult<CinemaReadDto>> {
  const { data } = await httpClient.get(endpoints.cinemas.list, { params });
  return data;
}

/**
 * Fetch single cinema detail
 */
export async function getCinemaDetailApi(id: string): Promise<CinemaReadDto> {
  const { data } = await httpClient.get(endpoints.cinemas.detail(id));
  return data;
}

/**
 * Create new cinema (Admin/Manager only)
 */
export async function createCinemaApi(payload: CreateCinemaRequest): Promise<CinemaReadDto> {
  const { data } = await httpClient.post(endpoints.cinemas.create, payload);
  return data;
}

/**
 * Update cinema (Admin/Manager only)
 */
export async function updateCinemaApi(id: string, payload: UpdateCinemaRequest): Promise<CinemaReadDto> {
  const { data } = await httpClient.put(endpoints.cinemas.update(id), payload);
  return data;
}

/**
 * Delete cinema (Admin only)
 */
export async function deleteCinemaApi(id: string): Promise<void> {
  await httpClient.delete(endpoints.cinemas.delete(id));
}

/**
 * Change cinema status (Admin/Manager only)
 */
export async function changeCinemaStatusApi(id: string, payload: ChangeCinemaStatusDto): Promise<CinemaReadDto> {
  const { data } = await httpClient.patch(endpoints.cinemas.changeStatus(id), payload);
  return data;
}

/**
 * Get cinema statistics (Admin/Manager only)
 */
export async function getCinemaStatsApi(id: string): Promise<CinemaStatsDto> {
  const { data } = await httpClient.get(endpoints.cinemas.stats(id));
  return data;
}
