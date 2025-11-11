import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  PaymentSearchDto,
  PaymentResponseDto,
  CreatePaymentDto,
  PagedResult,
} from '../../models';

/**
 * Fetch paginated list of payments
 */
export async function getPaymentsApi(params: PaymentSearchDto = {}): Promise<PagedResult<PaymentResponseDto>> {
  const { data } = await httpClient.get(endpoints.payments.list, { params });
  return data;
}

/**
 * Fetch single payment detail
 */
export async function getPaymentDetailApi(id: string): Promise<PaymentResponseDto> {
  const { data } = await httpClient.get(endpoints.payments.detail(id));
  return data;
}

/**
 * Create new payment
 */
export async function createPaymentApi(payload: CreatePaymentDto): Promise<PaymentResponseDto> {
  const { data } = await httpClient.post(endpoints.payments.create, payload);
  return data;
}

/**
 * VNPay return URL callback (usually handled by redirect, not called directly)
 */
export async function vnpayReturnApi(params: Record<string, string>): Promise<void> {
  await httpClient.get(endpoints.payments.vnpayReturn, { params });
}

/**
 * VNPay IPN callback (server-to-server, usually not called from frontend)
 */
export async function vnpayIpnApi(params: Record<string, string>): Promise<{ RspCode: string; Message: string }> {
  const { data } = await httpClient.post(endpoints.payments.vnpayIpn, null, { params });
  return data;
}
