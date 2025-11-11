// Seat Lock related types - matches backend SeatLockDtos

// Matches SeatLockRequestDto
export interface SeatLockRequestDto {
  showtimeId: string;
  seatIds: string[];
  userId?: string;
}

// Matches SeatLockExtendRequestDto
export interface SeatLockExtendRequestDto {
  showtimeId: string;
  seatIds: string[];
  userId?: string;
}

// Matches SeatUnlockRequestDto
export interface SeatUnlockRequestDto {
  showtimeId: string;
  seatIds: string[];
  userId?: string;
}

// Matches SeatLockInfo
export interface SeatLockInfo {
  userId: string;
  lockedAt: string;
  expiresAt: string;
}

// Matches LockedSeatsResponseDto
export interface LockedSeatsResponseDto {
  showtimeId: string;
  lockedSeatIds: string[];
}

// Matches SeatLockResultDto
export interface SeatLockResultDto {
  success: boolean;
  message: string;
  showtimeId: string;
  lockedSeatIds: string[];
  expiresAt?: string;
}

