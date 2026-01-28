import { config } from 'dotenv'
config({ path: '.env.local' })

import { db } from '../src/server/db'

import { sql } from 'drizzle-orm'

console.log('Running manual migration...')

async function main() {
  try {
    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "otp_codes" (
          "id" text PRIMARY KEY,
          "email" text NOT NULL,
          "code" text NOT NULL,
          "expiresAt" timestamp NOT NULL
        );
      `)
    console.log('Created otp_codes table if not exists')

    // Alter manifestation table to make userId nullable
    // We need to check if it's already nullable or just try altering
    await db.execute(sql`
        ALTER TABLE "manifestation" ALTER COLUMN "userId" DROP NOT NULL;
      `)
    console.log('Altered manifestation table')
  } catch (e) {
    console.error('Migration failed:', e)
  }

  console.log('Done!')
  process.exit(0)
}

main().catch(console.error)
