import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Use provided DATABASE_URL or fallback to env
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error('DATABASE_URL is missing');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  console.log('Resetting database...');
  
  try {
    // Drop tables in correct order (dependents first)
    console.log('Dropping tables...');
    await client`DROP TABLE IF EXISTS "account" CASCADE`;
    await client`DROP TABLE IF EXISTS "session" CASCADE`;
    await client`DROP TABLE IF EXISTS "verificationToken" CASCADE`;
    await client`DROP TABLE IF EXISTS "user" CASCADE`;
    await client`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE`;
    
    console.log('Database reset complete');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
