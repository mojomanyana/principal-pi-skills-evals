export const DEFAULT_CURRENCY = "USD";

export interface ChargeResult {
  id: string;
  currency: string;
}

export async function charge(totalCents: number): Promise<ChargeResult> {
  return { id: `pay_${totalCents}`, currency: DEFAULT_CURRENCY };
}
