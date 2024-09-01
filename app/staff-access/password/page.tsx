// File: app/staff-access/password/page.tsx

'use client'

import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const staffPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

type StaffPasswordFormData = {
  password: string
}

function StaffPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom') || '/staff/checkin'
  const form = useForm<StaffPasswordFormData>({
    resolver: zodResolver(staffPasswordSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: StaffPasswordFormData) => {
    const response = await fetch('/staff-access/password-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: data.password }),
    })

    if (response.ok) {
      router.push(redirectedFrom)
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <BackgroundDiv>
      <Card className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Staff Access</CardTitle>
              <CardDescription className="text-center">Please enter your password to continue</CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-slate-100">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </BackgroundDiv>
  )
}

export default function StaffPasswordPage() {
  // Hydrate client side
  const [isClientSide, setIsClientSide] = useState<boolean>(false)
  useEffect(() => {
    setIsClientSide(true)
  }, [])

  if (typeof window === 'undefined' || !isClientSide) {
    return null
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffPasswordForm />
    </Suspense>
  )
}
