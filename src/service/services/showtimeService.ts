import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  ShowtimeReadDto,
  ShowtimeSearchDto,
  CreateShowtimeDto,
  UpdateShowtimeDto,
  PagedResult,
} from '../../models';

/**
 * Fetch paginated list of showtimes
 */
export async function getShowtimesApi(params: ShowtimeSearchDto = {}): Promise<PagedResult<ShowtimeReadDto>> {
  const { data } = await httpClient.get(endpoints.showtimes.list, { params });
  return data;
}

/**
 * Fetch showtime detail by ID
 */
export async function getShowtimeByIdApi(id: string): Promise<ShowtimeReadDto> {
  const { data } = await httpClient.get(endpoints.showtimes.detail(id));
  return data;
}

/**
 * Fetch showtimes for a specific movie
 */
export async function getShowtimesByMovieApi(movieId: string): Promise<ShowtimeReadDto[]> {
  const { data } = await httpClient.get(endpoints.showtimes.byMovie(movieId));
  return data;
}

/**
 * Create new showtime (Admin/Manager only)
 */
export async function createShowtimeApi(payload: CreateShowtimeDto): Promise<ShowtimeReadDto> {
  const { data } = await httpClient.post(endpoints.showtimes.create, payload);
  return data;
}

/**
 * Update showtime (Admin/Manager only)
 */
export async function updateShowtimeApi(id: string, payload: UpdateShowtimeDto): Promise<ShowtimeReadDto> {
  const { data } = await httpClient.put(endpoints.showtimes.update(id), payload);
  return data;
}

/**
 * Delete showtime (Admin only)
 */
export async function deleteShowtimeApi(id: string): Promise<void> {
  await httpClient.delete(endpoints.showtimes.delete(id));
}



