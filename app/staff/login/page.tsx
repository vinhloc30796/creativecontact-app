// File: app/staff/login/page.tsx

"use client"

import React, { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// UI Components
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv'
import { AlertCircle } from 'lucide-react'

// Auth
import { authenticateStaff } from '@/app/actions/auth/staff'
import type { StaffLoginResult } from '@/app/actions/auth/staff'

// Schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const initialState: StaffLoginResult = {
  success: false,
  error: undefined,
  user: undefined,
  redirect: undefined,
}

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(authenticateStaff, initialState)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  // Handle successful login redirect
  React.useEffect(() => {
    if (state.success && state.redirect) {
      router.push(state.redirect)
    }
  }, [state.success, state.redirect, router])

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/staff/signup')
  }

  const getFormErrors = () => {
    const errors = form.formState.errors
    if (Object.keys(errors).length === 0 && !form.formState.isValid) {
      return 'Please fill out all fields'
    }
    return Object.values(errors).map(error => error.message).join(', ')
  }

  return (
    <BackgroundDiv>
      <Card className="w-full max-w-md">
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Staff: Login</CardTitle>
              <CardDescription className="text-muted-foreground text-center">
                Once logged in, you can check-in guests to the event.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-slate-100">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="username"
                        {...field}
                        name="email"
                      />
                    </FormControl>
                    {form.formState.touchedFields.email && <FormMessage />}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        {...field}
                        name="password"
                      />
                    </FormControl>
                    {form.formState.touchedFields.password && <FormMessage />}
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="flex justify-between w-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block">
                        <Button type="submit" disabled={!form.formState.isValid}>Log in</Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{form.formState.isValid ? 'Ready to log in' : getFormErrors()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button onClick={handleSignupClick} variant="outline">Sign up</Button>
              </div>
              {state.error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </BackgroundDiv>
  )
}