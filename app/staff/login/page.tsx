// File: app/staff/login/page.tsx

"use client"

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { login } from './actions';
import { BackgroundDiv } from '@/app/components/BackgroundDiv';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  let [loginError, setLoginError] = React.useState<string | null>(null);

  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    console.log("Attempting login for email:", data.email);
    const result = await login(formData).then(
      res => {
        if (res.error) {
          console.error('Error logging in:', res.error);
          setLoginError(res.error);
          return { success: false, error: res.error };
        } else console.log("Login successful")
      }
    ).catch(err => {
      console.error('Error logging in:', err);
      setLoginError('An unexpected error occurred. Please try again later.');
      return { success: false, error: 'An unexpected error occurred. Please try again later.' };
    });
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/staff/signup');
  };

  const getFormErrors = () => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length === 0 && !form.formState.isValid) {
      return 'Please fill out all fields';
    }
    return Object.values(errors).map(error => error.message).join(', ');
  };

  return (
    <BackgroundDiv>
      <Card className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        // Autocomplete attribute
                        autoComplete="username"
                        {...field}
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
                        // Autocomplete attribute
                        autoComplete="current-password"
                        {...field}
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
              {loginError && <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
              }
            </CardFooter>
          </form>
        </Form>
      </Card>
    </BackgroundDiv>
  );
}