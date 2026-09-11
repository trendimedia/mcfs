// app/actions/complete-signup.ts
'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function completeSignup(email: string) {
  const result = await db.execute(sql`SELECT nextval('employee_code_seq') as next`);
  const next = (result as any)[0]?.next ?? (result as any).rows?.[0]?.next;

  const employeeCode = `EMP-${String(next).padStart(4, '0')}`;

  await db.insert(users).values({
    email,
    role: 'employee',
    employeeCode,
  });

  return employeeCode;
}