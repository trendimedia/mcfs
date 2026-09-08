'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { verifyPassword } from '@/lib/auth/password';
import {
  createSession,
  deleteCurrentSession,
} from '@/lib/auth/session';

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type LoginState = {
  error?: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      error: 'Enter a valid email address and password.',
    };
  }

  const email = parsed.data.email.toLowerCase();

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = result[0];

  if (!user || !user.isActive) {
    return {
      error: 'Invalid email or password.',
    };
  }

  const validPassword = await verifyPassword(
    parsed.data.password,
    user.passwordHash,
  );

  if (!validPassword) {
    return {
      error: 'Invalid email or password.',
    };
  }

  await createSession(user.id);

  redirect('/dashboard');
}

export async function logout() {
  await deleteCurrentSession();

  redirect('/');
}