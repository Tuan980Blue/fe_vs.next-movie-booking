import httpClient from '../api/httpClient';
import endpoints from '../api/endpoints';
import type {
  PricingQuoteRequestDto,
  PricingQuoteResponseDto,
} from '../../models';

/**
 * Calculate price for seats
 */
export async function calculatePriceApi(payload: PricingQuoteRequestDto): Promise<PricingQuoteResponseDto> {
  const { data } = await httpClient.post(endpoints.priceCalculation.calculate, payload);
  return data;
}
