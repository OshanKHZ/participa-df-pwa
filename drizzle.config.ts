import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
})

export default defineConfig({
  schema: './database/schema.ts',
  out: './database/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL || '',
  },
  schemaFilter: ['public'],
  tablesFilter: [
    'user',
    'account',
    'session',
    'verificationToken',
    'manifestation',
    'otp_codes',
  ],
})
