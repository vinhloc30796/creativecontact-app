// File: app/staff/signup/action.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

type SignupResult =
  | { success: true }
  | { success: false; error: string };

export async function signup(formData: FormData): Promise<SignupResult> {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(`Signup error: ${error.message}`);
    return { success: false, error: error.message };
  }

  revalidatePath("/staff", "layout");
  redirect("/staff/checkin");
  return { success: true };
}
