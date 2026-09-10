// app/dashboard/profile/page.tsx
import { db } from '@/lib/db';
import { attendance } from '@/lib/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/current-user';
//import { markMyAttendance } from './actions';
import { redirect } from 'next/navigation';
import { markAttendance } from './action';
import AttendanceCalendar from '@/components/attendace-calender';

export default async function ProfilePage() {
    const me = await getCurrentUser();
    if (!me) redirect('/login');
    if (!me.employeeCode) return <p>No employee record linked to your account yet.</p>;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
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

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const statusByDay = new Map(monthRows.map((r) => [r.date, r.status]));

    const todayStr = now.toISOString().split('T')[0];
    const markedToday = statusByDay.has(todayStr);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-xl font-bold">{me.email}</h1>
                <p className="text-muted-foreground">Role: {me.role} — Employee Code: {me.employeeCode}</p>
            </div>

            <div className="rounded-lg border p-4">
                <h2 className="font-semibold mb-2">This Month's Performance</h2>
                <p className="text-3xl font-bold">{performancePercent}%</p>
                <p className="text-sm text-muted-foreground">{presentCount} present out of {totalMarked} marked days</p>
            </div>

            <div className="rounded-lg border p-4">
                <h2 className="font-semibold mb-4">Attendance Calendar — {now.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>

                <AttendanceCalendar
                    initialEvents={monthRows.map((r) => ({ date: r.date, status: r.status as any }))}
                    employeeCode={me.employeeCode}
                    isAdmin={isAdmin}
                />

                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const status = statusByDay.get(dateStr);
                        return (
                            <div
                                key={day}
                                className={`aspect-square flex items-center justify-center rounded text-sm ${status === 'present'
                                        ? 'bg-green-500/20 text-green-700'
                                        : status === 'absent'
                                            ? 'bg-red-500/20 text-red-700'
                                            : status === 'half_day'
                                                ? 'bg-yellow-500/20 text-yellow-700'
                                                : 'bg-muted'
                                    }`}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>

            {!markedToday && (
                <form action={async () => { 'use server'; await markAttendance('present'); }}>
                    <button type="submit" className="rounded-lg bg-rose-600 px-4 py-2 text-white">
                        Mark Today Present
                    </button>
                </form>
            )}
            {markedToday && <p className="text-sm text-muted-foreground">You've already marked today as {statusByDay.get(todayStr)}.</p>}
        </div>
    );
}