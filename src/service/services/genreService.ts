import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  GenreReadDto,
  CreateGenreDto,
  UpdateGenreDto,
} from '../../models';

/**
 * Fetch all genres
 */
export async function getGenresApi(): Promise<GenreReadDto[]> {
  const { data } = await httpClient.get(endpoints.genres.list);
  return data;
}

/**
 * Fetch single genre detail
 */
export async function getGenreDetailApi(id: string): Promise<GenreReadDto> {
  const { data } = await httpClient.get(endpoints.genres.detail(id));
  return data;
}

/**
 * Create new genre (Admin only)
 */
export async function createGenreApi(payload: CreateGenreDto): Promise<GenreReadDto> {
  const { data } = await httpClient.post(endpoints.genres.create, payload);
  return data;
}

/**
 * Update genre (Admin only)
 */
export async function updateGenreApi(id: string, payload: UpdateGenreDto): Promise<GenreReadDto> {
  const { data } = await httpClient.put(endpoints.genres.update(id), payload);
  return data;
}

/**
 * Delete genre (Admin only)
 */
export async function deleteGenreApi(id: string): Promise<void> {
  await httpClient.delete(endpoints.genres.delete(id));
}
