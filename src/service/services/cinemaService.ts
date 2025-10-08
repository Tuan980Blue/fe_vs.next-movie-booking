import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';

/**
 * Fetch paginated list of cinemas
 * params can include: page, pageSize, search, city, status
 */
export async function getCinemasApi(params = {}) {
  const { data } = await httpClient.get(endpoints.cinemas.list, { params });
  return data;
}

/**
 * Fetch single cinema detail
 */
export async function getCinemaDetailApi(id: string) {
  const { data } = await httpClient.get(endpoints.cinemas.detail(id));
  return data;
}

/**
 * Create new cinema (Admin/Manager only)
 */
export async function createCinemaApi(payload: any) {
  const { data } = await httpClient.post(endpoints.cinemas.create, payload);
  return data;
}

/**
 * Update cinema (Admin/Manager only)
 */
export async function updateCinemaApi(id: string, payload: any) {
  const { data } = await httpClient.put(endpoints.cinemas.update(id), payload);
  return data;
}

/**
 * Delete cinema (Admin only)
 */
export async function deleteCinemaApi(id: string) {
  const { data } = await httpClient.delete(endpoints.cinemas.delete(id));
  return data;
}

/**
 * Change cinema status (Admin/Manager only)
 */
export async function changeCinemaStatusApi(id: string, payload: any) {
  const { data } = await httpClient.patch(endpoints.cinemas.changeStatus(id), payload);
  return data;
}

/**
 * Get cinema statistics (Admin/Manager only)
 */
export async function getCinemaStatsApi(id: string) {
  const { data } = await httpClient.get(endpoints.cinemas.stats(id));
  return data;
}
