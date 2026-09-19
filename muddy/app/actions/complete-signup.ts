// app/actions/complete-signup.ts
'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function completeSignup(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser[0]) {
    const user = existingUser[0];

    if (!user.employeeCode) {
      const result = await db.execute(`SELECT nextval('employee_code_seq') as next` as any);
      const next = Array.isArray(result) ? result[0]?.next : result?.rows?.[0]?.next;
      const employeeCode = `EMP-${String(next ?? 1).padStart(4, '0')}`;

      await db
        .update(users)
        .set({
          role: 'employee',
          employeeCode,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(users.email, normalizedEmail));

      return employeeCode;
    }

    await db
      .update(users)
      .set({
        role: 'employee',
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(users.email, normalizedEmail));

    return user.employeeCode;
  }

  const result = await db.execute(`SELECT nextval('employee_code_seq') as next` as any);
  const next = Array.isArray(result) ? result[0]?.next : result?.rows?.[0]?.next;
  const employeeCode = `EMP-${String(next ?? 1).padStart(4, '0')}`;

  await db.insert(users).values({
    email: normalizedEmail,
    role: 'employee',
    employeeCode,
    isActive: true,
  });

  return employeeCode;
}