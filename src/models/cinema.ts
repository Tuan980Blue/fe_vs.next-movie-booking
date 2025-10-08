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

// API Response types
export interface CinemaResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  status: EntityStatus;
  createdAt: string;
  rooms?: RoomResponse[];
}

export interface RoomResponse {
  id: string;
  cinemaId: string;
  name: string;
  code: string;
  totalSeats: number;
  status: EntityStatus;
  createdAt: string;
  availableSeats?: number;
  occupiedSeats?: number;
}

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

