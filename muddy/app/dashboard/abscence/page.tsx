import PdfExportButton from '@/components/pdf-export-button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/lib/db';
import { leaveRequests } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function AbsencePage() {
  const allRows = await db.select().from(leaveRequests);

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const rows = allRows.filter(
    (row) => row.startDate <= lastDay && row.endDate >= firstDay,
  );

  const pending = rows.filter((row) => row.status === 'pending').length;
  const approved = rows.filter((row) => row.status === 'approved').length;
  const rejected = rows.filter((row) => row.status === 'rejected').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Absence Management</h1>
          <p className="text-muted-foreground">Leave requests and absence overview for the current month.</p>
        </div>
        <PdfExportButton label="Download absence report" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-2 text-3xl font-bold">{pending}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="mt-2 text-3xl font-bold">{approved}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="mt-2 text-3xl font-bold">{rejected}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <Table>
          <TableCaption>
            {rows.length} leave request{rows.length !== 1 ? 's' : ''} this month
          </TableCaption>
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
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.employeeCode}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.leaveType}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                <TableCell>{row.coveringEmployee}</TableCell>
                <TableCell className="capitalize">{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
