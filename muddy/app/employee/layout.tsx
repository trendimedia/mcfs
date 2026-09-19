import DashboardLayout from '@/components/ui/dashboard-layout';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
