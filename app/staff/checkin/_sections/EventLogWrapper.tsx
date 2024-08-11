// File: app/staff/checkin/_sections/EventLogWrapper.tsx
import { Suspense } from 'react';
import { EventLogClient } from './EventLogClient';
import { getEventLogs } from './EventLogServer';

function formatDate(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function EventLogContent() {
  const logs = await getEventLogs();
  const formattedLogs = logs.map(log => ({
    id: log.event_registration_id,
    guest_name: log.guestName,
    status_after: log.status_after,
    changed_at: formatDate(log.changed_at),
    staff_id: log.staff_id,
  }));

  return <EventLogClient logs={formattedLogs} />;
}

export function EventLogWrapper() {
  return (
    <Suspense fallback={<div>Loading event logs...</div>}>
      <EventLogContent />
    </Suspense>
  );
}