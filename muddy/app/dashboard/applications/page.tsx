// app/dashboard/applications/page.tsx
import { db } from '@/lib/db';
import { applications } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
//import JobApplicationForm from '@/components/mvpblocks/job-application-form'; // match your actual path
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import JobApplicationForm from '@/components/job-application';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const rows = await db
    .select()
    .from(applications)
    .orderBy(desc(applications.createdAt));

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-xl font-bold mb-4">Job Application</h1>
        <JobApplicationForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Applications</h2>
        <Table>
          <TableCaption>{rows.length} application{rows.length !== 1 ? 's' : ''} received</TableCaption>
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
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.firstName} {r.lastName}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.mobileNumber}</TableCell>
                <TableCell>{r.position}</TableCell>
                <TableCell>{r.location}</TableCell>
                <TableCell className="capitalize">{r.status}</TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}