export const dynamic = 'force-dynamic'; // Force dynamic rendering

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { verifyStaffAuth } from '@/app/actions/auth/staff'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import CheckinPage from './_sections/_checkin'
import { Skeleton } from "@/components/ui/skeleton"

// Loading component for Suspense fallback
function LoadingState() {
  return (
    <div className="w-[400px] space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

export default async function Page() {
  try {
    const result = await verifyStaffAuth()

    // Handle authentication failure
    if (result.error) {
      console.error('Staff authentication error:', result.error)
      return (
        <Suspense fallback={<LoadingState />}>
          <CheckinPage
            userEmail=""
            error={{
              message: 'Your session has expired. Please log in again.',
              code: 'AUTH_ERROR'
            }}
          />
        </Suspense>
      )
    }

    // Handle missing data
    if (!result.data?.email) {
      return (
        <Suspense fallback={<LoadingState />}>
          <CheckinPage
            userEmail=""
            error={{
              message: 'Please log in with your staff account to access check-in.',
              code: 'MISSING_EMAIL'
            }}
          />
        </Suspense>
      )
    }

    // Render checkin page with verified user email
    return (
      <Suspense fallback={<LoadingState />}>
        <CheckinPage userEmail={result.data.email} />
      </Suspense>
    )
  } catch (error) {
    console.error('Unexpected error in checkin page:', error)
    return (
      <Suspense fallback={<LoadingState />}>
        <CheckinPage
          userEmail=""
          error={{
            message: 'Something went wrong. Please try refreshing the page.',
            code: 'UNKNOWN_ERROR'
          }}
        />
      </Suspense>
    )
  }
}
