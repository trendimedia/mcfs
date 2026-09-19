import DashboardLayout from '@/components/ui/dashboard-layout';

export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="employee">{children}</DashboardLayout>;
}
