import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';

/**
 * Fetch paginated list of promotions
 * params can include: page, pageSize, code, type, isActive, startsAt, endsAt
 */
export async function getPromotionsApi(params = {}) {
  const { data } = await httpClient.get(endpoints.promotions.list, { params });
  return data;
}

/**
 * Fetch single promotion detail
 */
export async function getPromotionDetailApi(id: string) {
  const { data } = await httpClient.get(endpoints.promotions.detail(id));
  return data;
}

/**
 * Create new promotion (Admin/Manager only)
 */
export async function createPromotionApi(payload: any) {
  const { data } = await httpClient.post(endpoints.promotions.create, payload);
  return data;
}

/**
 * Update promotion (Admin/Manager only)
 */
export async function updatePromotionApi(id: string, payload: any) {
  const { data } = await httpClient.put(endpoints.promotions.update(id), payload);
  return data;
}

/**
 * Delete promotion (Admin/Manager only)
 */
export async function deletePromotionApi(id: string) {
  const { data } = await httpClient.delete(endpoints.promotions.delete(id));
  return data;
}

/**
 * Validate promotion code
 */
export async function validatePromotionApi(payload: any) {
  const { data } = await httpClient.post(endpoints.promotions.validate, payload);
  return data;
}

/**
 * Apply promotion to booking
 */
export async function applyPromotionApi(payload: any) {
  const { data } = await httpClient.post(endpoints.promotions.apply, payload);
  return data;
}
