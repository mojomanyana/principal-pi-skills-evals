import { sql } from "./query";

export async function recordPaymentCaptured(paymentId: string): Promise<void> {
  await sql`insert into audit_events (kind, entity_id) values ('payment.captured', ${paymentId})`;
}
