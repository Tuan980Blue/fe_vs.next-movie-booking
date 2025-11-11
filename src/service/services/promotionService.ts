import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  PromotionSearchParams,
  PromotionResponse,
  CreatePromotionRequest,
  UpdatePromotionRequest,
  ValidatePromotionRequest,
  PromotionValidationResponse,
  ApplyPromotionRequest,
  PagedResult,
} from '../../models';

/**
 * Fetch paginated list of promotions
 */
export async function getPromotionsApi(params: PromotionSearchParams = {}): Promise<PagedResult<PromotionResponse>> {
  const { data } = await httpClient.get(endpoints.promotions.list, { params });
  return data;
}

/**
 * Fetch single promotion detail
 */
export async function getPromotionDetailApi(id: string): Promise<PromotionResponse> {
  const { data } = await httpClient.get(endpoints.promotions.detail(id));
  return data;
}

/**
 * Create new promotion (Admin/Manager only)
 */
export async function createPromotionApi(payload: CreatePromotionRequest): Promise<PromotionResponse> {
  const { data } = await httpClient.post(endpoints.promotions.create, payload);
  return data;
}

/**
 * Update promotion (Admin/Manager only)
 */
export async function updatePromotionApi(id: string, payload: UpdatePromotionRequest): Promise<PromotionResponse> {
  const { data } = await httpClient.put(endpoints.promotions.update(id), payload);
  return data;
}

/**
 * Delete promotion (Admin/Manager only)
 */
export async function deletePromotionApi(id: string): Promise<void> {
  await httpClient.delete(endpoints.promotions.delete(id));
}

/**
 * Validate promotion code
 */
export async function validatePromotionApi(payload: ValidatePromotionRequest): Promise<PromotionValidationResponse> {
  const { data } = await httpClient.post(endpoints.promotions.validate, payload);
  return data;
}

/**
 * Apply promotion to booking
 */
export async function applyPromotionApi(payload: ApplyPromotionRequest): Promise<{ success: boolean; discountAmount?: number; message?: string }> {
  const { data } = await httpClient.post(endpoints.promotions.apply, payload);
  return data;
}
