import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv'
import { cn } from '@/lib/utils'
import { AlertCircle } from "lucide-react"
import Link from 'next/link'
import styles from './_checkin.module.scss'
import QRScanButton from './QRScanButton'
import { SuspenseEventLog } from './SuspenseEventLog'
import SuspenseManualSearch from './SuspenseManualSearch'

interface CheckinPageProps {
  userEmail: string;
  error?: {
    message: string;
    code?: string;
  };
}

export default async function CheckinPage({ userEmail, error }: CheckinPageProps) {
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

        {/* Error handling section */}
        {error && (
          <div className="p-4 border-b" role="alert" aria-live="polite">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                Oops!&nbsp;
                {error.code === 'AUTH_ERROR' && 'You\'re not logged in!'}
                {error.code === 'MISSING_EMAIL' && 'We couldn\'t find your account.'}
                {error.code === 'UNKNOWN_ERROR' && 'Something went wrong.'}
              </AlertTitle>
              <AlertDescription>
                {/* Map error codes to friendly messages */}
                {error.code === 'AUTH_ERROR' && 'Please log in again to continue.'}
                {error.code === 'MISSING_EMAIL' && 'Please make sure you are logged in with your staff account.'}
                {!error.code && error.message}
              </AlertDescription>
            </Alert>
          </div>
        )}

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
          {userEmail ? (
            <form action="/staff/signout" method="POST" className="w-full">
              <Button type="submit" variant={'secondary'} className="w-full">
                Sign out
              </Button>
            </form>
          ) : (
            <Link href="/staff/login" className="w-full">
              <Button variant={'secondary'} className="w-full">
                Login
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </BackgroundDiv>
  )
}