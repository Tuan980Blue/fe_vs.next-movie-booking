// Cinema related types and enums
export enum EntityStatus {
  Active = 1,
  Inactive = 2
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  status: EntityStatus;
  createdAt: string;
  rooms?: Room[];
}

export interface Room {
  id: string;
  cinemaId: string;
  cinema?: Cinema;
  name: string;
  code: string;
  totalSeats: number;
  status: EntityStatus;
  createdAt: string;
  seats?: {
    id: string;
    rowLabel: string;
    seatNumber: number;
    seatType: number;
    isActive: boolean;
  }[];
}

// DTOs for API requests
export interface CreateCinemaRequest {
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
}

export interface UpdateCinemaRequest {
  name?: string;
  address?: string;
  city?: string;
  lat?: number;
  lng?: number;
  status?: EntityStatus;
}

export interface CreateRoomRequest {
  cinemaId: string;
  name: string;
  code: string;
  totalSeats: number;
}

export interface UpdateRoomRequest {
  name?: string;
  code?: string;
  totalSeats?: number;
  status?: EntityStatus;
}

// API Response types - matches CinemaReadDto
export interface CinemaReadDto {
  id: string;
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  status: string; // "Active", "Inactive" - backend returns string
  createdAt: string;
  totalRooms: number;
  activeRooms: number;
}

// Matches CinemaListDto
export interface CinemaListDto {
  id: string;
  name: string;
  address: string;
  city: string;
  status: string;
  createdAt: string;
  totalRooms: number;
}

// Matches CinemaStatsDto
export interface CinemaStatsDto {
  totalRooms: number;
  activeRooms: number;
  inactiveRooms: number;
  totalSeats: number;
}

// Matches CinemaSearchDto
export interface CinemaSearchDto {
  search?: string;
  city?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Matches ChangeCinemaStatusDto
export interface ChangeCinemaStatusDto {
  status: string;
}

// Alias for backward compatibility
export interface CinemaResponse extends CinemaReadDto {}

// Matches RoomReadDto
export interface RoomReadDto {
  id: string;
  cinemaId: string;
  cinemaName: string;
  name: string;
  code: string;
  totalSeats: number;
  status: string; // "Active", "Inactive" - backend returns string
  createdAt: string;
}

// Matches RoomListDto
export interface RoomListDto {
  id: string;
  cinemaId: string;
  cinemaName: string;
  name: string;
  code: string;
  totalSeats: number;
  status: string;
  createdAt: string;
}

// Matches RoomStatsDto
export interface RoomStatsDto {
  totalSeats: number;
  activeShowtimes: number;
  totalShowtimes: number;
}

// Matches RoomSearchDto
export interface RoomSearchDto {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Matches ChangeRoomStatusDto
export interface ChangeRoomStatusDto {
  status: string;
}

// Alias for backward compatibility
export interface RoomResponse extends RoomReadDto {}

export interface RoomListResponse {
  items: RoomResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Search and filter types
export interface CinemaSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  city?: string;
  status?: EntityStatus;
  sort?: 'name' | 'city' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface RoomSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: EntityStatus;
  sort?: 'name' | 'code' | 'totalSeats' | 'createdAt';
  order?: 'asc' | 'desc';
}

