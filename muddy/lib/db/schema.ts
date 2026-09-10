// db/schema.ts
import { pgTable, uuid, text, date, timestamp, pgEnum, boolean, numeric } from 'drizzle-orm/pg-core';

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


export const applicationStatusEnum = pgEnum('application_status', [
  'pending',
  'reviewed',
  'shortlisted',
  'rejected',
  'hired',
]);

export const applications = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  mobileNumber: text('mobile_number').notNull(),

  address: text('address').notNull(),
  city: text('city').notNull(),
  location: text('location').notNull(),
  position: text('position').notNull(),

  nextOfKinName: text('next_of_kin_name').notNull(),
  nextOfKinPhone: text('next_of_kin_phone').notNull(),

  status: applicationStatusEnum('status').default('pending').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'half_day']);

export const attendance = pgTable('attendance', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeCode: text('employee_code').notNull(),
  date: date('date').notNull(),
  status: attendanceStatusEnum('status').notNull(),
  markedBy: text('marked_by'), // employeeCode of whoever marked it — null/self if self-check-in
  markedAt: timestamp('marked_at').defaultNow().notNull(),
});

export const performance = pgTable('performance', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeCode: text('employee_code').notNull(),
  month: text('month').notNull(), // e.g. '2026-09'
  scorePercent: numeric('score_percent').notNull(),
  notes: text('notes'),
  reviewedBy: text('reviewed_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});