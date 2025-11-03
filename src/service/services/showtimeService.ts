import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import {ApiResponse, ShowtimeListResponse, ShowtimeReadDto, ShowtimeSearchParams} from "@/models";

/**
 * Fetch showtime detail by ID
 * Returns a single showtime with all details
 */
export async function getShowtimeByIdApi(id: string): Promise<ShowtimeReadDto> {
  const { data } = await httpClient.get(endpoints.showtimes.detail(id));
  // Support both raw response and ApiResponse wrapper
  const wrapped = data as ApiResponse<ShowtimeReadDto>;
  const isWrapped = typeof wrapped === 'object' && wrapped !== null && 'success' in wrapped && 'data' in wrapped;
  return (isWrapped ? wrapped.data : data) as ShowtimeReadDto;
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



