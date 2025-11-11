// Booking related types and enums
import {TicketResponseDto} from "@/models/ticket";

export enum BookingStatus {
  Pending = 1,
  Confirmed = 2,
  Canceled = 3,
  Expired = 4,
  Refunding = 5,
  Refunded = 6
}

export enum BookingItemStatus {
  Pending = 1,
  Confirmed = 2,
  Canceled = 3,
  Expired = 4
}

export enum TicketStatus {
  Issued = 1,
  Void = 2
}

export interface Booking {
  id: string;
  code: string;
  userId?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
  status: BookingStatus;
  holdExpiresAt?: string;
  totalAmountMinor: number;
  currency: string;
  customerContactJson?: string;
  createdAt: string;
  updatedAt?: string;
  items?: BookingItem[];
  tickets?: Ticket[];
}

export interface BookingItem {
  id: string;
  bookingId: string;
  booking?: Booking;
  showtimeId: string;
  showtime?: {
    id: string;
    startUtc: string;
    endUtc: string;
    movie: {
      id: string;
      title: string;
      posterUrl?: string;
    };
    room: {
      id: string;
      name: string;
      cinema: {
        id: string;
        name: string;
        address: string;
      };
    };
  };
  seatId: string;
  seat?: {
    id: string;
    rowLabel: string;
    seatNumber: number;
    seatType: number;
  };
  seatPriceMinor: number;
  priceCategory?: string;
  status: BookingItemStatus;
  createdAt: string;
}

export interface Ticket {
  id: string;
  bookingId: string;
  booking?: Booking;
  showtimeId: string;
  showtime?: {
    id: string;
    startUtc: string;
    endUtc: string;
    movie: {
      id: string;
      title: string;
    };
    room: {
      id: string;
      name: string;
      cinema: {
        id: string;
        name: string;
      };
    };
  };
  seatId: string;
  seat?: {
    id: string;
    rowLabel: string;
    seatNumber: number;
    seatType: number;
  };
  ticketCode: string;
  ticketQr?: string;
  status: TicketStatus;
  issuedAt: string;
}

// DTOs for API requests - matches CreateBookingDto
export interface CreateBookingDto {
  showtimeId: string;
  seatIds: string[];
  promotionCode?: string;
}

// Matches ConfirmBookingDto
export interface ConfirmBookingDto {
  paymentId: string;
}

// Matches CancelBookingDto
export interface CancelBookingDto {
  reason?: string;
}

// Matches BookingSearchDto
export interface BookingSearchDto {
  userId?: string;
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response types - matches BookingResponseDto
export interface BookingResponseDto {
  id: string;
  code: string;
  userId?: string;
  user?: UserInfoDto;
  status: BookingStatus;
  totalAmountMinor: number;
  currency: string;
  bookingQr?: string;
  customerInfo?: CustomerInfoDto;
  createdAt: string;
  updatedAt?: string;
  items: BookingItemResponseDto[];
  tickets: TicketResponseDto[];
}

// Matches BookingItemResponseDto
export interface BookingItemResponseDto {
  id: string;
  showtimeId: string;
  showtime: ShowtimeInfoDto;
  seatId: string;
  seat: SeatInfoDto;
  seatPriceMinor: number;
  priceCategory?: string;
  status: BookingItemStatus;
  createdAt: string;
}

// Matches BookingListItemDto
export interface BookingListItemDto {
  id: string;
  code: string;
  currency: string;
  totalAmountMinor: number;
  status: BookingStatus;
  createdAt: string;
  movieTitle?: string;
  startUtc?: string;
  cinemaName?: string;
  seatsCount: number;
}

// Matches BookingListLightResultDto
export interface BookingListLightResultDto {
  items: BookingListItemDto[];
  page: number;
  pageSize: number;
  totalItems: number;
}

// Common DTOs used in booking responses
export interface UserInfoDto {
  id: string;
  email: string;
  fullName: string;
}

export interface CustomerInfoDto {
  fullName: string;
  email: string;
  phone?: string;
}

export interface ShowtimeInfoDto {
  id: string;
  movieId: string;
  movieTitle: string;
  roomId: string;
  roomName: string;
  cinemaId: string;
  cinemaName: string;
  startUtc: string;
  endUtc: string;
  language: string;
  format: string;
}

export interface SeatInfoDto {
  id: string;
  rowLabel: string;
  seatNumber: number;
  seatType: number; // SeatType enum value
}

// TicketResponseDto is now exported from './ticket' to avoid duplication

