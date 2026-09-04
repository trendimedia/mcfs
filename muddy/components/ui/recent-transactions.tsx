'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Plus,
  MoreVertical,
  History,
} from 'lucide-react';

const transactions = [
  {
    id: 1,
    description: 'Annual Vacation Leave',
    amount: -85.2,
    category: 'Paid Time Off',
    date: '2024-01-15',
    type: 'expense',
    merchant: 'HR Dept',
  },
  {
    id: 2,
    description: 'Earned Leave Accrual',
    amount: 3200.0,
    category: 'Accrual',
    date: '2024-01-14',
    type: 'income',
    merchant: 'Payroll System',
  },
  {
    id: 3,
    description: 'Medical Sick Leave',
    amount: -15.99,
    category: 'Sick Leave',
    date: '2024-01-13',
    type: 'expense',
    merchant: 'Health Services',
  },
  {
    id: 4,
    description: 'Casual Personal Leave',
    amount: -45.0,
    category: 'Casual Leave',
    date: '2024-01-12',
    type: 'expense',
    merchant: 'HR Dept',
  },
  {
    id: 5,
    description: 'Rollover Balance Adjustment',
    amount: 850.0,
    category: 'Accrual',
    date: '2024-01-11',
    type: 'income',
    merchant: 'HR Ops',
  },
  {
    id: 6,
    description: 'Doctor Appointment Half-Day',
    amount: -12.5,
    category: 'Sick Leave',
    date: '2024-01-10',
    type: 'expense',
    merchant: 'Medical Clinic',
  },
  {
    id: 7,
    description: 'Overtime Compensation Time',
    amount: 120.0,
    category: 'Accrual',
    date: '2024-01-09',
    type: 'income',
    merchant: 'Resource Mgmt',
  },
  {
    id: 8,
    description: 'Bereavement Leave',
    amount: -35.0,
    category: 'Special Leave',
    date: '2024-01-08',
    type: 'expense',
    merchant: 'HR Dept',
  },
  {
    id: 9,
    description: 'Parental Leave Request',
    amount: -60.0,
    category: 'Parental Leave',
    date: '2024-01-07',
    type: 'expense',
    merchant: 'People Ops',
  },
  {
    id: 10,
    description: 'Performance Days Awarded',
    amount: 500.0,
    category: 'Accrual',
    date: '2024-01-06',
    type: 'income',
    merchant: 'Executive Team',
  },
];

export default function RecentTransactions() {
  return (
    <>
      <Card className="bg-background gap-0 overflow-hidden rounded-lg p-0 shadow-none">
        <CardHeader className="bg-background flex flex-col items-center justify-between gap-2 border-b !p-3 md:flex-row">
          <div className="flex items-center gap-2">
            <History className="size-10" />
            <div className="flex flex-col items-start gap-1">
              <CardTitle>
                <span>Leave Requests</span>
              </CardTitle>
              <span className="text-muted-foreground text-xs italic">
                <span className="text-green-500">Green</span> means gain,{' '}
                <span className="text-red-500">Red</span> means minus - track
                efficiency easily in your organisation
              </span>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary flex w-full items-center gap-2 rounded-sm text-white md:w-auto">
            <Plus className="size-4" />
            <span>Add New</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[25rem] space-y-3 overflow-auto p-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group from-secondary/30 hover:border-primary/50 flex items-center justify-between rounded-md border bg-gradient-to-r p-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-sm p-3 text-white ${
                      transaction.type === 'income'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpIcon className="size-5" />
                    ) : (
                      <ArrowDownIcon className="size-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium md:text-base">
                      {transaction.description}
                    </p>
                    <div className="flex flex-col gap-0.5 opacity-60 md:flex-row md:items-center md:gap-2">
                      <p className="text-[0.65rem] md:text-xs">
                        {transaction.merchant}
                      </p>
                      <span className="hidden md:block">•</span>
                      <p className="text-[0.65rem] md:text-xs">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex items-center justify-end gap-1 text-end">
                  <div className="flex flex-col items-center md:flex-row md:gap-4">
                    <span
                      className={`w-full text-sm font-bold md:text-lg ${
                        transaction.type === 'income'
                          ? 'text-green-500'
                          : 'text-primary'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <Badge
                      variant="outline"
                      className="mt-1 ml-auto rounded px-1.5 py-0 text-[0.6rem] md:mt-0 md:px-3 md:py-1.5 md:text-xs"
                    >
                      {transaction.category}
                    </Badge>
                  </div>
                  <button>
                    <MoreVertical className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
