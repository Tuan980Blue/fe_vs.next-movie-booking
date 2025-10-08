// Promotion related types and enums
export enum PromotionType {
  Percent = 1,
  Fixed = 2
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  type: PromotionType;
  value: number;
  maxDiscountMinor?: number;
  minOrderMinor?: number;
  startsAt: string;
  endsAt: string;
  usageLimit?: number;
  perUserLimit?: number;
  conditionsJson?: string;
  isActive: boolean;
}

export interface PromotionUsage {
  id: string;
  promotionId: string;
  promotion?: Promotion;
  userId?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
  bookingId: string;
  booking?: {
    id: string;
    code: string;
    totalAmountMinor: number;
  };
  usedAt: string;
  discountMinor: number;
}

// DTOs for API requests
export interface CreatePromotionRequest {
  code: string;
  name: string;
  type: PromotionType;
  value: number;
  maxDiscountMinor?: number;
  minOrderMinor?: number;
  startsAt: string;
  endsAt: string;
  usageLimit?: number;
  perUserLimit?: number;
  conditions?: Record<string, unknown>; // JSON object for conditions
  isActive?: boolean;
}

export interface UpdatePromotionRequest {
  code?: string;
  name?: string;
  type?: PromotionType;
  value?: number;
  maxDiscountMinor?: number;
  minOrderMinor?: number;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  perUserLimit?: number;
  conditions?: Record<string, unknown>;
  isActive?: boolean;
}

export interface ApplyPromotionRequest {
  bookingId: string;
  promotionCode: string;
}

export interface ValidatePromotionRequest {
  promotionCode: string;
  userId?: string;
  orderAmountMinor: number;
  conditions?: Record<string, unknown>;
}

// API Response types
export interface PromotionResponse {
  id: string;
  code: string;
  name: string;
  type: PromotionType;
  value: number;
  maxDiscountMinor?: number;
  minOrderMinor?: number;
  startsAt: string;
  endsAt: string;
  usageLimit?: number;
  perUserLimit?: number;
  conditions?: Record<string, unknown>;
  isActive: boolean;
  usageCount?: number;
  remainingUsage?: number;
}

export interface PromotionUsageResponse {
  id: string;
  promotionId: string;
  promotion: {
    id: string;
    code: string;
    name: string;
    type: PromotionType;
  };
  userId?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
  bookingId: string;
  booking: {
    id: string;
    code: string;
    totalAmountMinor: number;
  };
  usedAt: string;
  discountMinor: number;
}

export interface PromotionListResponse {
  items: PromotionResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PromotionValidationResponse {
  isValid: boolean;
  promotion?: PromotionResponse;
  discountAmount?: number;
  errorMessage?: string;
  conditions?: {
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    perUserLimit?: number;
    validDateRange?: boolean;
    userEligible?: boolean;
  };
}

// Promotion conditions types
export interface PromotionConditions {
  movieIds?: string[];
  cinemaIds?: string[];
  seatTypes?: number[];
  dayTypes?: number[];
  userRoles?: string[];
  firstTimeUser?: boolean;
  minTickets?: number;
  maxTickets?: number;
  timeRestrictions?: {
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[];
  };
}

// Search and filter types
export interface PromotionSearchParams {
  page?: number;
  pageSize?: number;
  code?: string;
  type?: PromotionType;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
  sort?: 'createdAt' | 'startsAt' | 'endsAt';
  order?: 'asc' | 'desc';
}

export interface PromotionUsageSearchParams {
  page?: number;
  pageSize?: number;
  promotionId?: string;
  userId?: string;
  bookingId?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'usedAt' | 'discountMinor';
  order?: 'asc' | 'desc';
}

