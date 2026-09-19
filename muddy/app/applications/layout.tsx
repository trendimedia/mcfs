import DashboardLayout from '@/components/ui/dashboard-layout';

export default function ApplicationsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
