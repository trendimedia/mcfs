// app/dashboard/performance/page.tsx
import { and, gte, lte } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import EmployeeAttendancePanel from '@/components/employee-attendance-panel';
import { attendance, employees, performance } from '@/lib/db/schema';
import PdfExportButton from '@/components/pdf-export-button';
import { getCurrentUser } from '@/lib/auth/current-user';
import { requireRole } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { submitPerformanceReview } from './actions';

export const dynamic = 'force-dynamic';

export default async function PerformancePage() {
  const me = await getCurrentUser();
  const canReview = me ? ['admin', 'manager'].includes(me.role) : false;

  if (me) {
    await requireRole(['admin', 'manager']);
  }

  const rows = await db.select().from(performance);
  const averageScore =
    rows.length > 0
      ? Math.round(rows.reduce((sum, row) => sum + Number(row.scorePercent), 0) / rows.length)
      : 0;

  const employeeOptions = await db.select().from(employees).where(eq(employees.status, 'active'));



const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
const todayStr = now.toISOString().split('T')[0];
const daysElapsed = now.getDate();

const monthAttendance = await db
  .select()
  .from(attendance)
  .where(and(gte(attendance.date, firstDay), lte(attendance.date, lastDay)));

const attendanceSummary = employeeOptions.map((emp) => {
  const theirRows = monthAttendance.filter((r) => r.employeeCode === emp.employeeCode);
  const presentCount = theirRows.filter((r) => r.status === 'present').length;
  const todayRow = theirRows.find((r) => r.date === todayStr);

  return {
    ...emp,
    presentCount,
    performancePercent: Math.round((presentCount / daysElapsed) * 100),
    todayStatus: todayRow?.status ?? null,
  };
});

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Performance</h1>
          <p className="text-muted-foreground">Employee performance trends and review scores.</p>
        </div>
        <PdfExportButton label="Download performance report" />
      </div>

      {canReview && (
        <form action={submitPerformanceReview} className="rounded-lg border bg-card p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Add Review</h2>
            <p className="text-sm text-muted-foreground">Write a review, score, and mark today's attendance in one go.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2 text-sm">
              <span>Employee</span>
              <select name="employeeCode" defaultValue="" className="w-full rounded-md border bg-background px-3 py-2" required>
                <option value="" disabled>Select employee</option>
                {employeeOptions.map((emp) => (
                  <option key={emp.id} value={emp.employeeCode}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span>Month</span>
              <input type="month" name="month" className="w-full rounded-md border bg-background px-3 py-2" required />
            </label>

            <label className="space-y-2 text-sm">
              <span>Score %</span>
              <input type="number" min={0} max={100} name="scorePercent" className="w-full rounded-md border bg-background px-3 py-2" required />
            </label>

            <div className="space-y-2 text-sm">
              <span>Today's Attendance</span>
              <div className="flex gap-3 pt-2">
                <label className="flex items-center gap-1.5">
                  <input type="radio" name="attendanceStatus" value="present" defaultChecked />
                  Present
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="radio" name="attendanceStatus" value="absent" />
                  Absent
                </label>
              </div>
            </div>
          </div>

          <label className="mt-4 block space-y-2 text-sm">
            <span>Review notes</span>
            <textarea name="notes" rows={3} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Add notes for this employee review" />
          </label>

          <button type="submit" className="mt-4 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600">
            Save Review &amp; Attendance
          </button>
        </form>
      )}

      {canReview && <EmployeeAttendancePanel employees={attendanceSummary} />}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Average score</p>
          <p className="mt-2 text-3xl font-bold">{averageScore}%</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Reviewed employees</p>
          <p className="mt-2 text-3xl font-bold">{rows.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Top score</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {rows.length > 0 ? Math.max(...rows.map((row) => Number(row.scorePercent))) : 0}%
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Month</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Reviewer</th>
                <th className="px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-3">{row.employeeCode}</td>
                  <td className="px-4 py-3">{row.month}</td>
                  <td className="px-4 py-3 font-medium">{row.scorePercent}%</td>
                  <td className="px-4 py-3">{row.reviewedBy ?? 'Self review'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.notes ?? 'No notes added'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}