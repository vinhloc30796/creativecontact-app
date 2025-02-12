"use server";

import { cookiePolicy } from "@/app/collections/staff";
import { StaffCleanSignupInput } from "@/app/staff/signup/types";
import { getCustomPayload } from "@/lib/payload";
import { cookies } from "next/headers";
import { z } from "zod";
import { prevalidateStaff } from "./prevalidateStaff";
import { AuthResult, StaffUser } from "./types";

const payload = await getCustomPayload()

// Define input schema
const loginInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginStaff(
  prevState: AuthResult<StaffUser>,
  formData: FormData,
): Promise<AuthResult<StaffUser>> {
  try {
    // Validate input
    const parsed = loginInputSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed || !parsed.success) {
      return {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid email or password format",
        },
      };
    }

    const { email, password } = parsed.data;

    // Authenticate with Payload
    const { user, token } = await payload.login({
      collection: "staff",
      data: { email, password },
    });

    console.debug(
      "[loginStaff] user authenticated:",
      user,
      " with token:",
      token,
    );

    if (!user || !token) {
      console.error("[loginStaff] user or token not found");
      return {
        data: null,
        error: {
          code: "AUTH_ERROR",
          message: "Invalid credentials",
        },
      };
    }

    // Set staff auth cookie
    const cookieStore = await cookies();
    cookieStore.set("payloadStaffAuth", "true", {
      httpOnly: true,
      secure: cookiePolicy.secure as boolean,
      sameSite: cookiePolicy.sameSite as "lax" | "strict" | "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    cookieStore.set("payload-token", token, {
      httpOnly: true,
      secure: cookiePolicy.secure as boolean,
      sameSite: cookiePolicy.sameSite as "lax" | "strict" | "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return {
      data: {
        id: user.id,
        email: user.email,
        collection: user.collection,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as StaffUser,
      error: null,
    };
  } catch (error) {
    console.error("[loginStaff] error:", error);
    return {
      data: null,
      error: {
        code: "AUTH_ERROR",
        message: "Invalid credentials",
      },
    };
  }
}

export async function verifyStaffAuth(): Promise<AuthResult<StaffUser>> {
  try {

    const cookieStore = await cookies();
    const authHeaders = new Headers({ cookie: cookieStore.toString() });

    console.debug(
      "[verifyStaffAuth] attempting verification with headers",
      authHeaders,
    );
    const { user } = await payload.auth({ headers: authHeaders });

    if (!user) {
      console.warn("[verifyStaffAuth] user not found");
      return {
        data: null,
        error: {
          code: "USER_NOT_FOUND",
          message: "Authentication required",
        },
      };
    }

    if (!user.email) {
      console.warn("[verifyStaffAuth] user email missing");
      return {
        data: null,
        error: {
          code: "AUTH_ERROR",
          message: "Staff email is required for check-in functionality",
        },
      };
    }

    console.info("[verifyStaffAuth] user verified:", user.email);
    return {
      data: user as StaffUser,
      error: null,
    };
  } catch (error) {
    console.error("[verifyStaffAuth] error:", error);
    return {
      data: null,
      error: {
        code: "AUTH_ERROR",
        message: "Authentication failed",
      },
    };
  }
}

export async function signupStaff(
  initialState: AuthResult<StaffUser>,
  data: StaffCleanSignupInput,
): Promise<AuthResult<StaffUser>> {
  try {
    // Validate staff secret first
    const validationResult = await prevalidateStaff(data.staffSecret)
    if (validationResult.error) {
      return {
        data: null,
        error: validationResult.error
      }
    }

    console.debug("[signupStaff] Starting signup process...");

    // Create staff member
    const newStaff = await payload.create({
      collection: "staff",
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        // Default roles
        roles: ["check-in", "content-creator"],
        active: true,
      },
    });

    if (!newStaff) {
      console.error("[signupStaff] Failed to create staff member");
      return {
        data: null,
        error: {
          code: "CREATION_ERROR",
          message: "Failed to create staff account",
        },
      };
    }

    console.debug(
      "[signupStaff] Staff member created successfully:",
      newStaff.id,
    );

    return {
      data: {
        id: newStaff.id,
        email: newStaff.email,
        collection: newStaff.collection,
        createdAt: newStaff.createdAt,
        updatedAt: newStaff.updatedAt,
      } as StaffUser,
      error: null,
    };
  } catch (error) {
    const data = error instanceof Error && 'data' in error ? error.data : null;
    const cause = error instanceof Error ? error.cause : null;
    console.error("[signupStaff] error:", error, 'with data:', data, 'and cause:', cause);

    // Check if email already exists in either cause or data
    const isEmailAlreadyRegistered = (obj: any) => obj &&
      typeof obj === 'object' &&
      'errors' in obj &&
      Array.isArray(obj.errors) &&
      obj.errors.some((e: { path: string, message: string }) =>
        e.path === 'email' && e.message.includes('already registered')
      );

    const duplicateEmailExists = isEmailAlreadyRegistered(cause) || isEmailAlreadyRegistered(data);
    if (duplicateEmailExists) {
      return {
        data: null,
        error: {
          code: "DUPLICATE_EMAIL",
          message: "Email already exists",
        },
      };
    }

    return {
      data: null,
      error: {
        code: "SIGNUP_ERROR",
        message: "Failed to create staff account",
      },
    };
  }
}
