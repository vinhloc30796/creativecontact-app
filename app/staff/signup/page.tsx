// File: app/staff/signup/page.tsx
"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// UI Components
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv'
import { AlertCircle } from 'lucide-react'

// Auth & Types
import { signupStaff } from '@/app/actions/auth/staff'
import type { AuthResult, StaffUser } from '@/app/actions/auth/types'
import { staffSignupInputSchema, type StaffSignupInput } from './types'

const initialState: AuthResult<StaffUser> = {
  data: null,
  error: null
}

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFormReady, setIsFormReady] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<StaffSignupInput>({
    resolver: zodResolver(staffSignupInputSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  React.useEffect(() => {
    setIsFormReady(true)
  }, [])

  React.useEffect(() => {
    const subscription = form.watch(() => {
      if (formError) setFormError(null)
    })
    return () => subscription.unsubscribe()
  }, [form, formError])

  const onSubmit = async (data: StaffSignupInput) => {
    setIsLoading(true)
    console.debug('[SignupPage] Form submitted with data:', data)

    try {
      const result = await signupStaff(initialState, data)

      if (result.error) {
        console.error('[SignupPage] Signup failed:', result.error)
        if (result.error.code === 'DUPLICATE_EMAIL') {
          form.setError('email', {
            type: 'manual',
            message: result.error.message
          })
        } else {
          setFormError('An unexpected error occurred. Please try again.')
        }
      } else {
        router.push('/staff/login')
      }
    } catch (error) {
      console.error('[SignupPage] Unexpected error:', error)
      setFormError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/staff/login')
  }

  const getFormErrors = () => {
    if (!form.formState.isValid) {
      return Object.values(form.formState.errors)
        .map(error => error?.message)
        .filter(Boolean)
        .join(', ') || 'Please fill out all required fields'
    }
    return null
  }

  if (!isFormReady) {
    return (
      <BackgroundDiv>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Loading...</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-slate-100">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 animate-pulse rounded" />
              <div className="h-10 bg-gray-200 animate-pulse rounded" />
              <div className="h-10 bg-gray-200 animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      </BackgroundDiv>
    )
  }

  return (
    <BackgroundDiv>
      <Card className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Staff: Sign Up</CardTitle>
              <CardDescription className="text-muted-foreground text-center">
                Create an account to check-in guests to the event.
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
                        placeholder="john.doe@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    {form.formState.touchedFields.email && <FormMessage />}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    {form.formState.touchedFields.name && <FormMessage />}
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
                        placeholder="Create a strong password (min. 8 characters)"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    {form.formState.touchedFields.password && <FormMessage />}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    {form.formState.touchedFields.confirmPassword && <FormMessage />}
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
                        <Button
                          type="submit"
                          disabled={!form.formState.isValid || isLoading}
                        >
                          {isLoading ? 'Signing up...' : 'Sign up'}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{form.formState.isValid ? 'Ready to sign up' : getFormErrors()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  onClick={handleLoginClick}
                  variant="outline"
                  disabled={isLoading}
                >
                  Back to Login
                </Button>
              </div>
              {formError && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </BackgroundDiv>
  )
}