import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function StaffSignupPendingApprovalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Registration Submitted</CardTitle>
          <CardDescription>
            Thank you for registering. Your account is currently pending approval from an administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You will receive an email notification once your account has been reviewed. This usually takes
              1-2 business days.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              If you have any urgent inquiries, please contact support.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button asChild className="w-full">
            <Link href="/">Return to Homepage</Link>
          </Button>
          <Button asChild variant="link" className="w-full">
            <Link href="/staff/login">Try Logging In Later</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
