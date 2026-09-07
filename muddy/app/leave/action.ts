'use server';

import { db } from '@/lib/db';
import { leaveRequests } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

type LeaveFormData = {
  employeeId: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity/Paternity Leave' | 'Unpaid Leave';
  startDate: string;
  endDate: string;
  reason: string;
  coveringEmployee: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};

export async function submitLeaveRequest(data: LeaveFormData) {
  await db.insert(leaveRequests).values({
    employeeCode: data.employeeId,
    department: data.department,
    leaveType: data.leaveType,
    startDate: data.startDate,
    endDate: data.endDate,
    reason: data.reason,
    coveringEmployee: data.coveringEmployee,
    emergencyContactName: data.emergencyContactName,
    emergencyContactPhone: data.emergencyContactPhone,
  });

  revalidatePath('/leave');
}