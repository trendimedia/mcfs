// db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

export const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.NEON_DATABASE_URL ??
  process.env.POSTGRES_URL ??
  'postgresql://postgres:postgres@localhost:5432/postgres';

export const hasDatabase = Boolean(
  process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL,
);

const sql = neon(databaseUrl);
export const db: any = sql ? drizzle(sql, { schema }) : (() => {
  console.warn('DATABASE_URL is not configured. Using a safe build-time fallback.');
  return {
    select: () => ({
      from: () => ({
        where: () => ({
          orderBy: () => ({ limit: async () => [] }),
          limit: async () => [],
        }),
        orderBy: () => ({ limit: async () => [] }),
        limit: async () => [],
      }),
    }),
    insert: () => ({ values: async () => ({}) }),
    update: () => ({ set: () => ({ where: async () => ({}) }) }),
    delete: () => ({ where: async () => ({}) }),
    execute: async () => ({ rows: [] }),
  };
})();
