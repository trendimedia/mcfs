import PdfExportButton from '@/components/pdf-export-button';

const terminationRecords = [
  { employee: 'L. Jacobs', reason: 'Role restructure', status: 'Pending review', lastUpdated: '2026-09-06' },
  { employee: 'P. Smith', reason: 'Performance plan not met', status: 'Approved', lastUpdated: '2026-09-12' },
  { employee: 'N. Botha', reason: 'Contract expiry', status: 'Archived', lastUpdated: '2026-09-08' },
];

export default function TerminationPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Termination</h1>
          <p className="text-muted-foreground">Employee exit cases, reviews, and status tracking.</p>
        </div>
        <PdfExportButton label="Download termination report" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Open cases</p>
          <p className="mt-2 text-3xl font-bold">{terminationRecords.filter((row) => row.status === 'Pending review').length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{terminationRecords.filter((row) => row.status === 'Approved').length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Archived</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{terminationRecords.filter((row) => row.status === 'Archived').length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {terminationRecords.map((entry) => (
                <tr key={entry.employee} className="border-t">
                  <td className="px-4 py-3">{entry.employee}</td>
                  <td className="px-4 py-3">{entry.reason}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{entry.status}</span>
                  </td>
                  <td className="px-4 py-3">{entry.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
