// Showtime related types and enums
export enum MovieFormat {
  TwoD = 1,
  ThreeD = 2,
  Imax = 3
}

export interface Showtime {
  id: string;
  movieId: string;
  movie?: {
    id: string;
    title: string;
    durationMinutes: number;
    posterUrl?: string;
  };
  roomId: string;
  room?: {
    id: string;
    name: string;
    code: string;
    cinema: {
      id: string;
      name: string;
      address: string;
      city: string;
    };
  };
  startUtc: string;
  endUtc: string;
  language: string;
  subtitle: boolean;
  format: MovieFormat;
  basePriceMinor: number;
  createdAt: string;
}

// DTOs for API requests
export interface CreateShowtimeRequest {
  movieId: string;
  roomId: string;
  startUtc: string;
  endUtc: string;
  language?: string;
  subtitle?: boolean;
  format?: MovieFormat;
  basePriceMinor: number;
}

export interface UpdateShowtimeRequest {
  movieId?: string;
  roomId?: string;
  startUtc?: string;
  endUtc?: string;
  language?: string;
  subtitle?: boolean;
  format?: MovieFormat;
  basePriceMinor?: number;
}

// Backend response type - matches ShowtimeReadDto exactly
export interface ShowtimeReadDto {
  id: string;
  movieId: string;
  movieTitle: string;
  movieDurationMinutes: number;
  moviePosterUrl?: string | null;
  roomId: string;
  roomName: string;
  roomCode: string;
  cinemaId: string;
  cinemaName: string;
  cinemaAddress: string;
  startUtc: string;
  endUtc: string;
  language: string;
  subtitle: boolean;
  format: string; // "TwoD", "ThreeD", "Imax"
  basePriceMinor: number;
  createdAt: string;
}

// Matches ShowtimeSearchDto
export interface ShowtimeSearchDto {
  movieId?: string;
  cinemaId?: string;
  roomId?: string;
  dateFrom?: string;
  dateTo?: string;
  language?: string;
  format?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Matches CreateShowtimeDto
export interface CreateShowtimeDto {
  movieId: string;
  roomId: string;
  startUtc: string;
  endUtc: string;
  language?: string;
  subtitle?: boolean;
  format?: string;
  basePriceMinor: number;
}

// Matches UpdateShowtimeDto
export interface UpdateShowtimeDto {
  movieId: string;
  roomId: string;
  startUtc: string;
  endUtc: string;
  language?: string;
  subtitle?: boolean;
  format?: string;
  basePriceMinor: number;
}

// API Response types
export interface ShowtimeResponse {
  id: string;
  movieId: string;
  movie: {
    id: string;
    title: string;
    durationMinutes: number;
    posterUrl?: string;
  };
  roomId: string;
  room: {
    id: string;
    name: string;
    code: string;
    cinema: {
      id: string;
      name: string;
      address: string;
      city: string;
    };
  };
  startUtc: string;
  endUtc: string;
  language: string;
  subtitle: boolean;
  format: MovieFormat;
  basePriceMinor: number;
  createdAt: string;
  availableSeats?: number;
  totalSeats?: number;
}

export interface ShowtimeListResponse {
  items: ShowtimeResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Search and filter types
export interface ShowtimeSearchParams {
  page?: number;
  pageSize?: number;
  movieId?: string;
  cinemaId?: string;
  roomId?: string;
  date?: string; // YYYY-MM-DD format
  format?: MovieFormat;
  language?: string;
  sort?: 'startUtc' | 'basePriceMinor';
  order?: 'asc' | 'desc';
}

