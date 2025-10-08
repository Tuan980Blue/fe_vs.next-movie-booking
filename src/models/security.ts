// Security related types
export interface RefreshToken {
  id: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
  tokenHash: string;
  expiresAt: string;
  revokedAt?: string;
  createdAt: string;
  deviceId?: string;
  userAgent?: string;
  createdByIp?: string;
  revokedByIp?: string;
  replacedByTokenHash?: string;
}

export interface PasswordReset {
  id: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
  tokenHash: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

// DTOs for security operations
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
