
// Giải mã payload của JWT (không verify chữ ký; chỉ để đọc claim)
import endpoints from '../api/endpoints';
import httpClient from '../api/httpClient';
import { LoginRequest, RegisterRequest, User, UserResponse } from '../../models/user';
import { setAccessToken, clearAccessToken } from '@/service/auth/cookie';
import { getOrCreateDeviceId, getUserAgent } from '@/service/auth/device';

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
  const url = endpoints.auth.login;
  const deviceId = getOrCreateDeviceId();
  const userAgent = getUserAgent();
  const { data } = await httpClient.post(url, { email, password, deviceId, userAgent });
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
}

export async function registerApi({ email, password, fullName }: RegisterRequest) {
  const url = endpoints.auth.register;
  const { data } = await httpClient.post(url, { email, password, fullName });
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
}

export async function logoutApi() {
  const url = endpoints.auth.logout;
  const { data } = await httpClient.post(url, {});
  clearAccessToken();
  return data;
}

export function parseUserFromAccessToken(accessToken: string): User | null {
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return null;
  
  // Debug: Log the entire payload to see what claims are available
  console.log('JWT Payload:', payload);
  
  // Extract roles from various possible claim formats
  let roles: string[] = [];
  const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string ||
                   payload.role as string ||
                   payload.roles as string[];
  
  console.log('Role claim found:', roleClaim);
  
  if (Array.isArray(roleClaim)) {
    roles = roleClaim;
  } else if (typeof roleClaim === 'string') {
    roles = [roleClaim];
  } else {
    roles = ['user']; // Default role
  }
  
  console.log('Parsed roles:', roles);
  
  // Extract full name from various possible claim formats
  const fullName = (payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string) ||
                  (payload.name as string) ||
                  (payload.fullName as string) ||
                  '';
  
  const user: User = {
    id: payload.sub as string,
    email: payload.email as string,
    fullName,
    roles: roles.map(r => r.toLowerCase()),
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
  
  // Backend trả về roles là array of strings
  const roles = Array.isArray(me.roles) 
    ? me.roles.map(r => r.toLowerCase()).filter(Boolean)
    : [];
  
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


