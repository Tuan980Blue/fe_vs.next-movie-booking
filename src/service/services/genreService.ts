import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';

/**
 * Fetch all genres
 */
export async function getGenresApi() {
  const { data } = await httpClient.get(endpoints.genres.list);
  return data;
}

/**
 * Fetch single genre detail
 */
export async function getGenreDetailApi(id: string) {
  const { data } = await httpClient.get(endpoints.genres.detail(id));
  return data;
}

/**
 * Create new genre (Admin only)
 */
export async function createGenreApi(payload: any) {
  const { data } = await httpClient.post(endpoints.genres.create, payload);
  return data;
}

/**
 * Update genre (Admin only)
 */
export async function updateGenreApi(id: string, payload: any) {
  const { data } = await httpClient.put(endpoints.genres.update(id), payload);
  return data;
}

/**
 * Delete genre (Admin only)
 */
export async function deleteGenreApi(id: string) {
  const { data } = await httpClient.delete(endpoints.genres.delete(id));
  return data;
}
