'use client';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function PdfExportButton({ label = 'Export PDF' }: { label?: string }) {
  const handleExport = () => {
    window.print();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleExport}
      className="no-print inline-flex items-center gap-2 rounded-md"
    >
      <Download className="size-4" />
      {label}
    </Button>
  );
}
