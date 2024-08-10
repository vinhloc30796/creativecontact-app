// File: app/staff/checkin/_sections/EventLogWrapper.tsx
"use client";

import { EventLogClient } from './EventLogClient';
import { getEventLogs } from './EventLogServer';

function formatDate(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export async function EventLogWrapper() {
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