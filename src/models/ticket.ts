// Ticket related types - matches backend TicketDtos
import { TicketStatus } from './booking';

// Re-export types from booking for convenience
export type { ShowtimeInfoDto, SeatInfoDto, CustomerInfoDto } from './booking';

// Matches TicketResponseDto
export interface TicketResponseDto {
  id: string;
  ticketCode: string;
  ticketQr?: string;
  showtimeId: string;
  seatId: string;
  status: TicketStatus;
  issuedAt: string;
  checkedInAt?: string;
  checkedInBy?: string;
}

// Matches TicketInfoDto
export interface TicketInfoDto {
  id: string;
  ticketCode: string;
  showtimeId: string;
  showtime: ShowtimeInfoDto;
  seatId: string;
  seat: SeatInfoDto;
  status: TicketStatus;
  issuedAt: string;
  checkedInAt?: string;
}

// Matches BookingVerifyResponseDto
export interface BookingVerifyResponseDto {
  bookingCode: string;
  isValid: boolean;
  validationMessage?: string;
  isFullyCheckedIn: boolean;
  booking: BookingInfoDto;
  tickets: TicketInfoDto[];
}

// Matches BookingInfoDto (for ticket verification)
export interface BookingInfoDto {
  id: string;
  code: string;
  status: number; // BookingStatus enum value
  customerInfo?: CustomerInfoDto;
  createdAt: string;
}

// Re-export for convenience
export { TicketStatus } from './booking';

