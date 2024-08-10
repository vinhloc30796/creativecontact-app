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
    id: log.eventRegistrationId,
    guest_name: log.guestName,
    status_after: log.statusAfter,
    changed_at: formatDate(log.changedAt),
    staff_id: log.staffId,
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