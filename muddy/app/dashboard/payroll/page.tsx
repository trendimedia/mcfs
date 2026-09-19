import PdfExportButton from '@/components/pdf-export-button';

const payrollEntries = [
  { employee: 'A. Ndlovu', gross: 'R28,500', deductions: 'R3,200', net: 'R25,300', status: 'Paid' },
  { employee: 'M. Khumalo', gross: 'R24,800', deductions: 'R2,050', net: 'R22,750', status: 'Pending' },
  { employee: 'S. Mokoena', gross: 'R26,300', deductions: 'R2,700', net: 'R23,600', status: 'Paid' },
  { employee: 'K. Dlamini', gross: 'R22,900', deductions: 'R1,900', net: 'R21,000', status: 'Pending' },
];

export default function PayrollPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll</h1>
          <p className="text-muted-foreground">Monthly payroll summary and payment status.</p>
        </div>
        <PdfExportButton label="Download payroll report" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Gross payroll</p>
          <p className="mt-2 text-3xl font-bold">R102,500</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Deductions</p>
          <p className="mt-2 text-3xl font-bold">R9,850</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Net payroll</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">R92,650</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Gross</th>
                <th className="px-4 py-3 font-medium">Deductions</th>
                <th className="px-4 py-3 font-medium">Net</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payrollEntries.map((entry) => (
                <tr key={entry.employee} className="border-t">
                  <td className="px-4 py-3">{entry.employee}</td>
                  <td className="px-4 py-3">{entry.gross}</td>
                  <td className="px-4 py-3">{entry.deductions}</td>
                  <td className="px-4 py-3 font-medium">{entry.net}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${entry.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'}`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
