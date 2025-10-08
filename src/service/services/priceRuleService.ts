import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';

/**
 * Fetch paginated list of price rules
 * params can include: page, pageSize, cinemaId, dayType, seatType, isActive
 */
export async function getPriceRulesApi(params = {}) {
  const { data } = await httpClient.get(endpoints.priceRules.list, { params });
  return data;
}

/**
 * Fetch single price rule detail
 */
export async function getPriceRuleDetailApi(id: string) {
  const { data } = await httpClient.get(endpoints.priceRules.detail(id));
  return data;
}

/**
 * Create new price rule (Admin/Manager only)
 */
export async function createPriceRuleApi(payload: any) {
  const { data } = await httpClient.post(endpoints.priceRules.create, payload);
  return data;
}

/**
 * Update price rule (Admin/Manager only)
 */
export async function updatePriceRuleApi(id: string, payload: any) {
  const { data } = await httpClient.put(endpoints.priceRules.update(id), payload);
  return data;
}

/**
 * Delete price rule (Admin/Manager only)
 */
export async function deletePriceRuleApi(id: string) {
  const { data } = await httpClient.delete(endpoints.priceRules.delete(id));
  return data;
}
