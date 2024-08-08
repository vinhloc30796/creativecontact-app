// File: app/staff/checkin/_sections/EventLogServer.tsx
"use server";

import React from 'react';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from '@/lib/db';
import { eventRegistrationLogs, eventRegistrations, authUsers } from '@/drizzle/schema';

interface EventLog {
  id: string;
  changed_at: Date;
  status_after: string;
  guest_name: string;
  staff_id: string;
}

export async function getEventLogs(): Promise<EventLog[]> {
  try {
    const logs = await db
      .select({
        id: eventRegistrationLogs.id,
        changed_at: eventRegistrationLogs.changedAt,
        status_after: eventRegistrationLogs.statusAfter,
        guest_name: eventRegistrations.name,
        staff_id: authUsers.id,
      })
      .from(eventRegistrationLogs)
      .innerJoin(eventRegistrations, eq(eventRegistrationLogs.eventRegistrationId, eventRegistrations.id))
      .innerJoin(authUsers, eq(eventRegistrationLogs.staffId, authUsers.id))
      .orderBy(desc(eventRegistrationLogs.changedAt))
      .limit(5);

    return logs;
  } catch (error) {
    console.error('Error fetching event logs:', error);
    return [];
  }
}

function formatDate(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default async function EventLog() {
  const logs = await getEventLogs();

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
            <strong>{formatDate(log.changed_at)}</strong> by{' '}
            <strong>{log.staff_id}</strong>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}