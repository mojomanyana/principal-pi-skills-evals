import { sql } from "./query";

export async function recordOrderCreated(orderId: string): Promise<void> {
  await sql`insert into audit_events (kind, entity_id) values ('order.created', ${orderId})`;
}
