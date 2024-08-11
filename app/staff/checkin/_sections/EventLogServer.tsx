// File: app/staff/checkin/_sections/EventLogServer.tsx
"use server";

import React from 'react';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from '@/lib/db';
import { eventRegistrationLogs, eventRegistrations, authUsers } from '@/drizzle/schema';
import { EventRegistrationLog } from '@/app/types/EventRegistrationLog';


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
      .limit(5);

      return logs.map(log => log as EventRegistrationLog);
  } catch (error) {
    console.error('Error fetching event logs:', error);
    return [];
  }
}

function formatDate(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              <strong>{formatDate(log.changed_at)}</strong> by{' '}
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