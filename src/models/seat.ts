// Seat related types and enums
export enum SeatType {
  Standard = 1,    // Ghế thường
  Vip = 2,         // Ghế VIP
  Couple = 3,      // Ghế đôi
  Accessible = 4   // Ghế khuyết tật
}

export interface Seat {
  id: string;
  roomId: string;
  room?: {
    id: string;
    name: string;
    code: string;
    cinema: {
      id: string;
      name: string;
    };
  };
  rowLabel: string;        // A, B, C...
  seatNumber: number;      // 1, 2, 3...
  positionX?: number;      // Tọa độ X trong layout
  positionY?: number;      // Tọa độ Y trong layout
  seatType: SeatType;
  isActive: boolean;
  specialNotes?: string;   // Ghi chú đặc biệt
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;      // User tạo ghế
  updatedBy?: string;      // User cập nhật ghế
}

// DTOs for API requests - matches CreateSeatDto
export interface CreateSeatDto {
  rowLabel: string;
  seatNumber: number;
  seatType: string; // "Standard", "Vip", "Couple", "Accessible"
  isActive?: boolean;
  positionX?: number;
  positionY?: number;
  specialNotes?: string;
}

// Matches UpdateSeatDto
export interface UpdateSeatDto {
  rowLabel: string;
  seatNumber: number;
  seatType: string;
  isActive: boolean;
  positionX?: number;
  positionY?: number;
  specialNotes?: string;
}

// Matches CreateSeatLayoutDto
export interface CreateSeatLayoutDto {
  rows: number;
  seatsPerRow: number;
  rowStartLabel?: string;
  defaultSeatType: string;
  startPositionX?: number;
  startPositionY?: number;
  seatSpacingX?: number;
  seatSpacingY?: number;
  coupleRows?: string[];
  coupleSpacingY?: number;
  coupleSpacingX?: number;
}

// Matches SeatSearchDto
export interface SeatSearchDto {
  rowLabel?: string;
  seatNumber?: number;
  seatType?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// API Response types - matches SeatReadDto
export interface SeatReadDto {
  id: string;
  roomId: string;
  rowLabel: string;
  seatNumber: number;
  seatType: string; // "Standard", "Vip", "Couple", "Accessible"
  isActive: boolean;
  positionX?: number;
  positionY?: number;
  specialNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Matches SeatListDto
export interface SeatListDto {
  id: string;
  rowLabel: string;
  seatNumber: number;
  seatType: string;
  isActive: boolean;
  positionX?: number;
  positionY?: number;
  specialNotes?: string;
}

// Matches SeatLayoutDto
export interface SeatLayoutDto {
  roomId: string;
  roomName: string;
  rows: SeatRowDto[];
  seatTypes: SeatTypeInfoDto[];
  screenPosition: string;
}

// Matches SeatRowDto
export interface SeatRowDto {
  rowLabel: string;
  seats: SeatDto[];
}

// Matches SeatDto (in layout)
export interface SeatDto {
  id: string;
  rowLabel: string;
  seatNumber: number;
  seatType: string;
  isActive: boolean;
  positionX?: number;
  positionY?: number;
  specialNotes?: string;
}

// Matches SeatTypeInfoDto
export interface SeatTypeInfoDto {
  type: string;
  name: string;
  color: string;
  description: string;
}

// Matches SeatStatsDto
export interface SeatStatsDto {
  totalSeats: number;
  activeSeats: number;
  seatsByType: Record<string, number>;
}

// Alias for backward compatibility
export type SeatResponse = SeatReadDto;

export interface SeatLayoutResponse {
  roomId: string;
  roomName: string;
  totalSeats: number;
  availableSeats: number;
  occupiedSeats: number;
  seats: SeatResponse[];
  seatMap: {
    [rowLabel: string]: SeatResponse[];
  };
}

// Seat selection for booking
export interface SeatSelection {
  seatId: string;
  rowLabel: string;
  seatNumber: number;
  seatType: SeatType;
  priceMinor: number;
}

// UI-friendly seat layout types used by the frontend components
export interface SeatUi {
  id: string;
  rowLabel: string;
  seatNumber: number;
  positionX?: number;
  seatType: string | number;
  isActive?: boolean;
}

export interface SeatRowUi {
  rowLabel: string;
  seats: SeatUi[];
}

export interface SeatLegendItem {
  type: string;
  color: string;
}

export interface SeatLayoutUi {
  rows: SeatRowUi[];
  seatTypes?: SeatLegendItem[];
}

