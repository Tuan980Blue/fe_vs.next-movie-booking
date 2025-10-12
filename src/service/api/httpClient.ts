import axios from 'axios';
import endpoints from './endpoints';
import { 
  getAccessTokenFromCookie, 
  setAccessTokenCookie, 
  clearAllAuthCookies 
} from '@/lib/auth/cookies';
import { isTokenExpired } from '@/lib/auth/jwt';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  withCredentials: true, // send cookies (for refresh_token HttpOnly cookie)
});

// Track refresh token promise to prevent multiple simultaneous refresh calls
let refreshTokenPromise: Promise<string> | null = null;

// Request interceptor to add Authorization header
httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromCookie();
    if (token && !isTokenExpired(token)) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to refresh token
async function refreshAccessToken(): Promise<string> {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const refreshResp = await axios.post(
        (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api') + endpoints.auth.refresh,
        {},
        { 
          withCredentials: true,
          timeout: 10000 // Shorter timeout for refresh
        }
      );

      const { accessToken: newAccessToken } = refreshResp.data || {};

      if (!newAccessToken) {
        throw new Error('Refresh failed: no access token');
      }

      // Store new access token
      setAccessTokenCookie(newAccessToken);
      return newAccessToken;
    } catch (error) {
      // Clear auth data on refresh failure
      clearAllAuthCookies();
      throw error;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
}

// Response interceptor to handle token refresh
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Handle 401 Unauthorized with token refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use shared refresh promise to prevent multiple calls
        const newAccessToken = await refreshAccessToken();

        // Update request headers and retry
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.withCredentials = true;
        
        return httpClient(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;


