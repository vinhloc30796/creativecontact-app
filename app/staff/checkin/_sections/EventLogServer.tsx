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
        eventRegistrationId: eventRegistrationLogs.id,
        changedAt: eventRegistrationLogs.changedAt,
        statusBefore: eventRegistrationLogs.statusBefore,
        statusAfter: eventRegistrationLogs.statusAfter,
        guestName: eventRegistrations.name,
        staffId: authUsers.id,
      })
      .from(eventRegistrationLogs)
      .innerJoin(eventRegistrations, eq(eventRegistrationLogs.eventRegistrationId, eventRegistrations.id))
      .innerJoin(authUsers, eq(eventRegistrationLogs.staffId, authUsers.id))
      .orderBy(desc(eventRegistrationLogs.changedAt))
      .limit(5);

      return logs.map(log => ({
        ...log,
        eventRegistrationId: log.eventRegistrationId as `${string}-${string}-${string}-${string}-${string}`,
        staffId: log.staffId as `${string}-${string}-${string}-${string}-${string}`
      }));
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
            <div key={log.eventRegistrationId} className="mb-2">
              <strong>{log.guestName}</strong>{' '}
              {log.statusAfter.toLowerCase()} at{' '}
              <strong>{formatDate(log.changedAt)}</strong> by{' '}
              <strong>{log.staffId}</strong>
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