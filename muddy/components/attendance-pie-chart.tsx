'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type AttendancePieChartProps = {
  present: number;
  absent: number;
};

export default function AttendancePieChart({
  present,
  absent,
}: AttendancePieChartProps) {
  const total = present + absent || 1;
  const data = [
    { name: 'Present', value: present, color: '#22c55e' },
    { name: 'Absent', value: absent, color: '#3b82f6' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={88}
                paddingAngle={4}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${String(value ?? 0)} days`, 'Days']}
                labelFormatter={() => 'Attendance'}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Present</span>
            </div>
            <p className="text-2xl font-bold text-green-500">{present}</p>
            <p className="text-xs text-muted-foreground">
              {Math.round((present / total) * 100)}%
            </p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium">Absent</span>
            </div>
            <p className="text-2xl font-bold text-blue-500">{absent}</p>
            <p className="text-xs text-muted-foreground">
              {Math.round((absent / total) * 100)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
