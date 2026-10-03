// app/admin/page.tsx
import { requireRole } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import UserRoleForm from '@/components/user-role-form';

export const dynamic = 'force-dynamic';

const AdminPage = async () => {
  await requireRole(['admin']);

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
          <p className="text-muted-foreground mt-1 text-sm">Generate and download administrative reports.</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Employees</h2>
          <p className="text-muted-foreground mt-1 text-sm">View and manage employee information.</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">User Roles</h2>
          <p className="text-sm text-muted-foreground">
            Assign or change roles from the Neon database-backed users table.
          </p>
        </div>

        <div className="space-y-3">
          {allUsers.map((user) => (
            <UserRoleForm key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;