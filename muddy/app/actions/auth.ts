'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession, deleteCurrentSession } from '@/lib/auth/session';
import { ensureWelcomeNotificationForRole, notifyAdminsAndManagers } from '@/lib/notifications';

export type LoginState = {
  error?: string;
};

export async function getPostLoginPath(email: string): Promise<string> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  const user = result[0];

  if (!user) {
    return '/profile';
  }

  if (user.role === 'employee') {
    return '/profile';
  }

  if (user.role === 'admin') {
    return '/admin';
  }

  return '/dashboard';
}

export async function syncAppSession(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  const user = result[0];

  if (!user || !user.isActive) {
    return false;
  }

  await createSession(user.id);

  if (['admin', 'manager'].includes(user.role)) {
    await notifyAdminsAndManagers({
      title: 'User login',
      message: `${user.email} signed in to the system.`,
      type: 'login',
      source: 'auth',
      actorEmail: user.email,
    });

    if (user.role === 'admin' || user.role === 'manager') {
      await ensureWelcomeNotificationForRole(user.role);
    }
  }

  return true;
}

export async function login(
  previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  void previousState;
  void formData;

  return {
    error:
      'This legacy login action has been disabled. Use the Neon Auth sign-in flow on the home page.',
  };
}

export async function logout() {
  await deleteCurrentSession();

  redirect('/sign-up');
}