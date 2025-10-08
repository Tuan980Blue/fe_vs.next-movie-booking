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

// DTOs for API requests
export interface CreateSeatRequest {
  roomId: string;
  rowLabel: string;
  seatNumber: number;
  positionX?: number;
  positionY?: number;
  seatType?: SeatType;
  isActive?: boolean;
  specialNotes?: string;
}

export interface UpdateSeatRequest {
  rowLabel?: string;
  seatNumber?: number;
  positionX?: number;
  positionY?: number;
  seatType?: SeatType;
  isActive?: boolean;
  specialNotes?: string;
}

export interface CreateMultipleSeatsRequest {
  roomId: string;
  seats: {
    rowLabel: string;
    seatNumber: number;
    positionX?: number;
    positionY?: number;
    seatType?: SeatType;
    isActive?: boolean;
    specialNotes?: string;
  }[];
}

// API Response types
export interface SeatResponse {
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
  rowLabel: string;
  seatNumber: number;
  positionX?: number;
  positionY?: number;
  seatType: SeatType;
  isActive: boolean;
  specialNotes?: string;
  createdAt: string;
  updatedAt?: string;
  isAvailable?: boolean; // For showtime-specific availability
  priceMinor?: number;   // For showtime-specific pricing
}

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

