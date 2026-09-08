
import PersonalFinanceDashboard from '@/components/mvpblocks';
import { requireRole } from '@/lib/auth/authorization';

const page = async () => {
  await requireRole('admin');

  return (
    <div>
      <PersonalFinanceDashboard />
    </div>
  );
};

export default page;

