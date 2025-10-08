import axios from 'axios';
import endpoints from './endpoints';
import { parseUserFromAccessToken } from '../services/authService';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  withCredentials: true, // send cookies (for refresh_token HttpOnly cookie)
});

httpClient.interceptors.request.use((config) => {
  // Attach auth token if available (browser-only)
  if (typeof window !== 'undefined') {
    const token = window.sessionStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Nếu 401 và chưa thử refresh cho request này
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi refresh token API: server đọc refresh_token từ HttpOnly cookie
        const refreshResp = await axios.post(
          (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api') + endpoints.auth.refresh,
          {},
          { withCredentials: true }
        );

        const {
          accessToken: newAccessToken,
          accessTokenExpiresAt,
        } = refreshResp.data || {};

        if (!newAccessToken) throw new Error('Refresh failed: no access token');

        // Cập nhật sessionStorage (browser-only)
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('access_token', newAccessToken);
          if (accessTokenExpiresAt) window.sessionStorage.setItem('access_token_expires_at', accessTokenExpiresAt);
        }
        

        // Cập nhật user từ access token mới (nếu thay đổi claim)
        if (typeof window !== 'undefined') {
          const parsedUser = parseUserFromAccessToken(newAccessToken);
          if (parsedUser) {
            const normalizedRole = (parsedUser.roles?.[0] || 'user').toString().toLowerCase();
            const finalUser = {
              id: parsedUser.id,
              name: parsedUser.fullName || parsedUser.email?.split('@')[0] || '',
              email: parsedUser.email,
              role: normalizedRole,
            };
            window.localStorage.setItem('user_data', JSON.stringify(finalUser));
          }
        }

        // Gắn header mới và retry
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.withCredentials = true;
        return httpClient(originalRequest);
      } catch (refreshErr) {
        // Refresh thất bại: xoá phiên và trả lỗi
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('access_token');
          window.sessionStorage.removeItem('access_token_expires_at');
          window.localStorage.removeItem('user_data');
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;


