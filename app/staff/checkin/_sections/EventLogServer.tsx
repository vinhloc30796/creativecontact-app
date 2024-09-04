// File: app/staff/checkin/_sections/EventLogServer.tsx
"use server";

import { EventRegistrationLog } from '@/app/types/EventRegistrationLog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authUsers } from "@/drizzle/schema/user";
import { eventRegistrationLogs, eventRegistrations } from "@/drizzle/schema/event";
import { datetimeFormatter } from '@/lib/timezones';
import { db } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';


export async function getEventLogs(): Promise<EventRegistrationLog[]> {
  try {
    const logs = await db
      .select({
        event_registration_id: eventRegistrationLogs.id,
        changed_at: eventRegistrationLogs.changed_at,
        status_before: eventRegistrationLogs.status_before,
        status_after: eventRegistrationLogs.status_after,
        guestName: eventRegistrations.name,
        staff_id: authUsers.id,
      })
      .from(eventRegistrationLogs)
      .innerJoin(eventRegistrations, eq(eventRegistrationLogs.event_registration_id, eventRegistrations.id))
      .innerJoin(authUsers, eq(eventRegistrationLogs.staff_id, authUsers.id))
      .orderBy(desc(eventRegistrationLogs.changed_at))
      .limit(6);

      return logs.map(log => log as EventRegistrationLog);
  } catch (error) {
    console.error('Error fetching event logs:', error);
    return [];
  }
}

export default async function EventLog() {
  try {
    const logs = await getEventLogs();
    console.debug('Event logs:', logs);
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Event log</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.map((log) => (
            <div key={log.event_registration_id} className="mb-2">
              <strong>{log.guestName}</strong>{' '}
              {log.status_after.toLowerCase()} at{' '}
              <strong>{datetimeFormatter.format(log.changed_at)}</strong> by{' '}
              <strong>{log.staff_id}</strong>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  catch (error) {
    console.error('Error fetching event logs:', error);
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Event log</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Error fetching event logs</p>
        </CardContent>
      </Card>
    )
  }
}