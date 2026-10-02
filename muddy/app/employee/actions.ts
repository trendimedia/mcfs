// app/dashboard/employee/actions.ts
'use server';

import { db } from '@/lib/db';
import { employees } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type EmployeeRegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  city: string;
  location: string;
  position: string;
  site: string;
  salary: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
};

export async function registerEmployee(data: EmployeeRegistrationData) {
  const result = await db.execute(sql`SELECT nextval('employee_code_seq') as next`);
  const next = (result as any)[0]?.next ?? (result as any).rows?.[0]?.next;
  const employeeCode = `EMP-${String(next).padStart(4, '0')}`;

  await db.insert(employees).values({ ...data, employeeCode });

  revalidatePath('/dashboard/employee');
  return employeeCode;
}