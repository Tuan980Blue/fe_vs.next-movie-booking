import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';

/**
 * Fetch paginated list of payments
 * params can include: page, pageSize, bookingId, provider, status, dateFrom, dateTo
 */
export async function getPaymentsApi(params = {}) {
  const { data } = await httpClient.get(endpoints.payments.list, { params });
  return data;
}

/**
 * Fetch single payment detail
 */
export async function getPaymentDetailApi(id: string) {
  const { data } = await httpClient.get(endpoints.payments.detail(id));
  return data;
}

/**
 * Create new payment
 */
export async function createPaymentApi(payload: any) {
  const { data } = await httpClient.post(endpoints.payments.create, payload);
  return data;
}

/**
 * Process payment
 */
export async function processPaymentApi(id: string, payload: any) {
  const { data } = await httpClient.post(endpoints.payments.process(id), payload);
  return data;
}

/**
 * Refund payment
 */
export async function refundPaymentApi(id: string, payload: any) {
  const { data } = await httpClient.post(endpoints.payments.refund(id), payload);
  return data;
}
