// Booking related types and enums
export enum BookingStatus {
  Pending = 1,
  Held = 2,
  Confirmed = 3,
  Canceled = 4,
  Expired = 5,
  Refunding = 6,
  Refunded = 7
}

export enum BookingItemStatus {
  Pending = 1,
  Held = 2,
  Confirmed = 3,
  Canceled = 4,
  Expired = 5
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

// DTOs for API requests
export interface CreateBookingRequest {
  showtimeId: string;
  seatIds: string[];
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  promotionCode?: string;
}

export interface UpdateBookingRequest {
  status?: BookingStatus;
  customerInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
}

export interface HoldSeatsRequest {
  showtimeId: string;
  seatIds: string[];
  holdDurationMinutes?: number;
}

export interface ConfirmBookingRequest {
  bookingId: string;
  paymentMethod?: string;
}

export interface CancelBookingRequest {
  bookingId: string;
  reason?: string;
}

// API Response types
export interface BookingResponse {
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
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt?: string;
  items: BookingItemResponse[];
  tickets?: TicketResponse[];
}

export interface BookingItemResponse {
  id: string;
  bookingId: string;
  showtimeId: string;
  showtime: {
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
  seat: {
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

export interface TicketResponse {
  id: string;
  bookingId: string;
  showtimeId: string;
  showtime: {
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
  seat: {
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

export interface BookingListResponse {
  items: BookingResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Search and filter types
export interface BookingSearchParams {
  page?: number;
  pageSize?: number;
  userId?: string;
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'createdAt' | 'totalAmountMinor';
  order?: 'asc' | 'desc';
}

