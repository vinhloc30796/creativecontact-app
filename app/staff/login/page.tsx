"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from './actions';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
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
    await login(formData);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
            <CardFooter className="flex justify-between">
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
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}