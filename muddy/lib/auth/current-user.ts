// lib/auth/current-user.ts
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  const session = await auth.getSession();
  if (!session) return null;

  const [userRow] = await db.select().from(users).where(eq(users.email, session.user.email));
  return userRow ?? null;
}