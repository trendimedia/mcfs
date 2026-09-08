import DashboardLayout from '@/components/ui/dashboard-layout';
import { requireRole } from '@/lib/auth/authorization';

export default async function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole('admin');

  return <DashboardLayout>{children}</DashboardLayout>;
}