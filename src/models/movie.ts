// Movie related types and enums
export enum MovieStatus {
  Draft = 0,
  ComingSoon = 1,
  NowShowing = 2,
  Archived = 3
}

export interface Genre {
  id: string;
  name: string;
  movieGenres?: MovieGenre[];
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  durationMinutes: number;
  rated?: string;
  description?: string;
  releaseDate?: string;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  director?: string;
  actors?: string;
  status: MovieStatus;
  createdAt: string;
  updatedAt?: string;
  movieGenres?: MovieGenre[];
  genres?: Genre[]; // For easier access to genre names
}

export interface MovieGenre {
  movieId: string;
  movie?: Movie;
  genreId: string;
  genre?: Genre;
}

// DTOs for API requests
export interface CreateMovieRequest {
  title: string;
  originalTitle?: string;
  durationMinutes: number;
  rated?: string;
  description?: string;
  releaseDate?: string;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  director?: string;
  actors?: string;
  status?: MovieStatus;
  genreIds?: string[];
}

export interface UpdateMovieRequest {
  title?: string;
  originalTitle?: string;
  durationMinutes?: number;
  rated?: string;
  description?: string;
  releaseDate?: string;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  director?: string;
  actors?: string;
  status?: MovieStatus;
  genreIds?: string[];
}

export interface CreateGenreRequest {
  name: string;
}

export interface UpdateGenreRequest {
  name: string;
}

// API Response types
export interface MovieResponse {
  id: string;
  title: string;
  originalTitle?: string;
  durationMinutes: number;
  rated?: string;
  description?: string;
  releaseDate?: string;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  director?: string;
  actors?: string;
  status: MovieStatus;
  createdAt: string;
  updatedAt?: string;
  genres: Genre[];
}

export interface GenreResponse {
  id: string;
  name: string;
  movieCount?: number;
}

export interface MovieListResponse {
  items: MovieResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Search and filter types
export interface MovieSearchParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  genre?: string;
  status?: MovieStatus;
  sort?: 'title' | 'releaseDate' | 'createdAt';
  order?: 'asc' | 'desc';
}
