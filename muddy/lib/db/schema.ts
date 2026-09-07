// db/schema.ts
import { pgTable, uuid, text, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const leaveStatusEnum = pgEnum('leave_status', ['pending', 'approved', 'rejected']);

export const leaveTypeEnum = pgEnum('leave_type', [
  'Annual Leave',
  'Sick Leave',
  'Casual Leave',
  'Maternity/Paternity Leave',
  'Unpaid Leave',
]);

export const leaveRequests = pgTable('leave_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeCode: text('employee_code').notNull(),   // was uuid FK — now plain text, matches form input
  department: text('department').notNull(),
  leaveType: leaveTypeEnum('leave_type').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  reason: text('reason').notNull(),
  coveringEmployee: text('covering_employee').notNull(),
  emergencyContactName: text('emergency_contact_name').notNull(),
  emergencyContactPhone: text('emergency_contact_phone').notNull(),
  status: leaveStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});