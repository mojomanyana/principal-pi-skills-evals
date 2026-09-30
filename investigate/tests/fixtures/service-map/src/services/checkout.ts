import { charge, type ChargeResult } from "./payment-gateway";

export async function checkout(totalCents: number): Promise<ChargeResult> {
  if (totalCents <= 0) throw new Error("total must be positive");
  return charge(totalCents);
}
