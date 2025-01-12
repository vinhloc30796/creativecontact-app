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

  const form = useForm<StaffSignupInput>({
    resolver: zodResolver(staffSignupInputSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: StaffSignupInput) => {
    setIsLoading(true)
    console.debug('[SignupPage] Form submitted with data:', data)

    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('confirmPassword', data.confirmPassword)
      formData.append('name', data.name || '')

      const result = await signupStaff(initialState, formData)

      if (result.error) {
        console.error('[SignupPage] Signup failed:', result.error)
        form.setError('root', {
          type: 'manual',
          message: result.error.message
        })
      } else {
        router.push('/staff/login')
      }
    } catch (error) {
      console.error('[SignupPage] Unexpected error:', error)
      form.setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.'
      })
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
                    <FormLabel>Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
              {form.formState.errors.root && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </BackgroundDiv>
  )
}