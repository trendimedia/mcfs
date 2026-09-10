// app/dashboard/leave-management/page.tsx  (adjust path to wherever this should live)
import { db } from '@/lib/db';
import { leaveRequests } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';

export default async function LeaveManagementPage() {
  const rows = await db
    .select()
    .from(leaveRequests)
    .orderBy(desc(leaveRequests.createdAt));

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Leave Management</h1>
      <Table>
        <TableCaption>{rows.length} leave request{rows.length !== 1 ? 's' : ''}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Covering</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.employeeCode}</TableCell>
              <TableCell>{r.department}</TableCell>
              <TableCell>{r.leaveType}</TableCell>
              <TableCell>{r.startDate}</TableCell>
              <TableCell>{r.endDate}</TableCell>
              <TableCell>{r.coveringEmployee}</TableCell>
              <TableCell className="capitalize">{r.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}