'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { requireRole } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

const validRoles = ['employee', 'manager', 'hr', 'admin'] as const;

export async function updateUserRole(formData: FormData) {
  await requireRole('admin');

  const userId = String(formData.get('userId') ?? '').trim();
  const role = String(formData.get('role') ?? '').trim();

  if (!userId || !validRoles.includes(role as (typeof validRoles)[number])) {
    return;
  }

  await db
    .update(users)
    .set({
      role: role as (typeof validRoles)[number],
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath('/admin');
  revalidatePath('/dashboard');
}
