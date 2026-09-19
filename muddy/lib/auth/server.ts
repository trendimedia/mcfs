// lib/auth/server.ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

const hasAuthConfig = Boolean(
  process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET,
);

const fallbackHandler = () => ({
  GET: async () => new Response(JSON.stringify({ error: 'Authentication is not configured.' }), {
    status: 501,
    headers: { 'content-type': 'application/json' },
  }),
  POST: async () => new Response(JSON.stringify({ error: 'Authentication is not configured.' }), {
    status: 501,
    headers: { 'content-type': 'application/json' },
  }),
});

export const auth = hasAuthConfig
  ? createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: {
        secret: process.env.NEON_AUTH_COOKIE_SECRET!,
      },
    })
  : ({
      getSession: async () => ({ data: null }),
      handler: fallbackHandler,
    } as any);