// app/dashboard/profile/actions.ts
'use server';

import { db } from '@/lib/db';
import { attendance } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth/current-user';
import { revalidatePath } from 'next/cache';

type Status = 'present' | 'absent' | 'half_day';


// app/profile/action.ts
export async function markAttendance(date: string, status: Status, targetEmployeeCode?: string) {
  const me = await getCurrentUser();
  if (!me?.employeeCode) throw new Error('No employee record linked to this account');

  const isAdmin = ['admin', 'hr', 'manager'].includes(me.role);
  const todayStr = new Date().toISOString().split('T')[0];

  if (date > todayStr) {
    throw new Error('Cannot mark attendance for a future date');
  }

  if (!isAdmin) {
    if (targetEmployeeCode && targetEmployeeCode !== me.employeeCode) {
      throw new Error('Not authorized to mark attendance for others');
    }
    if (date !== todayStr) {
      throw new Error("You can only mark today's attendance");
    }
  }

  const employeeCode = isAdmin && targetEmployeeCode ? targetEmployeeCode : me.employeeCode;

  await db.insert(attendance).values({ employeeCode, date, status, markedBy: me.employeeCode });
  revalidatePath('/profile');
}