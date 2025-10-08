import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import { MovieSearchParams, MovieResponse, MovieListResponse } from '../../models/movie';

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


