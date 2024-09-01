import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from '@/lib/utils'
import styles from './_checkin.module.scss'
import { SuspenseEventLog } from './SuspenseEventLog'
import QRScanButton from './QRScanButton'
import SuspenseManualSearch from './SuspenseManualSearch'
import { BackgroundDiv } from '@/app/components/BackgroundDiv';

interface CheckinPageProps {
  userEmail: string;
}

export default async function CheckinPage({ userEmail }: CheckinPageProps) {
  return (
    <BackgroundDiv>
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b">
          <div className="flex flex-col">
            <CardTitle className="text-xl font-bold">Check-in for Event</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription className="text-muted-foreground">
                {userEmail ? `Logged in as: ${userEmail}` : 'User info not available'}
              </CardDescription>
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
              <SuspenseEventLog />
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
    </BackgroundDiv>
  )
}