import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';

/**
 * Get pricing quote for seats
 */
export async function getPricingQuoteApi(payload: any) {
  const { data } = await httpClient.post(endpoints.pricing.quote, payload);
  return data;
}
