
// Giải mã payload của JWT (không verify chữ ký; chỉ để đọc claim)
import endpoints from '../api/endpoints';
import httpClient from '../api/httpClient';
import { LoginRequest, RegisterRequest, User, UserResponse } from '../../models/user';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (_e) {
    return null;
  }
}

export async function loginApi({ email, password }: LoginRequest) {
  const url = endpoints.auth.login; // baseURL đã có '/api' trong httpClient
  const { data } = await httpClient.post(url, { email, password });
  return data;
}

export async function registerApi({ email, password, fullName }: RegisterRequest) {
  const url = endpoints.auth.register;
  const { data } = await httpClient.post(url, { email, password, fullName });
  return data;
}

export async function logoutApi() {
  const url = endpoints.auth.logout;
  const { data } = await httpClient.post(url, {});
  return data;
}

export function parseUserFromAccessToken(accessToken: string): User | null {
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return null;
  // Mapping một số claim phổ biến từ token mẫu bạn cung cấp
  const user: User = {
    id: payload.sub as string,
    email: payload.email as string,
    fullName: (payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string) || (payload.name as string) || '',
    roles: [(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string) || (payload.role as string) || 'user'],
    status: 1, // Default to Active
    createdAt: new Date().toISOString(),
  };
  return user;
}

export async function getMeApi() {
  const url = endpoints.users.me;
  const { data } = await httpClient.get(url);
  return data;
}

export function mapMeResponseToUser(me: UserResponse | null): User | null {
  if (!me) return null;
  const roles = Array.isArray(me.roles) ? me.roles.map((r) => (r.name || '').toString().toLowerCase()) : [];
  return {
    id: me.id,
    email: me.email,
    fullName: me.fullName,
    phone: me.phone || '',
    status: me.status,
    createdAt: me.createdAt,
    updatedAt: me.updatedAt,
    roles,
  };
}


