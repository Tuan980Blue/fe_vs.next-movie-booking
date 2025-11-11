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

// Matches CreateGenreDto
export interface CreateGenreDto {
  name: string;
}

// Matches UpdateGenreDto
export interface UpdateGenreDto {
  name: string;
}

// Alias for backward compatibility
export interface CreateGenreRequest extends CreateGenreDto {}
export interface UpdateGenreRequest extends UpdateGenreDto {}

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

// Matches GenreReadDto
export interface GenreReadDto {
  id: string;
  name: string;
  movieCount: number;
}

// Alias for backward compatibility
export interface GenreResponse extends GenreReadDto {}

export interface MovieListResponse {
  items: MovieResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Search and filter types - matches MovieSearchDto
export interface MovieSearchDto {
  search?: string;
  genreIds?: string[];
  status?: MovieStatus;
  releaseYear?: number;
  releaseDateFrom?: string;
  releaseDateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Matches MovieStatsDto
export interface MovieStatsDto {
  totalMovies: number;
  draftMovies: number;
  comingSoonMovies: number;
  nowShowingMovies: number;
  archivedMovies: number;
}

// Alias for backward compatibility
export interface MovieSearchParams extends MovieSearchDto {}
