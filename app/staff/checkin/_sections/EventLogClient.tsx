// EventLogClient.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventLogProps {
  logs: Array<{
    id: string;
    guest_name: string;
    status_after: string;
    changed_at: string;
    staff_id: string;
  }>;
}

export function EventLogClient({ logs }: EventLogProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Event log</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.map((log) => (
          <div key={log.id} className="mb-2">
            <strong>{log.guest_name}</strong>{' '}
            {log.status_after.toLowerCase()} at{' '}
            <strong>{log.changed_at}</strong> by{' '}
            <strong>{log.staff_id}</strong>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}