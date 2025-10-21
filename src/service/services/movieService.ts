import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import { 
  MovieSearchParams, 
  MovieResponse, 
  MovieListResponse, 
  CreateMovieRequest, 
  UpdateMovieRequest,
  MovieStatus,
  GenreResponse
} from '../../models/movie';

/**
 * Fetch paginated list of movies
 * params can include: page, pageSize, keyword, genre, status, sort
 * Returns shape: { items: Movie[], page, pageSize, totalItems }
 */
export async function getMoviesApi(params: MovieSearchParams = {}): Promise<MovieListResponse> {
  const { data } = await httpClient.get(endpoints.movies.list, { params });
  return data;
}

/**
 * Fetch single movie detail
 */
export async function getMovieDetailApi(id: string): Promise<MovieResponse> {
  const { data } = await httpClient.get(endpoints.movies.detail(id));
  return data;
}

/**
 * Create a new movie (Admin/Manager only)
 */
export async function createMovieApi(movieData: CreateMovieRequest): Promise<MovieResponse> {
  const { data } = await httpClient.post(endpoints.movies.create, movieData);
  return data;
}

/**
 * Update an existing movie (Admin/Manager only)
 */
export async function updateMovieApi(id: string, movieData: UpdateMovieRequest): Promise<MovieResponse> {
  const { data } = await httpClient.put(endpoints.movies.update(id), movieData);
  return data;
}

/**
 * Delete a movie (Admin only)
 */
export async function deleteMovieApi(id: string): Promise<void> {
  await httpClient.delete(endpoints.movies.delete(id));
}

/**
 * Change movie status (Admin/Manager only)
 */
export async function changeMovieStatusApi(id: string, status: MovieStatus): Promise<MovieResponse> {
  const { data } = await httpClient.patch(endpoints.movies.changeStatus(id), { status });
  return data;
}

/**
 * Get movies by status
 */
export async function getMoviesByStatusApi(status: string): Promise<MovieResponse[]> {
  const { data } = await httpClient.get(endpoints.movies.byStatus(status));
  return data;
}

/**
 * Get movie statistics (Admin only)
 */
export async function getMovieStatsApi(): Promise<{
  totalMovies: number;
  draftMovies: number;
  comingSoonMovies: number;
  nowShowingMovies: number;
  archivedMovies: number;
}> {
  const { data } = await httpClient.get(endpoints.movies.stats);
  return data;
}

/**
 * Get all genres for movie forms
 */
export async function getGenresApi(): Promise<GenreResponse[]> {
  const { data } = await httpClient.get(endpoints.genres.list);
  return data;
}


