// lib/auth/server.ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

const hasAuthConfig = Boolean(
  process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET,
);

export const auth = hasAuthConfig
  ? createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: {
        secret: process.env.NEON_AUTH_COOKIE_SECRET!,
      },
    })
  : ({
      getSession: async () => ({ data: null }),
    } as any);