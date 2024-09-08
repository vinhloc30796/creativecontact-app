// File: app/staff/signup/action.ts

"use server";

import { checkUserEmailConfirmed } from "@/app/actions/user/auth";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendSignInWithOtp } from "@/app/actions/email/sendSignIn";

type SignupResult =
  | { success: true }
  | { success: false; error: string };

export async function signup(formData: FormData): Promise<SignupResult> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const data = { email, password };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(`Signup error: ${error.message}`);
    return { success: false, error: error.message };
  }

  const emailConfirmed: boolean = (await checkUserEmailConfirmed(email)) ?? false;
  let result: SignupResult;
  if (!emailConfirmed) {
    result = await sendSignInWithOtp(email, { redirectTo: "/staff/login" }) as SignupResult;
  } else {
    console.log("Email already confirmed");
    result = { success: true } as SignupResult;
  }
  if (result.success) {
    revalidatePath("/staff", "layout");
    redirect("/staff/login");
  } else {
    console.error(`Signup error: ${result.error}`);
    return { success: false, error: result.error };
  }
}
