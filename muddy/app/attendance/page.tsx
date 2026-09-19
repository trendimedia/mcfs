import { and, eq, gte, lte } from 'drizzle-orm';

import AttendancePieChart from '@/components/attendance-pie-chart';
import { getCurrentUser } from '@/lib/auth/current-user';
import { db } from '@/lib/db';
import { attendance } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
  const me = await getCurrentUser();

  if (!me) {
    return <div className="p-6">Please sign in to view attendance.</div>;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
  const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];

  const monthRows = await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.employeeCode, me.employeeCode ?? ''),
        gte(attendance.date, firstDay),
        lte(attendance.date, lastDay),
      ),
    );

  const present = monthRows.filter((row) => row.status === 'present').length;
  const absent = monthRows.filter((row) => row.status === 'absent').length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">
          {me.email} • {me.role}
        </p>
      </div>

      <AttendancePieChart present={present} absent={absent} />
    </div>
  );
}
