// File: app/staff/checkin/_sections/EventLogWrapper.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { datetimeFormatter } from "@/lib/timezones";
import { Suspense } from 'react';
import { getEventLogs } from './EventLogServer';

async function EventLogContent() {
  const logs = await getEventLogs();
  const formattedLogs = logs.map(log => ({
    id: log.event_registration_id,
    guest_name: log.guestName,
    status_after: log.status_after,
    changed_at: datetimeFormatter.format(log.changed_at),
    staff_id: log.staff_id,
  }));

  return (
    formattedLogs.length === 0 ?
      (<div className="mb-2">No event logs available</div>) :
      <>
        {formattedLogs.map((log) => (
          <div key={log.id} className="mb-2">
            <strong>{log.guest_name}</strong>{' '}
            {log.status_after.toLowerCase()} at{' '}
            <strong>{log.changed_at}</strong> by{' '}
            <strong>{log.staff_id}</strong>
            {formattedLogs.length > 5 && (
              <div className="text-sm text-muted-foreground">There are more logs</div>
            )}
          </div>
        ))}
      </>
  );
}

export function SuspenseEventLog() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Event log</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="mb-2">Loading event logs</div>}>
          <EventLogContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}