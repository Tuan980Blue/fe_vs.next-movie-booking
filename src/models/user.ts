// User related types and enums
export enum UserStatus {
  Active = 1,
  Inactive = 2,
  Banned = 3
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
  roles?: string[]; // Role names for frontend display
}

export interface UserRole {
  userId: string;
  roleId: string;
  user?: User;
  role?: Role;
}

export interface Role {
  id: string;
  name: string;
  userRoles?: UserRole[];
}

// DTOs for API requests
export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
  userAgent?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// API Response types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Matches UserReadDto from backend
export interface UserReadDto {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  status: string; // "Active", "Inactive", "Banned" - backend returns string
  createdAt: string;
  updatedAt?: string;
  roles: string[]; // Backend trả về array of strings
}

// Alias for backward compatibility
export type UserResponse = UserReadDto;
