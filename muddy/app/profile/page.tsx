// app/profile/page.tsx
import { db } from '@/lib/db';
import { attendance } from '@/lib/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/current-user';
import { redirect } from 'next/navigation';
import AttendanceCalendar from '@/components/attendace-calender';
//import AttendanceCalendar from '@/components/attendance-calendar';

export default async function ProfilePage() {
  const me = await getCurrentUser();
  if (!me) redirect('/sign-up');
  if (!me.employeeCode) return <p>No employee record linked to your account yet.</p>;

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
        eq(attendance.employeeCode, me.employeeCode),
        gte(attendance.date, firstDay),
        lte(attendance.date, lastDay),
      ),
    );

  const presentCount = monthRows.filter((r) => r.status === 'present').length;
  const totalMarked = monthRows.length;
  const performancePercent = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

  const isAdmin = ['admin', 'hr', 'manager'].includes(me.role);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold">{me.email}</h1>
        <p className="text-muted-foreground">Role: {me.role} — Employee Code: {me.employeeCode}</p>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold mb-2">This Month&apos;s Performance</h2>
        <p className="text-3xl font-bold">{performancePercent}%</p>
        <p className="text-sm text-muted-foreground">{presentCount} present out of {totalMarked} marked days</p>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold mb-4">
          Attendance Calendar — {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <AttendanceCalendar
          initialEvents={monthRows.map((r) => ({
            date: r.date,
            status: r.status as 'present' | 'absent' | 'half_day',
          }))}
          employeeCode={me.employeeCode}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}