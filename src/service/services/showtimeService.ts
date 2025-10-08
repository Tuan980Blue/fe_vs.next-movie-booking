import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import { ShowtimeSearchParams, ShowtimeListResponse } from '../../models/showtime';
import type { ApiResponse } from '../../models/common';

/**
 * Fetch paginated list of showtimes
 * params can include: page, pageSize, date, movieId, theaterId, auditoriumId, sort
 * Returns shape: { items: Showtime[], page, pageSize, totalItems }
 */
export async function getShowtimesApi(params: ShowtimeSearchParams = {}): Promise<ShowtimeListResponse> {
  const { data } = await httpClient.get(endpoints.showtimes.list, { params });
  // Support both raw paginated response and ApiResponse wrapper
  const wrapped = data as ApiResponse<ShowtimeListResponse>;
  const isWrapped = typeof wrapped === 'object' && wrapped !== null && 'success' in wrapped && 'data' in wrapped;
  return (isWrapped ? wrapped.data : data) as ShowtimeListResponse;
}

/**
 * Fetch showtimes for a specific movie
 */
export async function getShowtimesByMovieApi(movieId: string, params: ShowtimeSearchParams = {}): Promise<ShowtimeListResponse> {
  const { data } = await httpClient.get(endpoints.showtimes.byMovie(movieId), { params });
  // Support both raw paginated response and ApiResponse wrapper
  const wrapped = data as ApiResponse<ShowtimeListResponse>;
  const isWrapped = typeof wrapped === 'object' && wrapped !== null && 'success' in wrapped && 'data' in wrapped;
  return (isWrapped ? wrapped.data : data) as ShowtimeListResponse;
}



