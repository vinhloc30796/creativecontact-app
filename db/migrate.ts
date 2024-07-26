import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const db = drizzle(pool);

async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'db/migrations' });
  console.log('Migrations complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed!', err);
  process.exit(1);
});