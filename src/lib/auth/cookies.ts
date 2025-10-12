/**
 * Cookie management utilities for authentication
 */

/**
 * Set access token cookie with 14 days expiration
 */
export function setAccessTokenCookie(token: string): void {
  if (typeof document === 'undefined') return;

  // Set cookie to expire in 14 days
  const expires = new Date();
  expires.setTime(expires.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days
  document.cookie = `access_token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
}

/**
 * Get access token from cookies
 */
export function getAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

/**
 * Clear access token cookie
 */
export function clearAccessTokenCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/**
 * Get auth status from cookie
 */
export function getAuthFromCookie(): boolean {
    if (typeof document === 'undefined') return false; // Kiểm tra nếu đang chạy ngoài trình duyệt (VD: server side)

    const cookies = document.cookie.split(';'); // Lấy tất cả cookie trong trình duyệt và tách thành mảng
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth=')); // Tìm cookie có tên 'auth'

    return authCookie ? authCookie.split('=')[1] === '1' : false; // Nếu có cookie 'auth', kiểm tra xem giá trị của nó có bằng '1' không
}

/**
 * Set role cookie
 */
export function setRoleCookie(role: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `role=${role}; path=/; max-age=86400`; // 24 hours
}

/**
 * Get role from cookie
 */
export function getRoleFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const roleCookie = cookies.find(cookie => cookie.trim().startsWith('role='));
  return roleCookie ? roleCookie.split('=')[1] : null;
}

/**
 * Clear role cookie
 */
export function clearRoleCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/**
 * Clear all auth-related cookies
 */
export function clearAllAuthCookies(): void {
  clearAccessTokenCookie();
  clearRoleCookie();
}
