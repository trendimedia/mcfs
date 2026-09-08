// db/schema.ts
import { pgTable, uuid, text, date, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';

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

export const userRoleEnum = pgEnum('user_role', [
  'employee',
  'manager',
  'hr',
  'admin',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  email: text('email').notNull().unique(),

  passwordHash: text('password_hash').notNull(),

  role: userRoleEnum('role').default('employee').notNull(),

  employeeCode: text('employee_code'),

  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  tokenHash: text('token_hash').notNull().unique(),

  expiresAt: timestamp('expires_at').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
