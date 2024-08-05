// File: app/staff/checkin/_sections/EventLogWrapper.tsx
import { EventLogClient } from './EventLogClient';
import { getEventLogs } from './EventLogServer';

function formatDate(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default async function EventLogWrapper() {
  const logs = await getEventLogs();
  const formattedLogs = logs.map(log => ({
    ...log,
    changed_at: formatDate(log.changed_at)
  }));

  return <EventLogClient logs={formattedLogs} />;
}