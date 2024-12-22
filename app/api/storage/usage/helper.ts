// backend app/api/storage/usage/helper.ts

import { db } from "@/lib/db"
import { sql } from "drizzle-orm"


async function getUserDataUsage(userId: string)
  : Promise<{ result: number, error: Error | null }> {
  try {
    const rs = await db.execute(
      sql`select sum((metadata->>'size')::integer) from storage.objects where owner = ${userId}`
    )
    return { result: rs.rows[0].sum as number, error: null }
  } catch (error) {
    return { result: 0, error: error as Error }
  }
}

export {
  getUserDataUsage
}