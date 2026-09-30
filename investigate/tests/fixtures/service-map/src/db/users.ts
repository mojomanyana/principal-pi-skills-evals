import { sql } from "./query";

export async function saveUser(userId: string): Promise<void> {
  await sql`insert into users (id) values (${userId})`;
}
