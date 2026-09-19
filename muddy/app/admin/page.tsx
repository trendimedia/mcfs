
import { requireRole } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { updateUserRole } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

const AdminPage = async () => {
  await requireRole('admin');

  const allUsers = await db.select().from(users).orderBy(users.email);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Administration</h1>
        <p className="text-muted-foreground">
          Manage reports, employees, performance, and system information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-6 xl:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Reports</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Generate and download administrative reports.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Employees</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            View and manage employee information.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">User Roles</h2>
            <p className="text-sm text-muted-foreground">
              Assign or change roles from the Neon database-backed users table.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {allUsers.map((user) => (
            <form
              key={user.id}
              action={updateUserRole}
              className="flex flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between"
            >
              <input type="hidden" name="userId" value={user.id} />

              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {user.employeeCode ?? 'No employee code'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated {new Date(user.updatedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  name="role"
                  defaultValue={user.role}
                  className="rounded-md border bg-background px-3 py-2 text-sm"
                  aria-label={`Role for ${user.email}`}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  type="submit"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                >
                  Save
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

