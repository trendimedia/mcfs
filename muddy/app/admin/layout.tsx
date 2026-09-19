import DashboardLayout from '@/components/ui/dashboard-layout';
import { requireRole } from '@/lib/auth/authorization';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole('admin');

  return <DashboardLayout role="admin">{children}</DashboardLayout>;
}
