import PdfExportButton from '@/components/pdf-export-button';

const advanceEntries = [
  { employee: 'A. Ndlovu', type: 'Salary advance', amount: 'R12,500', status: 'Approved', date: '2026-09-04' },
  { employee: 'M. Khumalo', type: 'Overtime payout', amount: 'R4,200', status: 'Pending', date: '2026-09-10' },
  { employee: 'S. Mokoena', type: 'Travel advance', amount: 'R3,800', status: 'Approved', date: '2026-09-12' },
  { employee: 'K. Dlamini', type: 'Meal allowance', amount: 'R1,750', status: 'Processing', date: '2026-09-15' },
];

export default function AdvancePage() {
  const totalAmount = advanceEntries.reduce((sum, row) => {
    const amount = Number(String(row.amount).replace(/[^\d]/g, ''));
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Advance & Overtime</h1>
          <p className="text-muted-foreground">Approved and pending advances across the payroll cycle.</p>
        </div>
        <PdfExportButton label="Download advance report" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total payout</p>
          <p className="mt-2 text-3xl font-bold">R{totalAmount.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{advanceEntries.filter((row) => row.status === 'Approved').length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{advanceEntries.filter((row) => row.status === 'Pending' || row.status === 'Processing').length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {advanceEntries.map((entry) => (
                <tr key={`${entry.employee}-${entry.type}`} className="border-t">
                  <td className="px-4 py-3">{entry.employee}</td>
                  <td className="px-4 py-3">{entry.type}</td>
                  <td className="px-4 py-3 font-medium">{entry.amount}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium capitalize">{entry.status}</span>
                  </td>
                  <td className="px-4 py-3">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
