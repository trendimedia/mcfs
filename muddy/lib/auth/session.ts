import 'server-only';

import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema';

const SESSION_COOKIE = 'mcfs_session';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function getSessionExpiry() {
  return new Date(Date.now() + SESSION_DURATION);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = getSessionExpiry();

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = hashToken(token);

    const result = await db
      .select({
        sessionId: sessions.id,
        sessionExpiresAt: sessions.expiresAt,
        user: users,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.tokenHash, tokenHash))
      .limit(1);

    const session = result[0];

    if (session) {
      if (session.sessionExpiresAt <= new Date()) {
        await db.delete(sessions).where(eq(sessions.id, session.sessionId));
        cookieStore.delete(SESSION_COOKIE);
        return null;
      }

      if (!session.user.isActive) {
        await db.delete(sessions).where(eq(sessions.id, session.sessionId));
        cookieStore.delete(SESSION_COOKIE);
        return null;
      }

      return {
        sessionId: session.sessionId,
        expiresAt: session.sessionExpiresAt,
        user: session.user,
      };
    }
  }

  return null;
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/sign-up');
  }

  return session;
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = hashToken(token);

    await db
      .delete(sessions)
      .where(eq(sessions.tokenHash, tokenHash));
  }

  cookieStore.delete(SESSION_COOKIE);
}