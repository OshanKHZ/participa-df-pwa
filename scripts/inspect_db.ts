import { config } from 'dotenv'
config({ path: '.env.local' })

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL missing')

  const client = postgres(connectionString)
  const db = drizzle(client)

  try {
    const result = await db.execute(sql`
        SELECT conname, pg_get_constraintdef(oid) as def 
        FROM pg_constraint 
        WHERE contype = 'c';
      `)
    console.log('Check Constraints:', result)
  } catch (e) {
    console.error(e)
  } finally {
    await client.end()
  }
}

main()
