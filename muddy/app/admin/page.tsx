
//import DashboardLayout from '../ui/dashboard-layout';
import DashboardLayout from '@/components/ui/dashboard-layout';
import { requireRole } from '@/lib/auth/authorization';

const AdminPage = async () => {
  await requireRole('admin');

  return (
    <DashboardLayout showSidebar={false}>
      <div className="space-y-3 md:space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Administration
          </h1>

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
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;

