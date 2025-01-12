// File: app/staff/login/page.tsx

"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
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
import { loginStaff } from '@/app/actions/auth/staff'
import type { AuthResult, StaffUser } from '@/app/actions/auth/types'

// Schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const initialState: AuthResult<StaffUser> = {
  data: null,
  error: null
}

export default function LoginPage() {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const { handleSubmit, formState: { errors } } = form

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    console.debug('[LoginPage] Form submitted with data:', data)

    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    const result = await loginStaff(initialState, formData)

    if (result.error) {
      console.error('[LoginPage] Login failed:', result.error)
    } else {
      router.push('/staff/checkin')
    }
  }

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/staff/signup')
  }

  const getFormErrors = () => {
    if (!form.formState.isValid) {
      return Object.values(form.formState.errors)
        .map(error => error?.message)
        .filter(Boolean)
        .join(', ') || 'Please fill out all fields'
    }
    return null
  }

  console.debug('[LoginPage] Current state:', form.formState)

  return (
    <BackgroundDiv>
      <Card className="w-full max-w-md">
        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
              {getFormErrors() && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{getFormErrors()}</AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </BackgroundDiv>
  )
}