// File: lib/db.ts

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/drizzle/schema/event";

const dbUrl = process.env.DATABASE_URL!
console.log("lib/db.ts drizzle dbUrl", dbUrl)

const pool = new Pool({
  connectionString: dbUrl,
  ssl: false,
});

export const db = drizzle(pool, { schema });
