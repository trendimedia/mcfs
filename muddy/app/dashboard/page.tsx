
import { db } from '@/lib/db';
import { attendance, leaveRequests, performance, users } from '@/lib/db/schema';

const page = async () => {
  const [allUsers, allAttendance, allLeave, allPerformance] = await Promise.all([
    db.select().from(users),
    db.select().from(attendance),
    db.select().from(leaveRequests),
    db.select().from(performance),
  ]);

  const activeEmployees = allUsers.filter((user) => user.isActive).length;
  const presentCount = allAttendance.filter((row) => row.status === 'present').length;
  const absentCount = allAttendance.filter((row) => row.status === 'absent').length;
  const approvedLeaves = allLeave.filter((row) => row.status === 'approved').length;
  const averagePerformance =
    allPerformance.length > 0
      ? Math.round(
          allPerformance.reduce((total, row) => total + Number(row.scorePercent), 0) /
            allPerformance.length,
        )
      : 0;

  const recentActivity = [
    ...allAttendance.slice(-3).map((row) => ({
      title: `Attendance: ${row.employeeCode}`,
      detail: `${row.status} • ${row.date}`,
      tone: 'bg-emerald-500/10 text-emerald-700',
    })),
    ...allLeave.slice(-3).map((row) => ({
      title: `Leave: ${row.employeeCode}`,
      detail: `${row.leaveType} • ${row.status}`,
      tone: 'bg-blue-500/10 text-blue-700',
    })),
    ...allPerformance.slice(-2).map((row) => ({
      title: `Review: ${row.employeeCode}`,
      detail: `${row.scorePercent}% • ${row.month}`,
      tone: 'bg-violet-500/10 text-violet-700',
    })),
  ]
    .sort((a, b) => b.detail.localeCompare(a.detail))
    .slice(0, 5);

  return (
    <div className="space-y-6 p-2 md:p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Overview</p>
          <h1 className="text-3xl font-bold">MCFS Dashboard</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Active Employees</p>
          <p className="mt-3 text-3xl font-bold">{activeEmployees}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Present Days</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{presentCount}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Approved Leave</p>
          <p className="mt-3 text-3xl font-bold text-blue-600">{approvedLeaves}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Avg. Performance</p>
          <p className="mt-3 text-3xl font-bold text-violet-600">{averagePerformance}%</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent activity</h2>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <div key={`${item.title}-${index}`} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.tone}`}>
                  Live
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-md bg-muted/60 p-3">
              <span>Absent</span>
              <strong>{absentCount}</strong>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/60 p-3">
              <span>Pending leave</span>
              <strong>{allLeave.filter((row) => row.status === 'pending').length}</strong>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/60 p-3">
              <span>Reviews logged</span>
              <strong>{allPerformance.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

