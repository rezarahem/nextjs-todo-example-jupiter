import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    ssl: true,
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
