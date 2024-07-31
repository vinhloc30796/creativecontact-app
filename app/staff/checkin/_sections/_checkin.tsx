// File: app/staff/checkin/_sections/_checkin.tsx
"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './_checkin.module.scss'
import QRScanButton from './QRScanButton'

interface CheckinPageProps {
  userEmail: string | null
}

export default function CheckinPage({ userEmail }: CheckinPageProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch('/staff/signout', { method: 'POST' });
      if (response.ok) {
        router.push('/staff/login');
      } else {
        console.error('Sign out failed');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

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
                <div className="flex flex-col items-center justify-center aspect-square border rounded w-full bg-white p-4">
                  <Search />
                  <span className="text-xs uppercase font-bold mt-2">Manual Search</span>
                </div>
              </div>
              <div className="flex flex-col border rounded w-full bg-white p-4">
                <h3 className={cn('text-lg font-bold', styles.title)}>Event statistics</h3>
                <p>Event statistics will be displayed here.</p>
              </div>
              <div className="flex flex-col border rounded w-full bg-white p-4">
                <h3 className={cn('text-lg font-bold', styles.title)}>Timeslot statistics</h3>
                <p>Event statistics will be displayed here.</p>
              </div>
              <div className="flex flex-col border rounded w-full bg-white p-4">
                <h3 className={cn('text-lg font-bold', styles.title)}>Event log</h3>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="">
                    <strong>Guest A</strong> checked in at <strong>10:00</strong> by <strong>Staff A</strong>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        }
        <CardFooter className="flex justify-between mt-4">
          <Button type="submit" onClick={handleSignOut} variant={'secondary'}
          className='w-full'
          >{userEmail ? "Sign out" : "Retry"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export { CheckinPage }
