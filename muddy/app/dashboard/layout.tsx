import DashboardLayout from '@/components/ui/dashboard-layout';
import { requireRole } from '@/lib/auth/authorization';

export default async function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(['manager', 'hr', 'admin']);

  return <DashboardLayout role={session.user.role as 'admin' | 'manager' | 'hr' | 'employee'}>{children}</DashboardLayout>;
}