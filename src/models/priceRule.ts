// PriceRule related types and enums
export enum DayType {
  Weekday = 1,
  Weekend = 2
}

export interface PriceRule {
  id: string;
  cinemaId?: string;
  cinema?: {
    id: string;
    name: string;
    city: string;
  };
  dayType: DayType;
  seatType: number;
  priceMinor: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// DTOs for API requests - matches PriceRuleCreateDto
export interface PriceRuleCreateDto {
  seatType: number; // SeatType enum value
  priceMinor: number;
  isActive?: boolean;
}

// Matches PriceRuleUpdateDto
export interface PriceRuleUpdateDto {
  id: string;
  seatType: number; // SeatType enum value
  priceMinor: number;
  isActive?: boolean;
}

// Matches PriceRuleSearchDto
export interface PriceRuleSearchDto {
  seatType?: number; // SeatType enum value
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// Matches PricingQuoteRequestDto
export interface PricingQuoteRequestDto {
  seatIds: string[];
}

// Matches PricingQuoteItemDto
export interface PricingQuoteItemDto {
  seatId: string;
  seatType: number; // SeatType enum value
  priceMinor: number;
}

// Matches PricingQuoteResponseDto
export interface PricingQuoteResponseDto {
  quotes: PricingQuoteItemDto[];
  totalAmountMinor: number;
  currency: string;
}

export interface BulkUpdatePriceRulesRequest {
  rules: {
    id?: string;
    cinemaId?: string;
    dayType: DayType;
    seatType: number;
    priceMinor: number;
    isActive?: boolean;
  }[];
}

// API Response types - matches PriceRuleResponseDto
export interface PriceRuleResponseDto {
  id: string;
  seatType: number; // SeatType enum value
  priceMinor: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Alias for backward compatibility
export interface PriceRuleResponse extends PriceRuleResponseDto {}

export interface PriceRuleListResponse {
  items: PriceRuleResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Price calculation types
export interface PriceCalculationRequest {
  showtimeId: string;
  seatIds: string[];
  dayType?: DayType;
}

export interface PriceCalculationResponse {
  showtimeId: string;
  basePriceMinor: number;
  seatPrices: {
    seatId: string;
    seatType: number;
    basePriceMinor: number;
    finalPriceMinor: number;
    priceRule?: PriceRuleResponse;
  }[];
  totalAmountMinor: number;
  currency: string;
  breakdown: {
    baseAmount: number;
    adjustments: {
      type: string;
      amount: number;
      description: string;
    }[];
  };
}

// Price rule matrix for admin interface
export interface PriceRuleMatrix {
  cinemaId?: string;
  cinemaName?: string;
  rules: {
    [key: string]: PriceRuleResponse; // key: `${dayType}-${seatType}`
  };
}

export interface PriceRuleMatrixResponse {
  cinemas: PriceRuleMatrix[];
  globalRules: PriceRuleMatrix;
}

// Search and filter types
export interface PriceRuleSearchParams {
  page?: number;
  pageSize?: number;
  cinemaId?: string;
  dayType?: DayType;
  seatType?: number;
  isActive?: boolean;
  sort?: 'createdAt' | 'priceMinor';
  order?: 'asc' | 'desc';
}

