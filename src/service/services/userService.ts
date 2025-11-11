import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserReadDto,
  PagedResult,
} from '../../models';

/**
 * Get current user profile
 */
export async function getMeApi(): Promise<UserReadDto> {
  const { data } = await httpClient.get(endpoints.users.me);
  return data;
}

/**
 * Update current user profile
 */
export async function updateProfileApi(payload: UpdateProfileRequest): Promise<UserReadDto> {
  const { data } = await httpClient.put(endpoints.users.updateProfile, payload);
  return data;
}

/**
 * Change password
 */
export async function changePasswordApi(payload: ChangePasswordRequest): Promise<void> {
  await httpClient.post(endpoints.auth.changePassword, payload);
}

/**
 * List all users (Admin only)
 */
export async function getUsersApi(params: { page?: number; pageSize?: number; search?: string } = {}): Promise<PagedResult<UserReadDto>> {
  const { data } = await httpClient.get(endpoints.users.list, { params });
  return data;
}

/**
 * Get user by ID (Admin only)
 */
export async function getUserByIdApi(id: string): Promise<UserReadDto> {
  const { data } = await httpClient.get(endpoints.users.detail(id));
  return data;
}

/**
 * Assign admin role to user (Admin only)
 */
export async function assignAdminRoleApi(id: string): Promise<void> {
  await httpClient.post(endpoints.users.assignAdmin(id));
}


