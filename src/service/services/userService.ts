import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import { UpdateProfileRequest, ChangePasswordRequest } from '../../models/user';

export async function updateProfileApi(payload: UpdateProfileRequest) {
  // payload: { fullName, phone }
  const { data } = await httpClient.put(endpoints.users.updateProfile, payload);
  return data;
}

export async function changePasswordApi(payload: ChangePasswordRequest) {
  // payload: { currentPassword, newPassword }
  const { data } = await httpClient.post(endpoints.auth.changePassword, payload);
  return data;
}


