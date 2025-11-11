import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  PriceRuleSearchDto,
  PriceRuleResponseDto,
  PriceRuleCreateDto,
  PriceRuleUpdateDto,
  PagedResult,
} from '../../models';

/**
 * Fetch paginated list of price rules
 */
export async function getPriceRulesApi(params: PriceRuleSearchDto = {}): Promise<PagedResult<PriceRuleResponseDto>> {
  const { data } = await httpClient.get(endpoints.priceRules.list, { params });
  return data;
}

/**
 * Fetch single price rule detail
 */
export async function getPriceRuleDetailApi(id: string): Promise<PriceRuleResponseDto> {
  const { data } = await httpClient.get(endpoints.priceRules.detail(id));
  return data;
}

/**
 * Create new price rule (Admin/Manager only)
 */
export async function createPriceRuleApi(payload: PriceRuleCreateDto): Promise<PriceRuleResponseDto> {
  const { data } = await httpClient.post(endpoints.priceRules.create, payload);
  return data;
}

/**
 * Update price rule (Admin/Manager only)
 */
export async function updatePriceRuleApi(id: string, payload: PriceRuleUpdateDto): Promise<PriceRuleResponseDto> {
  const { data } = await httpClient.put(endpoints.priceRules.update(id), payload);
  return data;
}

/**
 * Delete price rule (Admin/Manager only)
 */
export async function deletePriceRuleApi(id: string): Promise<void> {
  await httpClient.delete(endpoints.priceRules.delete(id));
}
