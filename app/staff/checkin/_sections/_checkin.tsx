// File: app/staff/checkin/_sections/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from '@/lib/utils'
import { createClient } from "@/utils/supabase/server"
import { redirect } from 'next/navigation'
import styles from './_checkin.module.scss'
import { EventLogWrapper } from './EventLogWrapper'
import QRScanButton from './QRScanButton'
import SuspenseManualSearch from './SuspenseManualSearch'

export default async function CheckinPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/staff/login')
  }

  const userEmail = user.email;

  return (
    <div className={cn('min-h-screen container flex items-center justify-center bg-slate-50', styles.container)}>
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b">
          <div className="flex gap-4 items-center">
            <div className="aspect-square border rounded w-20 flex-shrink-0" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover' }}></div>
            <div className="flex flex-col">
              <CardTitle className="text-xl font-bold">Check-in for Event</CardTitle>
              <div className="flex items-center justify-between">
                <CardDescription className="text-muted-foreground">
                  {userEmail ? `Logged in as: ${userEmail}` : 'User info not available'}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        {userEmail &&
          <CardContent className="p-6 bg-slate-100 border-b">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex gap-4 w-full">
                <QRScanButton />
                <SuspenseManualSearch />
              </div>
              <div className="flex flex-col border rounded w-full bg-white p-4">
                <h3 className={cn('text-lg font-bold', styles.title)}>Event statistics</h3>
                <p>Event statistics will be displayed here.</p>
              </div>
              <div className="flex flex-col border rounded w-full bg-white p-4">
                <h3 className={cn('text-lg font-bold', styles.title)}>Timeslot statistics</h3>
                <p>Event statistics will be displayed here.</p>
              </div>
              <EventLogWrapper />
            </div>
          </CardContent>
        }
        <CardFooter className="flex justify-between mt-4">
          <form action="/staff/signout" method="POST" className="w-full">
            <Button type="submit" variant={'secondary'} className="w-full">
              {userEmail ? "Sign out" : "Retry"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}