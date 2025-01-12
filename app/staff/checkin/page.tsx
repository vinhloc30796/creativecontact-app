import { redirect } from 'next/navigation'
import { verifyStaffAuth } from '@/app/actions/auth/staff'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import CheckinPage from './_sections/_checkin'

export default async function Page() {
  const result = await verifyStaffAuth()

  // Handle authentication failure
  if (!result.success) {
    if (result.redirect) {
      redirect(result.redirect)
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          {result.error || 'Please log in to access this page'}
        </AlertDescription>
      </Alert>
    )
  }

  // Handle missing email (should not happen if auth is successful)
  if (!result.user?.email) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Staff email is required for check-in functionality. Please ensure you are properly logged in.
        </AlertDescription>
      </Alert>
    )
  }

  // Render checkin page with verified user email
  return <CheckinPage userEmail={result.user.email} />
}