import { db, DB } from "@/lib/db"
import { sql } from "drizzle-orm"

interface StorageInterface {
  getUserDataUsage(userId: string): Promise<{ result: number, error: Error | null }>
}

class StorageInfras implements StorageInterface {
  constructor(
    private db: DB
  ) { }
  async getUserDataUsage(userId: string)
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
}

export {
  type StorageInterface,
  StorageInfras
}