import { z } from "zod";

export const staffSignupInputSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    name: z.string().optional().default(''),
    staffSecret: z.string().min(1, "Staff secret is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match confirmation password",
    path: ["confirmPassword"],
  });

export type StaffSignupInput = z.infer<typeof staffSignupInputSchema>;
export type StaffCleanSignupInput = Omit<StaffSignupInput, "confirmPassword">;
