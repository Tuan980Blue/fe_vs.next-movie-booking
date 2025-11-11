import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  SeatLockRequestDto,
  SeatUnlockRequestDto,
  SeatLockExtendRequestDto,
  SeatLockResultDto,
  LockedSeatsResponseDto,
} from '../../models';

/**
 * Lock seats for a showtime
 */
export async function lockSeatsApi(payload: SeatLockRequestDto): Promise<SeatLockResultDto> {
  const { data } = await httpClient.post(endpoints.seatLocks.lock, payload);
  return data;
}

/**
 * Unlock seats
 */
export async function unlockSeatsApi(payload: SeatUnlockRequestDto): Promise<SeatLockResultDto> {
  const { data } = await httpClient.post(endpoints.seatLocks.unlock, payload);
  return data;
}

/**
 * Extend seat lock time (when user is in payment process)
 */
export async function extendSeatLockApi(payload: SeatLockExtendRequestDto): Promise<SeatLockResultDto> {
  const { data } = await httpClient.post(endpoints.seatLocks.changeTtl, payload);
  return data;
}

/**
 * Get locked seats for a showtime
 */
export async function getLockedSeatsApi(showtimeId: string): Promise<LockedSeatsResponseDto> {
  const { data } = await httpClient.get(endpoints.seatLocks.getLockedSeats(showtimeId));
  return data;
}

