// components/employee-attendance-panel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markAttendance } from '@/app/profile/action';

type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  position: string;
  presentCount: number;
  performancePercent: number;
  todayStatus: string | null;
};

export default function EmployeeAttendancePanel({ employees }: { employees: Employee[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [markingCode, setMarkingCode] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.employeeCode.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q)
    );
  });

  const handleMark = async (employeeCode: string, status: 'present' | 'absent' | 'half_day') => {
    setMarkingCode(employeeCode);
    try {
      await markAttendance(today, status, employeeCode);
      router.refresh();
    } catch (err) {
      console.error('Failed to mark attendance:', err);
      alert('Failed to mark attendance.');
    } finally {
      setMarkingCode(null);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Attendance Summary</h2>
        <input
          type="text"
          placeholder="Search by name, code, or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 font-medium">Code</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Position</th>
              <th className="px-4 py-2 font-medium">This Month</th>
              <th className="px-4 py-2 font-medium">Today</th>
              <th className="px-4 py-2 font-medium">Mark</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-2">{e.employeeCode}</td>
                <td className="px-4 py-2">{e.firstName} {e.lastName}</td>
                <td className="px-4 py-2">{e.position}</td>
                <td className="px-4 py-2">
                  <span className="font-medium">{e.performancePercent}%</span>
                  <span className="text-muted-foreground text-xs"> ({e.presentCount} days)</span>
                </td>
                <td className="px-4 py-2">
                  {e.todayStatus ? (
                    <span
                      className={`rounded px-2 py-0.5 text-xs capitalize ${
                        e.todayStatus === 'present'
                          ? 'bg-green-600/20 text-green-500'
                          : e.todayStatus === 'absent'
                            ? 'bg-red-600/20 text-red-500'
                            : 'bg-yellow-600/20 text-yellow-500'
                      }`}
                    >
                      {e.todayStatus}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">Not marked</span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {e.todayStatus ? (
                    <span className="text-xs text-muted-foreground">Marked</span>
                  ) : (
                    <>
                      <button
                        disabled={markingCode === e.employeeCode}
                        onClick={() => handleMark(e.employeeCode, 'present')}
                        className="rounded bg-green-600 px-3 py-1 text-white text-xs disabled:opacity-50"
                      >
                        Present
                      </button>
                      <button
                        disabled={markingCode === e.employeeCode}
                        onClick={() => handleMark(e.employeeCode, 'absent')}
                        className="rounded bg-red-600 px-3 py-1 text-white text-xs disabled:opacity-50"
                      >
                        Absent
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No employees match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}