import axios from 'axios';
import endpoints from './endpoints';
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from '@/service/auth/cookie';
import { } from '@/service/auth/jwt';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  withCredentials: true, // send cookies (for refresh_token HttpOnly cookie)
});

// Shared refresh promise to dedupe parallel 401s
let refreshTokenPromise: Promise<string> | null = null;

// Request interceptor to add Authorization header
httpClient.interceptors.request.use(
  (config) => {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers = config.headers || {};
        (config.headers as any)['Authorization'] = `Bearer ${accessToken}`;
      }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
        (originalRequest.headers as any)['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.withCredentials = true;
        
        return httpClient(originalRequest);
      } catch (refreshErr) {
        clearAccessToken();
        return Promise.reject(refreshErr);
      }
    }

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

            // Persist new access token for subsequent requests
            setAccessToken(newAccessToken);
            return newAccessToken;
        } catch (error) {
            // Clear auth data on refresh failure
            clearAccessToken();
            throw error;
        } finally {
            refreshTokenPromise = null;
        }
    })();

    return refreshTokenPromise;
}

export default httpClient;


