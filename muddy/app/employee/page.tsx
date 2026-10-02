// app/dashboard/employees/page.tsx
import { db } from '@/lib/db';
import { employees } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import EmployeeRegistrationForm from '@/components/employee-registration-form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table';

export default async function EmployeesPage() {
  const rows = await db.select().from(employees).orderBy(desc(employees.createdAt));

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-xl font-bold mb-4">Register Employee</h1>
        <EmployeeRegistrationForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Employees</h2>
        <Table>
          <TableCaption>{rows.length} employee{rows.length !== 1 ? 's' : ''}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.employeeCode}</TableCell>
                <TableCell>{e.firstName} {e.lastName}</TableCell>
                <TableCell>{e.position}</TableCell>
                <TableCell>{e.site}</TableCell>
                <TableCell>{e.salary}</TableCell>
                <TableCell className="capitalize">{e.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}