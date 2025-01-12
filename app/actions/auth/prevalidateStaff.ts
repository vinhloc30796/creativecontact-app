"use server-only";

import { z } from "zod";
import { AuthResult } from "./types";

const STAFF_PASSWORD = process.env.STAFF_PASSWORD || 'your_default_password_here'

/**
 * Validates a staff member's password against a predefined secret password
 * Just so that we can limit who can sign up for staff
 * @param password - The password to validate
 * @returns AuthResult containing success/failure status and any error details
 * @throws {Error} If environment variable STAFF_SUPER_SECRET_PASSWORD is not set
 */
export async function prevalidateStaff(password: string): Promise<AuthResult> {
  console.log('STAFF_PASSWORD', STAFF_PASSWORD)
  // Success
  if (password === STAFF_PASSWORD) {
    return {
      data: true,
      error: null,
    };
  }

  // Failed
  return {
    data: false,
    error: {
      code: "INVALID_PASSWORD",
      message: "Invalid password",
    },
  };
}