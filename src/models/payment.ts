// Payment related types and enums
export enum PaymentProvider {
  VnPay = 1,
  MoMo = 2,
  Stripe = 3
}

export enum PaymentStatus {
  Initiated = 1,
  Pending = 2,
  Succeeded = 3,
  Failed = 4,
  Canceled = 5,
  Refunded = 6,
  PartiallyRefunded = 7
}

export interface Payment {
  id: string;
  bookingId: string;
  booking?: {
    id: string;
    code: string;
    totalAmountMinor: number;
    customerInfo: {
      fullName: string;
      email: string;
    };
  };
  provider: PaymentProvider;
  amountMinor: number;
  currency: string;
  status: PaymentStatus;
  providerTxnId?: string;
  returnUrl?: string;
  notifyUrl?: string;
  createdAt: string;
  updatedAt?: string;
  events?: PaymentEvent[];
}

export interface PaymentEvent {
  id: string;
  paymentId: string;
  payment?: Payment;
  eventType: string;
  rawPayloadJson: string;
  createdAt: string;
}

// DTOs for API requests
export interface CreatePaymentRequest {
  bookingId: string;
  provider: PaymentProvider;
  amountMinor: number;
  currency?: string;
  returnUrl?: string;
  notifyUrl?: string;
}

export interface ProcessPaymentRequest {
  paymentId: string;
  providerData?: Record<string, unknown>; // Provider-specific data
}

export interface RefundPaymentRequest {
  paymentId: string;
  amountMinor?: number; // Partial refund if specified
  reason?: string;
}

export interface UpdatePaymentStatusRequest {
  paymentId: string;
  status: PaymentStatus;
  providerTxnId?: string;
  providerData?: Record<string, unknown>;
}

// API Response types
export interface PaymentResponse {
  id: string;
  bookingId: string;
  booking?: {
    id: string;
    code: string;
    totalAmountMinor: number;
    customerInfo: {
      fullName: string;
      email: string;
    };
  };
  provider: PaymentProvider;
  amountMinor: number;
  currency: string;
  status: PaymentStatus;
  providerTxnId?: string;
  returnUrl?: string;
  notifyUrl?: string;
  createdAt: string;
  updatedAt?: string;
  events?: PaymentEventResponse[];
}

export interface PaymentEventResponse {
  id: string;
  paymentId: string;
  eventType: string;
  rawPayloadJson: string;
  createdAt: string;
}

export interface PaymentListResponse {
  items: PaymentResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Payment provider specific types
export interface VnPayPaymentData {
  vnp_TxnRef: string;
  vnp_Amount: number;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_Locale: string;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
  vnp_CurrCode: string;
  vnp_TmnCode: string;
  vnp_Command: string;
  vnp_Version: string;
  vnp_SecureHash: string;
}

export interface MoMoPaymentData {
  partnerCode: string;
  accessKey: string;
  requestId: string;
  amount: number;
  orderId: string;
  orderInfo: string;
  returnUrl: string;
  notifyUrl: string;
  extraData: string;
  requestType: string;
  signature: string;
}

export interface StripePaymentData {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

// Search and filter types
export interface PaymentSearchParams {
  page?: number;
  pageSize?: number;
  bookingId?: string;
  provider?: PaymentProvider;
  status?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'createdAt' | 'amountMinor';
  order?: 'asc' | 'desc';
}

