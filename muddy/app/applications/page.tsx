import { desc } from 'drizzle-orm';

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
import { applications } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const rows = await db
    .select()
    .from(applications)
    .orderBy(desc(applications.createdAt));

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-muted-foreground">All submitted job applications</p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableCaption>
            {rows.length} application{rows.length !== 1 ? 's' : ''} received
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.firstName} {row.lastName}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.mobileNumber}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell className="capitalize">{row.status}</TableCell>
                <TableCell>
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
